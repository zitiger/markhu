import {TreeNode} from "./types";
import {dirname, extname, join} from "./utils";
import {nextTick, ref, watch} from "vue";

export default function useEdit(defaultExtname: string | undefined, expandedKeys: Set<string>, editInputRef, emits) {

    const renameKey = ref('');
    const createFileKey = ref('');
    const createFolderKey = ref('');
    const editErrorKey = ref('');

    watch(renameKey, async (newValue) => {
        if (newValue) {
            await nextTick();
            editInputRef.value[0].focus();
        }
    })

    watch(createFolderKey, async (newValue) => {
        if (newValue) {
            await nextTick();
            editInputRef.value[0].focus();
        }
    })

    watch(createFileKey, async (newValue) => {
        if (newValue) {
            await nextTick();
            editInputRef.value[0].focus();
        }
    })

    function startRename(key: string) {
        renameKey.value = key;
        editErrorKey.value = ''
    }

    function startCreateFile(key: string) {
        expandedKeys.add(key)
        createFileKey.value = key;
        editErrorKey.value = ''
    }

    function startCreateFolder(key: string) {
        expandedKeys.add(key)
        createFolderKey.value = key;
        editErrorKey.value = ''
    }

    function onEditCancel() {
        renameKey.value = "";
        createFileKey.value = "";
        createFolderKey.value = "";
        editErrorKey.value = ''
    }

    function onNodeRename(node: TreeNode) {
        const input = editInputRef.value[0]
        if (!input) {
            return
        }

        const title = input.value;
        const oldTitle = node.title;
        const oldPath = node.path;
        const dir = dirname(oldPath);
        const newPath = join(dir, title);

        node.title = title;
        node.path = newPath;

        onEditCancel();
        emits('nodeRename', node, title, oldTitle, newPath, oldPath);
    }

    function onFileCreate(node: TreeNode) {
        const input = editInputRef.value[0]
        if (!input || !input.value) {
            return
        }

        let title = input.value;
        const fileExtname = extname(title);
        if (!fileExtname && defaultExtname) {
            title = title + defaultExtname;
        }

        const newOne = doCreate(node, title, "file")
        if (newOne) {
            emits('fileCreate', newOne, node);
        } else {
            editErrorKey.value = node.path
        }
    }

    function onFolderCreate(node: TreeNode) {
        const input = editInputRef.value[0]
        if (!input || !input.value) {
            return
        }

        const title = input.value;
        const newOne = doCreate(node, title, "folder")
        if (newOne) {
            emits('folderCreate', newOne, node);
        } else {
            editErrorKey.value = node.path
        }
    }

    function doCreate(node: TreeNode, title: string, type: string) {
        const newPath = join(node.path, title)
        if (node.children) {
            for (const child of node.children) {
                if (child.path === newPath) {
                    emits("editError", "duplicate." + type + ".name");
                    return
                }
            }
        }

        const newOne: TreeNode = {
            title,
            path: newPath,
            type
        }

        if (!node.children) {
            node.children = []
        }
        node.children.unshift(newOne)

        onEditCancel();

        return newOne;
    }

    return {
        renameKey,
        createFileKey,
        createFolderKey,
        editErrorKey,
        startRename,
        startCreateFile,
        startCreateFolder,
        onEditCancel,
        onNodeRename,
        onFileCreate,
        onFolderCreate
    }
}
