<template>
  <div class="column3">
    <div class="placeholder" v-if="editableTabs.length ===0">
      <div v-if="useSystemStore().workspace ===''" @click="useSystemStore().open()">
        {{ t("content.open_folder") }}
      </div>
      <div v-else>
        {{ t("content.open_file") }}
      </div>
    </div>
    <a-tabs v-else v-model:activeKey="store.activeFile" size="small" hide-add style="height: 100vh">
      <a-tab-pane v-for="tab in editableTabs" :key="tab.filepath" :closable="true">
        <template #tab>
          <a-dropdown :trigger="['contextmenu']">
            <span>
              {{ tab.basename }}
            <div style="display: inline-block;font-size: 10px;width:10px">
              <IconFont type="icon-yuan" class="tab-state" v-if="useEditorStore().isModified(tab.filepath)"></IconFont>
              <IconFont type="icon-close" class="tab-remove" @click="removeTab($event,tab.filepath)"/>
            </div>
            </span>

            <template #overlay>
              <a-menu @click="(event:any) => onContextMenuClick(tab.filepath, event.key)">
                <a-menu-item key="closeFile">关闭</a-menu-item>
                <a-menu-item key="closeOthers">关闭其他</a-menu-item>
                <a-menu-item key="closeAll">关闭所有</a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item key="showInFolder">在Finder中显示</a-menu-item>
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

  <a-modal v-model:open="showConfirm" title="是否保存?">
    <template #footer>
      <a-button key="back" @click="dispose" type="primary" style="float: left">不保存</a-button>
      <a-button key="back" @click="cancel">取消</a-button>
      <a-button key="submit" type="primary" @click="save">保存</a-button>
    </template>
    <p>是否保存对文件的更改？</p>
  </a-modal>

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


const removeTab = (event: MouseEvent, targetName: string) => {
  event.stopPropagation()
  console.log("event", event)
  if (store.isModified(targetName)) {
    closingFilepath.value = targetName
    showConfirm.value = true;
  } else {
    store.close(targetName)
  }
}

function dispose() {
  store.close(closingFilepath.value)
  showConfirm.value = false;
}

function cancel() {
  showConfirm.value = false;
}

async function save() {
  await store.save(closingFilepath.value)
  store.close(closingFilepath.value)
  showConfirm.value = false;
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

.column3 .placeholder > div {
  width: 100%;
  height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-size: 30px;
  color: var(--mh-divider-color)
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
  margin-left: 15px;
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
