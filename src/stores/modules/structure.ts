import {defineStore} from 'pinia'
import {reactive} from 'vue'
import {createDirApi, createFileApi, moveToTrashApi, readFolderApi, renameApi} from "../../api/file";
import {FileInfo, StructureNode} from "../../api/model";
import {useSystemStore} from "./system";
import {useEditorStore} from "./editor";
import path from "../../api/path";
import {findParentNodeByPath} from "../../components/filetree/utils";

export const useStructureStore = defineStore('structure', {
    state: () => {

        const data = reactive<StructureNode>({
            title: "/",
            path: "/",
            type: "folder",
            expanded: true
        });

        // let path = '';

        let currentNode = reactive<StructureNode>(data);

        return {data, currentNode}
    },

    actions: {
        async createFolder(path: string) {
            // let filepath = await path.join(folder, basename);


            await createDirApi(path);

        },
        async createFile(path: string) {
            // let filepath = await path.join(folder, basename);
            await createFileApi(path);
        },
        async move(from: string, to: string) {

            await renameApi(from, to);
            // moveNode(this.list, from, to)
        },
        async rename(from: string, to: string) {
            let index = useEditorStore().fileCache.findIndex(file => file.filepath === from)
            if (index > -1) {
                useEditorStore().fileCache[index].basename = path.basename(to);
                useEditorStore().fileCache[index].filepath = to;
            }

            // await updateNodePath(this.list, from, to)

            await renameApi(from, to);
        },
        async remove(path: string) {
            // if (isFile) {
            //     removeFileApi(path)
            // } else {
            //     removeDirApi(path)
            // }
            deleteNode(this.data, path)

            await moveToTrashApi(path)

        },

        async basename(filepath: string) {
            return await path.basename(filepath)
        },
        async load() {

            let path = useSystemStore().workspace;
            if (path === "") {
                return
            }

            this.data.path = path;
            this.data.title = "/"

            this.currentDir = path;

            const sourceFileList = await readFolderApi(path);

            console.log(sourceFileList)
            // this.list.length = 0; // 清空数组
            // this.dir.length = 0; // 清空数组

            let fileList = await this.buildNode(sourceFileList)
            this.data.children = fileList

            console.log("fileListfileListfileListfileList", fileList)
        },

        async buildNode(res: FileInfo[]) {
            //  console.log(":adsfasf", (res))
            if (!res.length) {
                return [];
            }
            let result: StructureNode[] = [];
            for (let val of res) {
                let {filePath, fileType} = val;
                console.log(filePath)

                let children: StructureNode[] = [];
                if (fileType === "file") {
                    if (!filePath.toLowerCase().endsWith(".md")) {
                        continue;
                    }
                } else {
                    if (val.children) {
                        children = await this.buildNode(val.children)
                    }
                }
                result.push({
                    title: await this.basename(filePath),
                    path: filePath,
                    type: fileType,
                    children
                });

            }

            result.sort((a, b) => {
                // 如果a是文件夹，b是文件，那么a排在前面
                if (a.type !== 'folder' && b.type === 'folder') {
                    return 1;
                }
                // 如果a是文件，b是文件夹，那么b排在前面
                if (a.type === 'folder' && b.type !== 'folder') {
                    return -1;
                }
                // 如果a和b都是文件夹或者都是文件，那么按照filePath进行字典序排序
                return a.path.localeCompare(b.path);
            })
            return result;
        },
        find(path: string) {

            return findNodeByPath(this.data, path);
        },
        startAddingFile() {
            let node = this.currentNode;
            if (node.type === "file") {
                node = findParentNodeByPath(this.data, node.path)
            }
            node.addingFile = true;

            console.log(this.currentNode)
        },
        startAddingFolder() {
            let node = this.currentNode;
            if (node.type === "file") {
                node = findParentNodeByPath(this.data, node.path)
            }
            node.addingFolder = true;
        },
        /*      async finishAdding(isFile: boolean, name: string) {

                  console.log("this.currentDir this.currentDir this.currentDir", this.currentNode)

                  let dir = path.dirname(this.currentNode.path)

                  if (name != null && name.length > 0) {
                      if (isFile && !name.toLowerCase().endsWith(".md")) {
                          name = name + ".md"
                      }

                      let filepath = await path.join(dir, name);
                      if (await existPath(filepath)) {
                          return false;
                      }
                      await this.create(dir, name, isFile)

                      if (isFile) {
                          let filepath = await path.join(dir, name);

                          console.log("read read read read read", filepath)
                          await useEditorStore().read(filepath)
                      }
                  }

                  let parentNode = findNodeByPath(this.list, dir)

                  let container;
                  if (parentNode == null) {
                      container = this.list;
                  } else {
                      if (!parentNode.children) {
                          parentNode.children = [];
                      }
                      container = parentNode.children
                  }
                  // container.splice(1, 1);
                  container.shift();

                  console.log("finishAdding", isFile, name)

                  return true;
              },
              async cancelAdding() {
                  console.log("cancelAdding", this.currentNode)

                  let dir = path.dirname(this.currentNode.path)
                  let parentNode = findNodeByPath(this.list, dir)

                  let container;
                  if (parentNode == null) {
                      container = this.list;
                  } else {
                      if (!parentNode.children) {
                          parentNode.children = [];
                      }
                      container = parentNode.children
                  }
                  container.shift();
              },
              startEditing() {
                  this.currentNode.editing = true;
                  this.editingNode = this.currentNode;
              },

              async finishEditing(name: string) {
                  console.log("finishEditingfinishEditingfinishEditingfinishEditingfinishEditing")
                  let isFile = !this.editingNode?.folder;
                  if (isFile && !name.toLowerCase().endsWith(".md")) {
                      name = name + ".md"
                  }

                  let oldPath = this.editingNode?.path;
                  let folder = path.dirname(oldPath);
                  let newPath = path.join(folder, name);

                  console.log(oldPath, newPath);

                  if (await existPath(newPath)) {
                      return false;
                  } else {
                      await this.rename(oldPath, newPath);

                      this.currentNode.editing = false;
                      this.editingNode = undefined;

                      return true;
                  }
              }, async cancelEditing() {
                  this.currentNode.editing = false;
                  this.editingNode = undefined;
              }*/
    },
})

/*
function createNode(list: StructureNode[], newNode: StructureNode): StructureNode[] {

    const parentPath = getParentPath(newNode.path);
    const parentNode = findNodeByPath(list, parentPath);

    if (parentNode && parentNode.folder) {
        if (!parentNode.children) {
            parentNode.children = [];
        }
        parentNode.children.splice(1, 0, newNode);//.unshift(newNode);
    } else {
        list.splice(1, 0, newNode);
    }
    console.log("ccccc", list.length, list);
    return list;
}*/


function deleteNode(data: StructureNode, path: string) {
    const parentPath = getParentPath(path);
    const parentNode = findNodeByPath(data, parentPath);
    let children = parentNode.children
    const index = findChildIndex(children, path);
    if (index !== -1) {
        children.splice(index, 1);
    }

    console.log(parentPath, parentNode, index, children)
}

/*async function updateNodePath(list: StructureNode[], oldPath: string, newPath: string): Promise<StructureNode[]> {
    const targetNode = findNodeByPath(list, oldPath);

    if (targetNode) {
        targetNode.path = newPath;
        targetNode.key = newPath;
        targetNode.title = await path.basename(newPath);
    }

    return list;
}*/

/*function moveNode(list: StructureNode[], oldPath: string, newPath: string): StructureNode[] {
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
}*/

function findNodeByPath(data: StructureNode, path: string): StructureNode | null {
    if (data.path === path) {
        return data;
    }
    if (data.type === "folder" && data.children) {
        for (let child of data.children) {
            const foundNode = findNodeByPath(child, path);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return null;
}

function getParentPath(path: string): string {
    const lastSlashIndex = path.lastIndexOf("/");
    return path.substring(0, lastSlashIndex);
}

/*function findInsertIndex(children: StructureNode[], node: StructureNode): number {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.folder && isChildPath(child.path, node.path)) {
            return i + 1;
        }
    }
    return 0;
}*/

/*
function isChildPath(parentPath: string, childPath: string): boolean {
    return childPath.startsWith(parentPath + "/");
}
*/

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
