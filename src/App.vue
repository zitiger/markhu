<script lang="ts" setup>
import Navigator from "./components/Navigator.vue";
import Content from "./components/Content.vue";
import { listenMenuEvent, changeMenuTitle} from "./api/file";
import {useDialogStore, useEditorStore, useStructureStore, useSystemStore} from "./stores";
import {onMounted, watch} from "vue";
import Dialogs from "./components/Dialogs.vue";
import {appWindow} from '@tauri-apps/api/window'


import SplitterPanel from "./components/panels/SplitterPanel.vue";


onMounted(() => {
  listenMenuEvent({
    'open_file':   () => useEditorStore().open(),
    'open_folder': () => useSystemStore().open(),
    'create_file': () => useDialogStore().showCreateFileDialog(),
    'save_file': () => useEditorStore().save(useEditorStore().activeFile),
    'save_all': () => useEditorStore().saveAll(),
    'close_file': () => useEditorStore().close(useEditorStore().activeFile),
    'lang_zh_cn': () => {useSystemStore().setLocale("zh_cn");},
    'lang_en': () => useSystemStore().setLocale("en"),
  });
})

watch( () => useEditorStore().activeFile, async(newValue, oldCount) => {
  const  title = newValue ===""?"MarkHu":newValue
 await appWindow.setTitle(title)
});


// 监听当前窗口的关闭请求事件
appWindow.listen('tauri://close-requested', async (event) => {

  if (useEditorStore().changedFiles.length > 0) {
    useDialogStore().showSaveAllDialog();
  } else {
    await appWindow.close();
  }
})
</script>

<template>
  <dialogs></dialogs>

  <a-layout style="height: 100vh;">
    <a-layout-sider width="50px">
      <navigator></navigator>
    </a-layout-sider>
    <a-layout-content>
      <splitter-panel>
        <template v-slot:left>
          <Suspense>
            <router-view></router-view>
          </Suspense>
        </template>
        <template v-slot:right>
          <content></content>
        </template>
      </splitter-panel>
    </a-layout-content>
  </a-layout>

</template>

<style scoped>

html, body {
  height: 100%;
  margin: 0;
}


</style>
