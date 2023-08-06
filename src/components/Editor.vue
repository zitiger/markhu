<template>
  <div :id="editorId" style="border:none"/>
</template>

<script setup lang="ts">
import {ref} from '@vue/reactivity';
import Vditor from 'vditor';
import {h, onMounted, watch} from 'vue'
import {useEditorStore, useSystemStore} from '../stores'
import {createDirApi, existPath, saveImageApi} from "../api/file.js";
import {Md5} from "ts-md5";
import {useI18n} from "vue-i18n";

const {t} = useI18n()

const props = defineProps({
  path: String,
});

const editorId = "vditor" + Md5.hashStr(props.path || '');

const vditor = ref<Vditor | null>(null);

import svgIcons from '../assets/vditor-toolbar-svg'
import {message, Modal, theme} from "ant-design-vue";
import path from "path-browserify";
import {convertFileSrc} from "@tauri-apps/api/tauri";

watch(() => useSystemStore().realTheme, (newTheme: string) => {
      if (newTheme !== 'light') {
        vditor.value?.setTheme("dark")
      } else {
        vditor.value?.setTheme("classic")
      }
    }
);

onMounted(() => {
  vditor.value = new Vditor(editorId, {
    lang: useSystemStore().locale,
    mode: 'wysiwyg',
    height: "100% ",
    placeholder: t('editor.placeholder'),
    hint: {
      // emojiPath: 'https://unpkg.com/vditor@1.8.3/dist/images/emoji',
      // emojiTail: '<a href="https://ld246.com/settings/function" target="_blank">设置常用表情</a>',
      emoji: {
        "grinning": "😀",
        "smile": "😃",
        "laughing": "😆",
        "blush": "😊",
        "wink": "😉",
        "kiss_heart": "😘",
        "heart_eyes": "🥰",
        "sunglasses": "😎",
        "thinking": "🤔",
        "grimacing": "😬",
        "neutral": "😐",
        "expressionless": "😑",
        "rolling_eyes": "🙄",
        "monocle": "🧐",
        "smiling_cat": "😻",
        "kissing_cat": "😽",
        "crying": "😢",
        "loudly_crying": "😭",
        "pouting": "😡",
        "angry": "😠",
        "thumbs_up": "👍",
        "thumbs_down": "👎",
        "raising_hands": "🙌",
        "clapping_hands": "👏",
        "folded_hands": "🙏",
        "handshake": "🤝",
        "writing_hand": "✍️",
        "nail_polish": "💅",
        "selfie": "🤳",
        "flexed_biceps": "💪",
        "ear": "👂",
        "eyes": "👀",
        "nose": "👃",
        "mouth": "👄",
        "tongue": "👅",
        "footprints": "👣",
        "baby": "👶",
        "boy": "👦",
        "girl": "👧",
        "man": "👨",
        "dog": "🐶",
        "cat": "🐱",
        "mouse": "🐭",
        "hamster": "🐹",
        "rabbit": "🐰",
        "fox": "🦊",
        "bear": "🐻",
        "panda": "🐼",
        "koala": "🐨",
        "tiger": "🐯",
        "lion": "🦁",
        "horse": "🐴",
        "unicorn": "🦄",
        "monkey": "🐵",
        "gorilla": "🦍",
        "elephant": "🐘",
        "pig": "🐷",
        "cow": "🐮",
        "sheep": "🐑",
        "chicken": "🐔",
        "grapes": "🍇",
        "watermelon": "🍉",
        "banana": "🍌",
        "strawberry": "🍓",
        "tomato": "🍅",
        "avocado": "🥑",
        "eggplant": "🍆",
        "carrot": "🥕",
        "corn": "🌽",
        "hot_pepper": "🌶️",
        "hamburger": "🍔",
        "pizza": "🍕",
        "sushi": "🍣",
        "fried_shrimp": "🍤",
        "ice_cream": "🍨",
        "doughnut": "🍩",
        "coffee": "☕",
        "tea": "🍵",
        "beer": "🍺",
        "cocktail": "🍸",
        "globe": "🌍",
        "globe_americas": "🌎",
        "globe_asia": "🌏",
        "globe_meridians": "🌐",
        "sun": "☀️",
        "moon": "🌙",
        "star": "⭐",
        "cloud": "☁️",
        "umbrella": "☔",
        "snowflake": "❄️",
        "beach_umbrella": "⛱️",
        "desert": "🏜️",
        "mountain": "⛰️",
        "volcano": "🌋",
        "camping": "🏕️",
        "train": "🚆",
        "ship": "🚢",
        "airplane": "✈️",
        "helicopter": "🚁",
        "car": "🚗",
        "running": "🏃",
        "walking": "🚶",
        "biking": "🚴",
        "swimming": "🏊",
        "surfing": "🏄",
        "skiing": "⛷️",
        "basketball": "🏀",
        "football": "⚽",
        "baseball": "⚾",
        "tennis": "🎾",
        "golf": "⛳",
        "volleyball": "🏐",
        "rugby": "🏉",
        "bowling": "🎳",
        "fishing": "🎣",
        "guitar": "🎸",
        "keyboard": "🎹",
        "microphone": "🎤",
        "headphones": "🎧",
        "video_game": "🎮"
      },
    },
    toolbar: [
      {
        hotkey: '⌘s',
        name: "openMdFile",
        tip: t('editor.button_save'),
        tipPosition: 's',
        icon: svgIcons.save,
        async click() {
          setTimeout(async () => {
            if (props.path != null) {
              let cont = vditor.value!.getValue();
              // await saveContentApi(props.path, cont)
              await useEditorStore().save(props.path);
              message.success(t('editor.save_successfully'));
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

      if (useSystemStore().realTheme !== "light") {
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
.vditor-emojis {
  width: 300px !important;
}
</style>
