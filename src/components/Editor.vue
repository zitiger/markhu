<template>
  <div :id="editorId" style="border:none"/>
</template>

<script setup lang="ts">
import "vditor/dist/index.css"
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

const editorId = "editor-" + Md5.hashStr(props.path || '');

const vditor = ref<Vditor | null>(null);

import svgIcons from '../assets/vditor-toolbar-svg'
import {message, Modal, theme} from "ant-design-vue";
import path from "../api/path";
import {convertFileSrc} from "@tauri-apps/api/tauri";
import {useOutlineStore} from "../stores/modules/outline";

watch(() => useSystemStore().realTheme, (newTheme: string) => {
      if (newTheme !== 'light') {
        vditor.value?.setTheme("dark")
      } else {
        vditor.value?.setTheme("classic")
      }
    }
);

watch(() => useEditorStore().editMode, (newMode: 'wysiwyg' | 'ir' | 'sv') => {
      vditor.value?.destroy();
      vditor.value = init(newMode);
    }
);

watch(() => useEditorStore().fullscreenMode, (newMode: boolean) => {
      if (newMode) {
        document.querySelector("#" + editorId)?.classList.add("vditor--fullscreen")
      } else {
        document.querySelector("#" + editorId)?.classList.remove("vditor--fullscreen")
      }
    }
);

onMounted(() => {
  vditor.value = init('wysiwyg');
});


function init(mode: 'wysiwyg' | 'ir' | 'sv') {
  return new Vditor(editorId, {
    lang: useSystemStore().locale,
    mode: mode,
    height: "100% ",
    placeholder: t('editor.placeholder'),
    hint: {
      // emojiPath: 'https://unpkg.com/vditor@1.8.3/dist/images/emoji',
      // emojiTail: '<a href="https://ld246.com/settings/function" target="_blank">设置常用表情</a>',
      emoji,
    },
    counter: {
      enable: true,
      type: 'text'
    },
    toolbar,
    after: async () => {
      if (props.path != null) {
        let content = useEditorStore().getContent(props.path);
        vditor.value!.setValue(content);
      }

      if (useSystemStore().realTheme !== "light") {
        vditor.value!.setTheme("dark")
      } else {
        vditor.value!.setTheme("classic")
      }

      useOutlineStore().extract()
    },
    input: async (content) => {
      if (props.path != null) {
        useEditorStore().modify(props.path, content)
        useOutlineStore().extract();
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
}

const save = {
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
}

const toolbar = [
  save,
  /*"emoji",
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
  "edit-mode",*/



  {
    hotkey: "⌘E",
    icon: '<svg><use xlink:href="#vditor-icon-emoji"></use></svg>',
    name: "emoji",
    tipPosition: "s",
  },
  {
    hotkey: "⌘H",
    icon:
        '<svg><use xlink:href="#vditor-icon-headings"></use></svg>',
    name: "headings",
    tipPosition: "s",
  },
  {
    hotkey: "⌘B",
    icon: '<svg><use xlink:href="#vditor-icon-bold"></use></svg>',
    name: "bold",
    prefix: "**",
    suffix: "**",
    tipPosition: "s",
  },
  {
    hotkey: "⌘I",
    icon: '<svg><use xlink:href="#vditor-icon-italic"></use></svg>',
    name: "italic",
    prefix: "*",
    suffix: "*",
    tipPosition: "s",
  },
  {
    hotkey: "⌘D",
    icon: '<svg><use xlink:href="#vditor-icon-strike"></use></svg>',
    name: "strike",
    prefix: "~~",
    suffix: "~~",
    tipPosition: "s",
  },
  {
    hotkey: "⌘K",
    icon: '<svg><use xlink:href="#vditor-icon-link"></use></svg>',
    name: "link",
    prefix: "[",
    suffix: "](https://)",
    tipPosition: "s",
  },
  {
    name: "|",
  },
  {
    hotkey: "⌘L",
    icon: '<svg><use xlink:href="#vditor-icon-list"></use></svg>',
    name: "list",
    prefix: "* ",
    tipPosition: "s",
  },
  {
    hotkey: "⌘O",
    icon:
        '<svg><use xlink:href="#vditor-icon-ordered-list"></use></svg>',
    name: "ordered-list",
    prefix: "1. ",
    tipPosition: "s",
  },
  {
    hotkey: "⌘J",
    icon: '<svg><use xlink:href="#vditor-icon-check"></use></svg>',
    name: "check",
    prefix: "* [ ] ",
    tipPosition: "s",
  },
  {
    hotkey: "⇧⌘I",
    icon:
        '<svg><use xlink:href="#vditor-icon-outdent"></use></svg>',
    name: "outdent",
    tipPosition: "s",
  },
  {
    hotkey: "⇧⌘O",
    icon: '<svg><use xlink:href="#vditor-icon-indent"></use></svg>',
    name: "indent",
    tipPosition: "s",
  },
  {
    name: "|",
  },
  {
    hotkey: "⌘;",
    icon: '<svg><use xlink:href="#vditor-icon-quote"></use></svg>',
    name: "quote",
    prefix: "> ",
    tipPosition: "s",
  },
  {
    hotkey: "⇧⌘H",
    icon: '<svg><use xlink:href="#vditor-icon-line"></use></svg>',
    name: "line",
    prefix: "---",
    tipPosition: "s",
  },
  {
    hotkey: "⌘U",
    icon: '<svg><use xlink:href="#vditor-icon-code"></use></svg>',
    name: "code",
    prefix: "```",
    suffix: "\n```",
    tipPosition: "s",
  },
  {
    hotkey: "⌘G",
    icon:
        '<svg><use xlink:href="#vditor-icon-inline-code"></use></svg>',
    name: "inline-code",
    prefix: "`",
    suffix: "`",
    tipPosition: "s",
  },
  {
    hotkey: "⇧⌘B",
    icon: '<svg><use xlink:href="#vditor-icon-before"></use></svg>',
    name: "insert-before",
    tipPosition: "s",
  },
  {
    hotkey: "⇧⌘E",
    icon: '<svg><use xlink:href="#vditor-icon-after"></use></svg>',
    name: "insert-after",
    tipPosition: "s",
  },
  {
    name: "|",
  },
  {
    icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
    name: "upload",
    tipPosition: "s",
  },
  {
    hotkey: "⌘M",
    icon: '<svg><use xlink:href="#vditor-icon-table"></use></svg>',
    name: "table",
    prefix: "| col1",
    suffix:
        " | col2 | col3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |",
    tipPosition: "s",
  },
  {
    name: "|",
  },
  {
    hotkey: "⌘Z",
    icon: '<svg><use xlink:href="#vditor-icon-undo"></use></svg>',
    name: "undo",
    tipPosition: "s",
  },
  {
    hotkey: "⌘Y",
    icon: '<svg><use xlink:href="#vditor-icon-redo"></use></svg>',
    name: "redo",
    tipPosition: "s",
  },
  {
    name: "|",
  },

  {
    hotkey: "⌘'",
    icon:
        '<svg><use xlink:href="#vditor-icon-fullscreen"></use></svg>',
    name: "fullscreen",
    tipPosition: "s",
  },
  {
    icon: '<svg><use xlink:href="#vditor-icon-edit"></use></svg>',
    name: "edit-mode",
    tipPosition: "s",
  },
  {
    hotkey: "⌘P",
    icon: '<svg><use xlink:href="#vditor-icon-both"></use></svg>',
    name: "both",
    tipPosition: "s",
  },
  {
    icon:
        '<svg><use xlink:href="#vditor-icon-preview"></use></svg>',
    name: "preview",
    tipPosition: "s",
  },
  {
    icon: '<svg><use xlink:href="#vditor-icon-theme"></use></svg>',
    name: "content-theme",
    tipPosition: "s",
  },
  {
    icon:
        '<svg><use xlink:href="#vditor-icon-code-theme"></use></svg>',
    name: "code-theme",
    tipPosition: "s",
  },
  {
    name: "br",
  },
];

const emoji = {
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
}
</script>

<style>
.vditor-emojis {
  width: 300px !important;
}
</style>
