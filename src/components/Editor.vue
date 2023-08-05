<template>
  <div :id="editorId" style="border:none"/>
</template>

<script setup lang="ts">


import {ref} from '@vue/reactivity';
import Vditor from 'vditor';
import {h, onMounted, watch} from 'vue'
import {useEditorStore, useSystemStore} from '../stores'
import {createDirApi, existPath, saveImageApi} from "../api/file.js";

const props = defineProps({
  path: String,
});

const editorId = "vditor" + Math.random().toString(36).substr(2, 9);

const vditor = ref<Vditor | null>(null);

import svgIcons from '../assets/vditor-toolbar-svg'
import {message, Modal, theme} from "ant-design-vue";
import path from "path-browserify";
import {convertFileSrc} from "@tauri-apps/api/tauri";


watch(() => useSystemStore().theme, async (newValue, oldCount) => {
  if (newValue === 'dark') {
    vditor.value?.setTheme("dark")
  } else {
    vditor.value?.setTheme("classic")
  }
});

onMounted(() => {
  vditor.value = new Vditor(editorId, {
    mode: 'wysiwyg',
    height: "100% ",
    theme: 'dark',
    toolbar: [
      {
        hotkey: '⌘s',
        name: "openMdFile",
        tip: "保存",
        tipPosition: 's',
        icon: svgIcons.save,
        async click() {
          setTimeout(async () => {
            if (props.path != null) {
              let cont = vditor.value!.getValue();
              // await saveContentApi(props.path, cont)
              await useEditorStore().save(props.path);
              message.success('保存成功');
            }
          }, 1000);
        }
      },
      "emoji",
      "headings",
      "bold",
      "italic",
      "strike",
      "link",
      "|",
      "list",
      "ordered-list",
      "check",
      "outdent",
      "indent",
      "|",
      "quote",
      "line",
      "code",
      "inline-code",
      "insert-before",
      "insert-after",
      "|",
      "upload",
      "table",
      "|",
      "undo",
      "redo",
      "|",
      "fullscreen",
      "edit-mode",
    ],
    after: async () => {
      // vditor.value is a instance of Vditor now and thus can be safely used here
      if (props.path != null) {
        let content = useEditorStore().getContent(props.path);
        vditor.value!.setValue(content);
      }

      if (useSystemStore().theme === "dark") {
        vditor.value!.setTheme("dark")
      } else {
        vditor.value!.setTheme("classic")
      }
    },
    input: async (content) => {
      // vditor.value is a instance of Vditor now and thus can be safely used here
      if (props.path != null) {
        useEditorStore().modify(props.path, content)
      }
    },
    upload: {
      url: 'xxx',
      accept: 'image/*',
      handler(files: File[]) {
        for (let i = 0; i < files.length; i++) {

          let file = files[i]
          const filename = file.name;

          const reader = new FileReader();
          reader.onload = async () => {
            const fileContent = reader.result as ArrayBuffer;

            const byteArray = new Uint8Array(fileContent);
            const fileArray = Array.from(byteArray);
            try {
              const timestamp = new Date().getTime();
              const fileExtension = file.name.split('.').pop();
              const baseFileName = file.name.split('.').shift();
              const newFilename = `${baseFileName}-${timestamp}.${fileExtension}`;

              const filepath = path.join(useSystemStore().assertDir, newFilename);
              if (!await existPath(useSystemStore().assertDir)) {
                await createDirApi(useSystemStore().assertDir)
              }

              const response = saveImageApi(filepath, fileArray);
              let succFileText = '';

              const filepath2 = convertFileSrc(filepath)
              if (vditor.value == null) {
                return "";
              }

              if (vditor.value.getCurrentMode() === "wysiwyg") {
                succFileText += `\n<img alt="${filename}" src="${filepath2}">`;
              } else {
                succFileText += `![${filename}](${filepath2})\n`;
              }
              vditor.value.insertValue(succFileText)
              return response;
            } catch (error) {
              throw error;
            }

          };
          reader.readAsArrayBuffer(file);
        }
        return "上传成功"
      }
    }
  });
});
</script>

<style>


</style>
