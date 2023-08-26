import {defineStore} from 'pinia'
import {ref, watch} from 'vue'
import {path} from "@tauri-apps/api";
import {getContentApi, openFileApi, saveContentApi} from "../../api/file";
import {convertFileSrc} from "@tauri-apps/api/tauri";
import {confirm, open} from '@tauri-apps/plugin-dialog';
import {useSystemStore} from "./system";

type File = {
    basename: string
    filepath: string
    content: string
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        const fileCache = ref<File[]>([])
        const activeFile = ref<string>('')
        const changedFiles = ref<string[]>([])
        const editMode = ref<'wysiwyg' | 'ir' | 'sv'>('wysiwyg')
        const zenMode = ref<boolean>(false)

        return {fileCache, activeFile, changedFiles, editMode, zenMode}
    },
    actions: {
        isModified(path: string) {
            return this.changedFiles.indexOf(path) > -1
        },

        modify(path: string, content: string) {
            let index = this.find(path);
            if (index == -1) {
                return
            }

            const file = this.fileCache[index];
            file.content = content;

            if (this.changedFiles.indexOf(path) == -1) {
                this.changedFiles.push(path);
            }
        },

        async save(filepath: string) {
            const changedIndex = this.changedFiles.indexOf(filepath);
            if (changedIndex > -1) {
                let cacheIndex = this.find(filepath)
                const file = this.fileCache[cacheIndex]
                if (file == null) {
                    return;
                }
                const content = toLocalPath(file.content);
                await saveContentApi(filepath, content);

                this.changedFiles.splice(changedIndex, 1)
            }
        },
        async saveAs(currentFilepath: string, newFilepath: string) {
            const cacheIndex = this.find(currentFilepath);
            if (cacheIndex > -1) {
                const file = this.fileCache[cacheIndex]
                if (file == null) {
                    return;
                }
                file.filepath = newFilepath;
                file.basename = await path.basename(newFilepath)

                const content = toLocalPath(file.content);
                await saveContentApi(newFilepath, content);
            }

            const changedIndex = this.changedFiles.indexOf(currentFilepath);
            if (changedIndex >= 1) {
                this.changedFiles.splice(changedIndex, 1)
            }

            this.activeFile = newFilepath;
        },
        async saveAll() {
            let filesToSave: string[] = []
            for (const filepath of this.changedFiles) {
                filesToSave.push(filepath)
            }

            for (const filepath of filesToSave) {
                await this.save(filepath);
            }
        },

        find(filepath: string) {
            for (let i = 0; i < this.fileCache.length; i++) {
                if (this.fileCache[i].filepath === filepath) {
                    return i;
                }
            }

            return -1;
        },

        getContent(filepath: string) {
            const index = this.find(filepath);
            return this.fileCache[index].content;
        },

        async open() {
            try {
                const filepath = await openFileApi();
                if (filepath.length > 0) {
                    await this.read(filepath)
                }
            } catch (e:any) {
                message.error(e)
            }
        },
        async read(filepath: string) {
            let index = this.find(filepath);
            if (index === -1) {
                this.activeFile = filepath;
                let content = await getContentApi(filepath);
                content = toAssertUrl(content)

                let basename = await path.basename(filepath);

                const newFile: File = {basename, filepath, content}
                this.fileCache.push(newFile)

                index++;
            }

            this.activeFile = filepath;

            await useSystemStore().addHistory(filepath);
        },
        async readHistory(index: number) {
            let length = useSystemStore().history.length;

            let historyIndex = length - 1 - index;
            if (historyIndex >= 0) {
                let filepath = useSystemStore().history[historyIndex];
                await this.read(filepath);
            }
        },
        async closeAll() {
            await this.closeOthers(null)
        },
        async closeOthers(exceptFilepath: string | null) {
            const files: string[] = [];
            const changed: string[] = [];
            for (const openedFile of this.fileCache) {
                if (exceptFilepath == null || exceptFilepath !== openedFile.filepath) {
                    files.push(openedFile.filepath);

                    if (this.changedFiles.indexOf(openedFile.filepath) > -1) {
                        changed.push(openedFile.filepath);
                    }
                }
            }

            if (changed.length > 0) {
                const shouldSave = await confirm('有文件没有保存，是否进行保存？', {
                    type: 'warning',
                    cancelLabel: '不保存',
                    okLabel: '保存'
                });
                if (shouldSave) {
                    for (const fileToSave of changed) {
                        await this.save(fileToSave)
                    }
                }
            }

            for (const fileToClose of files) {
                this.close(fileToClose)
            }
        },

        close(filepath: string) {
            let index = this.find(filepath);

            if (index === -1) {
                console.log('File not found');
                return
            }

            this.fileCache.splice(index, 1);

            //如果关闭的是当前编辑器
            if (filepath === this.activeFile) {
                if (this.fileCache.length === 0) {
                    this.activeFile = ''
                } else {
                    if (index == 0) {
                        this.activeFile = this.fileCache[0].filepath
                    } else {
                        this.activeFile = this.fileCache[index - 1].filepath
                    }
                }
            }

            console.log("active", this.activeFile);
        },

        toggleZenMode() {
            if (this.activeFile != null && this.activeFile.length > 0) {
                this.zenMode = !this.zenMode
            }
        }
    }
})

function toAssertUrl(markdown: string): string {
    const regex = /!\[.*?\]\((.*?)\)/g;
    const convertedMarkdown = markdown.replace(regex, (match, url) => {
        return match.replace(url, convertFileSrc(url));
    });
    return convertedMarkdown;
}

function toLocalPath(markdown: string): string {
    const regex = /!\[.*?\]\((.*?)\)/g;
    const convertedMarkdown = markdown.replace(regex, (match, url) => {
        return match.replace(url, convertFilepath(url));
    });
    return convertedMarkdown;
}

function convertFilepath(filepath: string): string {
    const papth = navigator.userAgent.includes('Windows') ?
        filepath.replace(`https://asset.localhost/`, '')
        : filepath.replace(`asset://localhost/`, '');

    return decodeURIComponent(papth);
}
