<script lang="ts" setup>
import path from "../../api/path";

import {ExclamationCircleOutlined, FileOutlined, FolderOutlined} from '@ant-design/icons-vue';


import {useDialogStore, useEditorStore, useStructureStore, useSystemStore} from '../../stores'
import {computed, createVNode} from "vue";
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
      useDialogStore().showCreateFileDialog();
    } else if (menuKey === "createDir") {
      useDialogStore().showCreateDirDialog();
    } else if (menuKey === "move") {
      useDialogStore().showMoveDialog();
    } else if (menuKey === "rename") {
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
  message.success(t('resource.structure.reload_successfully'));
}
</script>

<template>

  <resource-panel style=";overflow: hidden;">
    <template v-slot:title>
      {{ workspace }}
    </template>

    <template v-slot:buttons>
      <IconFont type="icon-create-dir" @click.stop="dialogStore.showCreateDirDialog()"/>
      <IconFont type="icon-create-file" @click.stop="dialogStore.showCreateFileDialog()"/>
      <IconFont type="icon-refresh" @click.stop="reload()"/>
    </template>
    <template v-slot:content>
      <a-directory-tree :showIcon="false" :tree-data="treeData" @select="handleNodeClick" class="file-tree">

        <template #title="{folder, key: treeKey, title }">
          <a-dropdown :trigger="['contextmenu']">
            <span><folder-outlined v-if="folder"/> <file-outlined v-else/> {{ title }}</span>
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
