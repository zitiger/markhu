<script lang="ts" setup>
import Navigator from "./components/Navigator.vue";
import Content from "./components/Content.vue";
import {listenMenuEvent, changeMenuTitle} from "./api/file";
import {useDialogStore, useEditorStore, useStructureStore, useSystemStore} from "./stores";
import {onMounted, reactive, watch} from "vue";
import Dialogs from "./components/Dialogs.vue";
import {appWindow} from '@tauri-apps/api/window'

import SplitterPanel from "./components/panels/SplitterPanel.vue";
import {theme} from "ant-design-vue";

onMounted(() => {
  listenMenuEvent({
    'open_file': () => useEditorStore().open(),
    'open_folder': () => useSystemStore().open(),
    'create_file': () => useDialogStore().showCreateFileDialog(),
    'save_file': () => useEditorStore().save(useEditorStore().activeFile),
    'save_all': () => useEditorStore().saveAll(),
    'close_file': () => useEditorStore().close(useEditorStore().activeFile),
    'theme_auto': () => useSystemStore().changeTheme('auto'),
    'theme_dark': () => useSystemStore().changeTheme('dark'),
    'theme_light': () => useSystemStore().changeTheme('light'),
    'lang_zh_cn': () => useSystemStore().setLocale("zh_CN"),
    'lang_en_us': () => useSystemStore().setLocale("en_US"),
    'mode_wysiwyg': () => useEditorStore().editMode = 'wysiwyg',
    'mode_ir': () => useEditorStore().editMode = 'ir',
    'mode_sv': () => useEditorStore().editMode = 'sv',
    'mode_fullscreen': () => useEditorStore().toggleFullscreenMode(),
  })
  ;
})

watch(() => useEditorStore().activeFile, async (newValue, oldCount) => {
  const title = newValue === "" ? "MarkHu" : newValue
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

const currentTheme = reactive({algorithm: theme.darkAlgorithm})

watch(() => useSystemStore().realTheme, (newTheme: string) => {
  if (newTheme === 'light') {
    currentTheme.algorithm = theme.defaultAlgorithm
    document.documentElement.setAttribute('theme', 'light')
  } else {
    currentTheme.algorithm = theme.darkAlgorithm
    document.documentElement.removeAttribute('theme')
  }
}, {immediate: true});

appWindow.onThemeChanged((theme) => {
  useSystemStore().changeTheme('auto')
})
</script>

<template>
  <a-config-provider :theme="currentTheme">
    <dialogs></dialogs>

    <div class="container">
      <div class="sidebar">
        <navigator></navigator>
      </div>
      <div class="content">
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
      </div>
    </div>
  </a-config-provider>
</template>

<style>

@import "themes/dark.css";
@import "themes/light.css";

html, body {
  height: 100%;
  margin: 0;
  background-color: var(--mh-backgournd-color);
}

* {
  color: var(--mh-text-color);
}

.icon-button {
  padding: 2px;
  border-radius: 2px;
}

.icon-button:hover {
  background-color: var(--mh-icon-button-background-color);
}
</style>
<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: row;
}

.sidebar {
  width: 50px;
  min-width: 50px;
  background-color: var(--mh-sidebar-background-color);
}

.content {
  background-color: var(--mh-content-background-color);
  flex: 1;
  width: 0;
}
</style>
