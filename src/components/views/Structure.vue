<script lang="ts" setup>
import "vditor/dist/index.css"
import path from "path-browserify"

import {
  FolderAddOutlined,
  FileAddOutlined,
  SyncOutlined,
  FolderOutlined,
  FileOutlined,
  ExclamationCircleOutlined,
  RightOutlined, DownOutlined
} from '@ant-design/icons-vue';


import {useEditorStore, useDialogStore, useSystemStore} from '../../stores'
import {computed, createVNode, onMounted, reactive, ref, watch} from "vue";
import {useStructureStore} from "../../stores";
import {message, Modal} from "ant-design-vue";
import {showInFolder} from "../../api/file";
import ResourcePanel from "../panels/ResourcePanel.vue";

const editorStore = useEditorStore()
const structureStore = (useStructureStore())
const dialogStore = useDialogStore()
await structureStore.load()


let treeData = (structureStore.list);//ref(await convertList(structureStore.list));


const workspace =  computed(() => {
  return   path.basename(useSystemStore().workspace)
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

    if (node.folder) {
      useStructureStore().currentDir = node.path;
    } else {
      useStructureStore().currentDir = path.dirname(node.path);
    }

    if (menuKey === "createFile") {
      useDialogStore().showCreateFileDialog();
    } else if (menuKey === "createDir") {
      useDialogStore().showCreateDirDialog();
    } else if (menuKey === "rename") {
      useStructureStore().currentNode = node
      useDialogStore().showRenameDialog();
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
  message.success('刷新成功');

}
</script>

<template>

  <resource-panel style=";overflow: hidden;">
    <template v-slot:title>
    {{ workspace }}
    </template>

    <template v-slot:buttons>
        <IconFont type="icon-create-dir" @click="dialogStore.showCreateDirDialog()"/>
        <IconFont type="icon-create-file" @click="dialogStore.showCreateFileDialog()"/>
        <IconFont type="icon-refresh" @click="reload()"/>
    </template>
    <template v-slot:content>
      <a-directory-tree :showIcon="false" :tree-data="treeData" @select="handleNodeClick" class="file-tree">

        <template #title="{folder, key: treeKey, title }">
          <a-dropdown :trigger="['contextmenu']">
            <span><folder-outlined v-if="folder"/> <file-outlined v-else/> {{ title }}</span>
            <template #overlay>
              <a-menu @click="(event:any) => onContextMenuClick(treeKey, event.key)">
                <a-menu-item key="createFile">新建文件</a-menu-item>
                <a-menu-item key="createDir">新建文件夹</a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="rename">重命名</a-menu-item>
                <a-menu-item key="remove">删除</a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="showInFolder">在Finder中显示</a-menu-item>
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
