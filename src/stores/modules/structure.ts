import {defineStore} from 'pinia'
import {reactive, ref, toRaw} from 'vue'
import {
    createDirApi,
    createFileApi,
    existPath,
    moveToTrashApi,
    readFolderApi,
    removeDirApi,
    removeFileApi
} from "../../api/file";
import {FileInfo, StructureNode} from "../../api/model";
import {useSystemStore} from "./system";
import {useEditorStore} from "./editor";
import path from "../../api/path";

export const useStructureStore = defineStore('structure', {
    state: () => {

        const list = ref<StructureNode[]>([]) //

        const dir = ref<StructureNode[]>([]) //

        let path = '';

        let currentDir = ref(toRaw(useSystemStore().workspace));

        let currentNode = ref<StructureNode>({
            title: "/",
            path: "/",
            key: "/",
            folder: true,
            children: []
        });


        return {path, currentDir, currentNode, list, dir}
    },

    actions: {


        async create(folder: string, basename: string, isFile: boolean) {
            let filepath = await path.join(folder, basename);

            if (isFile) {
                await createFileApi(filepath);
            } else {
                await createDirApi(filepath);
            }

            createNode(this.list, {title: basename, key: filepath, folder: !isFile, path: filepath});
        },
        move(from: string, to: string) {
            moveNode(this.list, from, to)
        },
        async rename(from: string, to: string) {
            let index = useEditorStore().fileCache.findIndex(file => file.filepath === from)
            if (index > -1) {
                useEditorStore().fileCache[index].basename = path.basename(to);
                useEditorStore().fileCache[index].filepath = to;
            }

            await updateNodePath(this.list, from, to)
        },
        async remove(path: string, isFile: boolean) {
            // if (isFile) {
            //     removeFileApi(path)
            // } else {
            //     removeDirApi(path)
            // }

            await moveToTrashApi(path)

            deleteNode(this.list, path)
        },

        async basename(filepath: string) {
            return await path.basename(filepath)
        },
        async load() {

            let path = useSystemStore().workspace;
            if (path === "") {
                return
            }

            this.currentDir = path;

            const aaa = await readFolderApi(path);

            this.list.length = 0; // 清空数组
            this.dir.length = 0; // 清空数组

            let xxx = await this.buildNode(aaa, false)
            this.list.push(...xxx)

            let yyy = await this.buildNode(aaa, true)
            this.dir.push(
                {
                    title: await this.basename(path),
                    key: path,
                    path: path,
                    folder: false,
                    children: yyy
                }
            );
        },

        async buildNode(res: FileInfo[], onlyDir: boolean) {
            //  console.log(":adsfasf", (res))
            if (!res.length) {
                return [];
            }
            let result: StructureNode[] = [];
            for (let val of res) {
                let {filePath, isFile} = val;
                // let title = filePath.split(path.sep).pop() as string;

                let children: StructureNode[] = [];
                if (isFile) {
                    if (!filePath.toLowerCase().endsWith(".md")) continue;
                    // title = title.substring(0, title.lastIndexOf("."));
                } else {
                    if (val.children) {
                        children = await this.buildNode(val.children, onlyDir)
                    }
                }
                if (onlyDir && !isFile || !onlyDir) {
                    result.push({
                        title: await this.basename(filePath),
                        path: filePath,
                        key: filePath,
                        folder: !isFile,
                        children
                    });
                }

            }

            result.sort((a, b) => {
                // 如果a是文件夹，b是文件，那么a排在前面
                if (!a.folder && b.folder) {
                    return 1;
                }
                // 如果a是文件，b是文件夹，那么b排在前面
                if (a.folder && !b.folder) {
                    return -1;
                }
                // 如果a和b都是文件夹或者都是文件，那么按照filePath进行字典序排序
                return a.path.localeCompare(b.path);
            })
            return result;
        },
        find(path: string) {

            return findNodeByPath(this.list, path);
        }
    },


})


function createNode(list: StructureNode[], newNode: StructureNode): StructureNode[] {

    const parentPath = getParentPath(newNode.path);
    const parentNode = findNodeByPath(list, parentPath);

    if (parentNode && parentNode.folder) {
        if (!parentNode.children) {
            parentNode.children = [];
        }
        parentNode.children.push(newNode);
    } else {
        list.push(newNode);
    }

    return list;
}


function deleteNode(list: StructureNode[], path: string): StructureNode[] {
    const parentPath = getParentPath(path);
    const parentNode = findNodeByPath(list, parentPath);

    let children: StructureNode[];
    if (parentNode && parentNode.folder && parentNode.children) {
        children = parentNode.children
    } else {
        children = list;
    }

    const index = findChildIndex(children, path);
    if (index !== -1) {
        children.splice(index, 1);
    }

    return list;
}

async function updateNodePath(list: StructureNode[], oldPath: string, newPath: string): Promise<StructureNode[]> {
    const targetNode = findNodeByPath(list, oldPath);

    if (targetNode) {
        targetNode.path = newPath;
        targetNode.key = newPath;
        targetNode.title = await path.basename(newPath);
    }

    return list;
}

function moveNode(list: StructureNode[], oldPath: string, newPath: string): StructureNode[] {
    const targetNode = findNodeByPath(list, oldPath);

    if (targetNode) {
        const newParentPath = getParentPath(newPath);
        const newParentNode = findNodeByPath(list, newParentPath);

        if (newParentNode && newParentNode.folder && newParentNode.children) {
            const insertIndex = findInsertIndex(newParentNode.children, targetNode);
            newParentNode.children.splice(insertIndex, 0, targetNode);

            deleteNode(list, oldPath);
        }
    }

    return list;
}

function findNodeByPath(list: StructureNode[], path: string): StructureNode | undefined {
    for (const node of list) {
        if (node.path === path) {
            return node;
        }
        if (node.folder && node.children) {
            const foundNode = findNodeByPath(node.children, path);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return undefined;
}

function getParentPath(path: string): string {
    const lastSlashIndex = path.lastIndexOf("/");
    return path.substring(0, lastSlashIndex);
}

function findInsertIndex(children: StructureNode[], node: StructureNode): number {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.folder && isChildPath(child.path, node.path)) {
            return i + 1;
        }
    }
    return 0;
}

function isChildPath(parentPath: string, childPath: string): boolean {
    return childPath.startsWith(parentPath + "/");
}

function findChildIndex(children: StructureNode[], path: string): number {
    for (let i = 0; i < children.length; i++) {
        if (children[i].path === path) {
            return i;
        }
    }
    return -1;
}

/*
function adjustList(listA: StructureNode[], listB: StructureNode[]): StructureNode[] {
    for (const nodeA of listA) {
        const correspondingNode = listB.find(nodeB => nodeB.path === nodeA.path);

        if (correspondingNode) {
            if (!isSameNode(nodeA, correspondingNode)) {
                updateNode(nodeA, correspondingNode);
            }
            if (nodeA.children && correspondingNode.children) {
                nodeA.children = adjustList(nodeA.children, correspondingNode.children);
            }
        } else {
            const index = listA.indexOf(nodeA);
            listA.splice(index, 1);
        }
    }

    for (const nodeB of listB) {
        const correspondingNode = listA.find(nodeA => nodeA.path === nodeB.path);

        if (!correspondingNode) {
            const index = listB.indexOf(nodeB);
            listA.splice(index, 0, nodeB);
        }
    }

    return listA;
}

function isSameNode(nodeA: StructureNode, nodeB: StructureNode): boolean {
    return (
        nodeA.label === nodeB.label &&
        nodeA.path === nodeB.path &&
        nodeA.folder === nodeB.folder
    );
}

function updateNode(nodeA: StructureNode, nodeB: StructureNode): void {
    nodeA.label = nodeB.label;
    nodeA.folder = nodeB.folder;

    if (nodeA.children && nodeB.children) {
        nodeA.children = adjustList(nodeA.children, nodeB.children);
    }
}*/
