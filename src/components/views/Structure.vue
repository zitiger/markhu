<script lang="ts" setup>
import path from "../../api/path";

// import {ExclamationCircleOutlined, FileOutlined, FolderOutlined} from '@ant-design/icons-vue';
import {useEditorStore, useStructureStore, useSystemStore} from '../../stores'
import {computed, ref} from "vue";
import {message} from "ant-design-vue";
import {confirmApi, showInFolder} from "../../api/file";
import ResourcePanel from "../panels/ResourcePanel.vue";
import {useI18n} from "vue-i18n";
import FileTree from "../filetree/FileTree.vue"
import {TreeNode} from "../filetree/types";
import i18n from "../../locales";

let fileTreeRef = ref();
const {t} = useI18n()
const editorStore = useEditorStore()
const structureStore = (useStructureStore())
// const dialogStore = useDialogStore()
await structureStore.load()


let treeData = structureStore.data;//ref(await convertList(structureStore.list));

console.log(treeData)


const workspace = computed(() => {
  return path.basename(useSystemStore().workspace)
})

const onNodeClick = async (data: TreeNode) => {

  console.log("node click", data)

  if (data.type === "folder") {
    // useStructureStore().currentDir = data.path
  } else {
    // useStructureStore().currentDir = data.path.substring(0, data.path.lastIndexOf(path.sep));
    await editorStore.read(data.path)
  }
  useStructureStore().currentNode = data
  console.log("onNodeClick", useStructureStore().currentNode);
}

const onContextmenuClick = async (nodeData: TreeNode, menuKey: string) => {
  console.log(menuKey)
  console.log(`treeKey: ${nodeData.path}, menuKey: ${menuKey}`);
  // let node = useStructureStore().find(treeKey);
  // if (node) {
  // useStructureStore().currentNode = nodeData
  //
  // if (nodeData.type === "folder") {
  //   useStructureStore().currentDir = nodeData.path;
  // } else {
  //   useStructureStore().currentDir = path.dirname(nodeData.path);
  // }

  if (menuKey === "createFile") {
    // startAdding(true);
    // nodeData.addingFile = true;

    fileTreeRef.value.startCreateFile(nodeData.path)
  } else if (menuKey === "createDir") {
    // startAdding(false);
    // nodeData.addingFolder = true;
    fileTreeRef.value.startCreateFolder(nodeData.path)
  } else if (menuKey === "rename") {
    // nodeData.editing = true;
    fileTreeRef.value.startRename(nodeData.path)
  } else if (menuKey === "remove") {
    let fullPath = nodeData.path;

    // let parentPath = path.dirname(fullPath)
    let title = i18n.global.t("dialog.delete.title")
    let desc = i18n.global.t("dialog.delete.desc")
    let yes = i18n.global.t("dialog.delete.button_delete")
    let no = i18n.global.t("dialog.button_cancel")

    let basename = path.basename(fullPath)
    desc = basename + "\n\n" + desc

    let r = await confirmApi(title, desc, yes, no)
    if (r) {
      await useStructureStore().remove(fullPath)
    }
  } else if (menuKey === "showInFolder") {
    await showInFolder(nodeData.path);
  }
  // }
}

function reload() {
  structureStore.load()
  message.success(t('resource.structure.reload_successfully'));
}

async function onFolderCreate(node: TreeNode, parent: TreeNode) {
  await useStructureStore().createFolder(node.path)
  console.log("onFolderCreate", node.path)
}

async function onFileCreate(node: TreeNode, parent: TreeNode) {
  if (!node.title.toLowerCase().endsWith(".md")) {
    node.title = node.title + ".md"
    node.path = node.path + ".md"
  }
  await useStructureStore().createFile(node.path);
  await useEditorStore().read(node.path)
}

function onNodeMove(newPath: string, oldPath: string) {
  useStructureStore().move(oldPath, newPath)
}

function onNodeRename(node, title, oldTitle, newPath, oldPath) {

  useStructureStore().rename(oldPath, newPath)
}

function onEditError(error: string) {
  message.error(t('resource.structure.path_exists'));
}

function onOutsideClick() {
  useStructureStore().currentNode = useStructureStore().data;
}

/*function startEditing() {

  useStructureStore().startEditing();

  let node = useStructureStore().currentNode;

  oldName = node.title;
  inputStatus.value = ""

  xisFile = !node.folder;

  let title = node.title;
  if (!node.folder) {
    editingInputText.value = title.substring(0, title.length - 3);
  } else {
    editingInputText.value = title;
  }

  setTimeout(() => {
    editingInput.value.focus()
    editingInput.value.select();
  }, 500)
}*/
/*
async function finishEditing() {
  let name = editingInputText.value;
  if (xisFile) {
    name = editingInputText.value + ".md"
  }

  if (name === oldName) {
    await useStructureStore().cancelEditing();
    editingInputText.value = ''
    inputStatus.value = ""
  } else {
    let result = await useStructureStore().finishEditing(name);

    if (result) {
      editingInputText.value = ''
      inputStatus.value = ""
    } else {
      inputStatus.value = "error"
    }
  }
}

async function cancelEditing() {
  await useStructureStore().cancelEditing();
  editingInputText.value = ''
  inputStatus.value = ""
}*/

// function startAdding(isFile: boolean) {
//
//   expandedKeys.value.push(useStructureStore().currentDir)
//   xisFile = isFile;
//   useStructureStore().startAdding(isFile);
//   inputStatus.value = ""
//
//   setTimeout(() => {
//     addingInput.value.focus()
//   }, 500)
// }

/*async function finishAdding() {
  console.log("finishAdding")
  let result = await useStructureStore().finishAdding(xisFile, addingInputText.value)
  if (result) {
    addingInputText.value = ''
    inputStatus.value = ""
  } else {
    inputStatus.value = "error"
  }
}

async function cancelAdding() {
  await useStructureStore().cancelAdding();
}*/

/*let xisFile = false;
let oldName = "";

let inputStatus = ref("")
let addingInput = ref()
let addingInputText = ref("")

let editingInput = ref()
let editingInputText = ref("")*/

/*
let expandedKeys = ref<string[]>([])
*/

/*function onExpand(expandedKeys222: string[]) {
  expandedKeys.value.length = 0;
  expandedKeys.value.push(...expandedKeys222)
}*/
</script>

<template>

  <resource-panel style=";overflow: hidden;">
    <template v-slot:title>
      {{ workspace }}
    </template>

    <template v-slot:buttons>
      <IconFont type="icon-create-dir" @click.stop="fileTreeRef.startCreateFolder(treeData.path)"/>
      <IconFont type="icon-create-file" @click.stop="fileTreeRef.startCreateFile(treeData.path)"/>
      <IconFont type="icon-refresh" @click.stop="reload()"/>
    </template>
    <template v-slot:content>
      <FileTree :data="treeData" default-extname=".md"
                ref="fileTreeRef"
                @nodeClick="onNodeClick"
                @folderCreate="onFolderCreate" @fileCreate="onFileCreate"
                @nodeRename="onNodeRename" @editError="onEditError" @nodeMove="onNodeMove"
                @outsideClick="onOutsideClick"
      >

        <template v-slot:toggler="{nodeData,expanded}">
          <IconFont type="icon-arrow-down" v-if="expanded"/>
          <IconFont type="icon-arrow-down-copy" v-else/>
        </template>

        <template v-slot:icon="{nodeData}">
          <IconFont type="icon-folder1" v-if="nodeData.type==='folder'"/>
          <IconFont type="icon-file-markdown2" v-else/>
        </template>


        <template v-slot:title="{nodeData}">
          <a-dropdown trigger="contextmenu">
            <span style="width: 100%">{{ nodeData.title }}</span>

            <template #overlay>
              <a-menu @click="(event:any) => onContextmenuClick(nodeData, event.key)">
                <a-menu-item key="createFile">{{ t('resource.structure.context_menu.create_file') }}</a-menu-item>
                <a-menu-item key="createDir">{{ t('resource.structure.context_menu.create_folder') }}</a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="move">{{ t('resource.structure.context_menu.move') }}</a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="rename">{{ t('resource.structure.context_menu.rename') }}</a-menu-item>
                <a-menu-item key="remove">{{ t('resource.structure.context_menu.remove') }}</a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="showInFolder">{{ t('resource.structure.context_menu.show_in_folder') }}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>


        </template>


      </FileTree>
      <!--      <div style="height: 100%" @click="useStructureStore().currentNode = useStructureStore().data">-->
      <!--      </div>-->
      <!--      <a-directory-tree :showIcon="false" :tree-data="treeData" @select="handleNodeClick" :expanded-keys="expandedKeys"
                              @expand="onExpand" class="file-tree">

              <template #title="{folder, key: treeKey, title, editing, adding,data }">
              <a-dropdown :trigger="['contextmenu']">
                  <span v-if="adding">

                   <a-tooltip :title="t('resource.structure.path_exists')" color="red" :open="inputStatus ==='error'">
                    <a-input size="small" type="text" :status="inputStatus" ref="addingInput" @blur="finishAdding"
                             v-on:keyup.esc="cancelAdding"
                             v-on:keydown.enter="finishAdding" v-model:value="addingInputText"
                             @click.stop.prevent
                             :addon-after="xisFile?'.md':''" allow-clear/>
                   </a-tooltip>

                  </span>
                <span v-else-if="editing">
                    <a-tooltip :title="t('resource.structure.path_exists')" color="red" :open="inputStatus ==='error'">
                      <a-input size="small" type="text" :status="inputStatus" ref="editingInput" @blur="finishEditing"
                               v-on:keyup.esc="cancelEditing"
                               v-on:keydown.enter="finishEditing"
                               v-model:value="editingInputText"
                               @click.stop.prevent
                               :addon-after="xisFile?'.md':''"/>
                    </a-tooltip>
                  </span>
                <span v-else><folder-outlined v-if="folder"/> <file-outlined v-else/> {{ title }}</span>

                <template #overlay>
                  <a-menu @click="(event:any) => onContextMenuClick(treeKey, event.key)">
                    <a-menu-item key="createFile">{{ t('resource.structure.context_menu.create_file') }}</a-menu-item>
                    <a-menu-item key="createDir">{{ t('resource.structure.context_menu.create_folder') }}</a-menu-item>
                    <a-menu-divider></a-menu-divider>
                    <a-menu-item key="move">{{ t('resource.structure.context_menu.move') }}</a-menu-item>
                    <a-menu-divider></a-menu-divider>
                    <a-menu-item key="rename">{{ t('resource.structure.context_menu.rename') }}</a-menu-item>
                    <a-menu-item key="remove">{{ t('resource.structure.context_menu.remove') }}</a-menu-item>
                    <a-menu-divider></a-menu-divider>
                    <a-menu-item key="showInFolder">{{ t('resource.structure.context_menu.show_in_folder') }}</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            </a-directory-tree>-->
    </template>
  </resource-panel>

</template>
<style scoped>

.container {
  height: 100%;
}


</style>
<style>
.container .content {
  height: 100%;
}

.tree-node-input {
  outline: none;
  padding: 0 4px;
  background-color: var(--mh-content-background-color);
  border: 1px solid var(--mh-primary-color);
}


</style>
