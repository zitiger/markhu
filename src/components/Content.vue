<template>
  <div class="column3">
    <div class="empty-hint" v-if="editableTabs.length ===0">
      <div v-if="useSystemStore().workspace ===''" @click="useSystemStore().open()">
        <a-empty class="empty_result" :description="t('content.empty_hint.open_folder') "/>
      </div>
      <div v-else>
        <a-empty class="empty_result" :description="t('content.empty_hint.open_file') "/>
      </div>
    </div>
    <a-tabs v-else v-model:activeKey="store.activeFile" size="small" hide-add style="height: 100vh">
      <a-tab-pane v-for="tab in editableTabs" :key="tab.filepath" :closable="true">
        <template #tab>
          <a-dropdown :trigger="['contextmenu']">
            <span :title="tab.basename">
              {{ shortenFileName(tab.basename) }}
            <span style="display: inline-block;font-size: 10px;width:10px">
              <IconFont type="icon-dot" class="tab-state" v-if="useEditorStore().isModified(tab.filepath)"></IconFont>
              <IconFont type="icon-close" class="tab-remove" @click.stop="removeTab($event,tab.filepath)"/>
            </span>
            </span>

            <template #overlay>
              <a-menu @click="(event:any) => onContextMenuClick(tab.filepath, event.key)">
                <a-menu-item key="closeFile">{{ t('content.context_menu.close_file') }}</a-menu-item>
                <a-menu-item key="closeOthers">{{ t('content.context_menu.close_others') }}</a-menu-item>
                <a-menu-item key="closeAll">{{ t('content.context_menu.close_all') }}</a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="showInFolder">{{ t('content.context_menu.show_in_folder') }}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>


        </template>
        <Suspense>
          <editor :path="tab.filepath"></editor>
        </Suspense>
      </a-tab-pane>
    </a-tabs>
  </div>


</template>

<script setup lang="ts">
import {ref} from '@vue/reactivity';
import {useDialogStore, useEditorStore, useStructureStore, useSystemStore} from '../stores'
import Editor from "./Editor.vue";
import {showInFolder} from "../api/file";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const store = useEditorStore();
const editableTabs = ref(store.fileCache);
const showConfirm = ref(false)
const closingFilepath = ref('')

function shortenFileName(fileName: string): string {
  // 如果文件名的长度小于等于 50，直接返回文件名
  if (fileName.length <= 50) {
    return fileName;
  }
  // 如果文件名部分的长度大于 40，截取前 30 个字符和后 10 个字符，用 ... 连接起来
  if (fileName.length > 40) {
    fileName = fileName.slice(0, 30) + '...' + fileName.slice(-10);
  }
  // 返回新的文件名
  return fileName;
}

const removeTab = (event: MouseEvent, filepath: string) => {
  console.log("event", store.isModified(filepath))

  if (store.isModified(filepath)) {
    useEditorStore().closingFile = filepath;
    useDialogStore().showSaveConfirmDialog();
  } else {
    store.close(filepath)
  }
}


const onContextMenuClick = async (filepath: string, menuKey: string) => {
  console.log(menuKey)
  let node = useStructureStore().find(filepath);
  if (node) {

    if (menuKey === "closeFile") {
      useEditorStore().close(filepath);
    } else if (menuKey === "closeOthers") {
      await useEditorStore().closeOthers(filepath);
    } else if (menuKey === "closeAll") {
      await useEditorStore().closeAll();
    } else if (menuKey === "showInFolder") {
      await showInFolder(filepath);
    }
  }
}
</script>

<style>

.column3 .empty-hint > div {
  width: 100%;
  height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */

}

.column3 .empty-hint .ant-empty-description {
  font-size: 20px !important;
  color: var(--mh-hint-message-color) !important;

}

.column3 .ant-tabs .ant-tabs-content-holder {
  overflow-y: auto !important;
}

.column3 .ant-tabs .ant-tabs-nav {
  margin-bottom: 0 !important;
}

.ant-tabs-tab {
  margin-left: 10px;
}

.column3 .ant-tabs .ant-tabs-content {
  height: 100%;
}

.column3 .ant-tabs .ant-tabs-tabpane {
  height: 100%;
}

.tab-remove {
  display: none;
}

.ant-tabs .ant-tabs-tab + .ant-tabs-tab {
  margin-left: 30px;
}

.ant-tabs .ant-tabs-tab .anticon {
  margin-right: 0 !important;
}

.ant-tabs-tab:hover .tab-remove {
  display: inline-block;
}


.ant-tabs-tab:hover .tab-state {
  display: none;
}

.ant-tabs-tab-active .tab-remove {
  display: inline-block !important;
}

.ant-tabs-tab-active .tab-state {
  display: none !important;
}
</style>
