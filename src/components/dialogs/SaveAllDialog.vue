<script lang="ts" setup>
import {useEditorStore, useStructureStore, useDialogStore, useSystemStore} from '../../stores'
import {getCurrent} from '@tauri-apps/plugin-window'
import {useI18n} from "vue-i18n";
import path from "path-browserify";

const {t} = useI18n();
const dialogStore = useDialogStore();
const editStore = useEditorStore();

async function dispose() {
  dialogStore.hideSaveAllDialog();
  await getCurrent().close()
}

function cancel() {
  dialogStore.hideSaveAllDialog();
}

async function save() {
  await editStore.saveAll()
  dialogStore.hideSaveAllDialog();
  await getCurrent().close()
}
</script>

<template>
  <a-modal v-model:open="useDialogStore().isSaveAllDialogVisible" :title="t('dialog.save_all.title')">
    <template #footer>
      <a-button @click="dispose" style="float: left">{{ t("dialog.button_not_save") }}</a-button>
      <a-button @click="cancel">{{ t("dialog.button_cancel") }}</a-button>
      <a-button type="primary" @click="save">{{ t("dialog.button_save") }}</a-button>
    </template>
    <p>{{ t("dialog.save_all.content") }}</p>
    <ul>
      <li v-for="item in useEditorStore().changedFiles">{{ path.basename(item) }}</li>
    </ul>
  </a-modal>

</template>
<style scoped>
ul {
  padding:10px;
}
li {
  list-style-type: none;
}
</style>
