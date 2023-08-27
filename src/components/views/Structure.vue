<script lang="ts" setup>
import path from "../../api/path";

import {ExclamationCircleOutlined, FileOutlined, FolderOutlined} from '@ant-design/icons-vue';

import {useDialogStore, useEditorStore, useStructureStore, useSystemStore} from '../../stores'
import {computed, createVNode, ref, watch} from "vue";
import {message, Modal} from "ant-design-vue";
import {showInFolder} from "../../api/file";
import ResourcePanel from "../panels/ResourcePanel.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const editorStore = useEditorStore()
const structureStore = (useStructureStore())
const dialogStore = useDialogStore()
await structureStore.load()

let treeData = (structureStore.list);//ref(await convertList(structureStore.list));

const workspace = computed(() => {
  return path.basename(useSystemStore().workspace)
})

const handleNodeClick = async (selectedKeys: any, e: {
  selected: boolean,
  selectedNodes: any,
  node: any,
  event: any
}) => {

  let data = e.node;

  if (data.folder) {
    useStructureStore().currentDir = data.path
  } else {
    useStructureStore().currentDir = data.path.substring(0, data.path.lastIndexOf(path.sep));
    await editorStore.read(data.path)
  }
  // useStructureStore().currentNode = e.node
  console.log("node click", e.node, selectedKeys)
}

const onContextMenuClick = (treeKey: string, menuKey: string) => {
  console.log(menuKey)
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
  let node = useStructureStore().find(treeKey);
  if (node) {
    useStructureStore().currentNode = node

    if (node.folder) {
      useStructureStore().currentDir = node.path;
    } else {
      useStructureStore().currentDir = path.dirname(node.path);
    }

    if (menuKey === "createFile") {
      startAdding(true);
    } else if (menuKey === "createDir") {
      startAdding(false);
    } else if (menuKey === "move") {
      useDialogStore().showMoveDialog();
    } else if (menuKey === "rename") {
      useStructureStore().startEditing();
    } else if (menuKey === "remove") {
      let fullPath = node.path;

      Modal.confirm({
        title: '确认删除?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '是否进行删除操作？',
        okText: '是',
        okType: 'danger',

        cancelText: '否',
        onOk() {
          const isFile = node != undefined && !node.folder

          useStructureStore().remove(fullPath, isFile)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else if (menuKey === "showInFolder") {
      showInFolder(node.path);
    }
  }
}

function reload() {
  structureStore.load()
  message.success(t('resource.structure.reload_successfully'));
}

watch(() => useStructureStore().editingNode, async (newValue, oldValue) => {
  if (newValue) {
    editingInputText.value = newValue.title;
    inputStatus.value = ""

    setTimeout(() => {
      editingInput.value.focus()
      editingInput.value.select();
    }, 500)
  }
})

async function finishEditing() {
  let result = await useStructureStore().finishEditing(editingInputText.value);

  if (result) {
    editingInputText.value = ''
    inputStatus.value = ""
  } else {
    inputStatus.value = "error"
  }
}

function startAdding(isFile: boolean) {

  expandedKeys.value.push(useStructureStore().currentDir)
  xisFile = isFile;
  useStructureStore().startAdding(isFile);
  inputStatus.value = ""

  setTimeout(() => {
    addingInput.value.focus()
  }, 500)
}

async function finishAdding() {
  console.log("finishAdding")
  let result = await useStructureStore().finishAdding(xisFile, addingInputText.value)
  if (result) {
    addingInputText.value = ''
    inputStatus.value = ""
  } else {
    inputStatus.value = "error"
  }
}

let xisFile = false;

let inputStatus = ref("")
let addingInput = ref()
let addingInputText = ref("")

let editingInput = ref()
let editingInputText = ref("")

let expandedKeys = ref<string[]>([])

function onExpand(expandedKeys222: string[]) {
  expandedKeys.value.length = 0;
  expandedKeys.value.push(...expandedKeys222)
}
</script>

<template>

  <resource-panel style=";overflow: hidden;">
    <template v-slot:title>
      {{ workspace }}
    </template>

    <template v-slot:buttons>
      <IconFont type="icon-create-dir" @click.stop="startAdding(false)"/>
      <IconFont type="icon-create-file" @click.stop="startAdding(true)"/>
      <IconFont type="icon-refresh" @click.stop="reload()"/>
    </template>
    <template v-slot:content>
      <a-directory-tree :showIcon="false" :tree-data="treeData" @select="handleNodeClick" :expanded-keys="expandedKeys"
                        @expand="onExpand" class="file-tree">

        <template #title="{folder, key: treeKey, title, editing, adding,data }">
          <a-dropdown :trigger="['contextmenu']">
            <span v-if="adding">

             <a-tooltip :title="t('resource.structure.path_exists')" color="red" :open="inputStatus ==='error'">
              <a-input size="small" type="text" :status="inputStatus" ref="addingInput" @blur="finishAdding"
                       v-on:keydown.enter="finishAdding" v-model:value="addingInputText"
                       @click.stop.prevent
                       :addon-after="xisFile?'.md':''" allow-clear/>
             </a-tooltip>

            </span>
            <span v-else-if="editing">
              <a-tooltip :title="t('resource.structure.path_exists')" color="red" :open="inputStatus ==='error'">
                <a-input size="small" type="text" :status="inputStatus" ref="editingInput" @blur="finishEditing"
                         v-on:keydown.enter="finishEditing"
                         v-model:value="editingInputText"/>
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
      </a-directory-tree>
    </template>
  </resource-panel>

</template>
<style scoped>

.container {
}
</style>
<style>

.file-tree {
  background-color: transparent !important;
}

.ant-dropdown-trigger {

  display: block;
}

.file-tree .ant-tree-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
