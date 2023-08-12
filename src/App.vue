<script lang="ts" setup>
import Navigator from "./components/Navigator.vue";
import Content from "./components/Content.vue";
import {changeMenuTitle, listenMenuEvent, setMenuSelected} from "./api/file";
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
    'create_folder': () => useDialogStore().showCreateDirDialog(),
    'save_file': () => useEditorStore().save(useEditorStore().activeFile),
    'save_all': () => useEditorStore().saveAll(),
    'close_file': () => useEditorStore().close(useEditorStore().activeFile),
    'theme_auto': () => useSystemStore().changeTheme('auto'),
    'theme_dark': () => useSystemStore().changeTheme('dark'),
    'theme_light': () => useSystemStore().changeTheme('light'),
    'locale_zh_cn': () => useSystemStore().setLocale("zh_CN"),
    'locale_en_us': () => useSystemStore().setLocale("en_US"),
    'mode_wysiwyg': () => useEditorStore().editMode = 'wysiwyg',
    'mode_ir': () => useEditorStore().editMode = 'ir',
    'mode_sv': () => useEditorStore().editMode = 'sv',
    'mode_fullscreen': () => useEditorStore().toggleFullscreenMode(),
    'history_file_0': () => useEditorStore().readHistory(0),
    'history_file_1': () => useEditorStore().readHistory(1),
    'history_file_2': () => useEditorStore().readHistory(2),
    'history_file_3': () => useEditorStore().readHistory(3),
    'history_file_4': () => useEditorStore().readHistory(4),
    'history_file_5': () => useEditorStore().readHistory(5),
    'history_file_6': () => useEditorStore().readHistory(6),
    'history_file_7': () => useEditorStore().readHistory(7),
    'history_file_8': () => useEditorStore().readHistory(8),
    'history_file_9': () => useEditorStore().readHistory(9),
    'more_history': () => useDialogStore().showHistoryFileDialog(),
    'clear_history': () => useSystemStore().clearHistory(),
  })
  ;
})

watch(() => useEditorStore().activeFile, async (newValue, oldCount) => {
  const title = newValue === "" ? "MarkHu" : newValue
  await appWindow.setTitle(title)
});


watch(() => useSystemStore().theme, async (newValue, oldValue) => {
  if (oldValue) {
    await setMenuSelected("theme_" + oldValue, false)
  }
  await setMenuSelected("theme_" + newValue, true)
}, {immediate: true});

watch(() => useSystemStore().locale, async (newValue, oldValue) => {
  if (oldValue) {
    await setMenuSelected("locale_" + oldValue.toLowerCase(), false)
  }
  await setMenuSelected("locale_" + newValue.toLowerCase(), true)
}, {immediate: true});

watch(() => useEditorStore().editMode, async (newValue, oldValue) => {
  if (oldValue) {
    await setMenuSelected("mode_" + oldValue, false)
  }
  await setMenuSelected("mode_" + newValue, true)
}, {immediate: true});

watch(() => useEditorStore().fullscreenMode, async (newValue, oldValue) => {
  await setMenuSelected("mode_fullscreen", newValue)
}, {immediate: true});

watch(() => useSystemStore().history, async (newValue, oldValue) => {
  for (let i = 0; i < 10 && i < newValue.length; i++) {
    let filepath = newValue[newValue.length - 1 - i];
    await changeMenuTitle("history_file_" + i, filepath);
  }
}, {immediate: true});

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
