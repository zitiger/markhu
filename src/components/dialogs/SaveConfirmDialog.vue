<script lang="ts" setup>
import {useDialogStore, useEditorStore} from '../../stores'
import {useI18n} from "vue-i18n";

const {t} = useI18n();

async function yes() {
  await useEditorStore().save(useEditorStore().closingFile);
  useEditorStore().close(useEditorStore().closingFile);
  useDialogStore().hideSaveConfirmDialog();
}

async function no() {
  useEditorStore().close(useEditorStore().closingFile)
  useDialogStore().hideSaveConfirmDialog();
}

function cancel() {
  useDialogStore().hideSaveConfirmDialog();
}

</script>

<template>
  <a-modal v-model:open="useDialogStore().isSaveConfirmDialogVisible" :title="t('dialog.save_file.title')">
    <template #footer>
      <a-button key="back" @click="no" style="float: left">{{ t('dialog.button_not_save') }}</a-button>
      <a-button key="back" @click="cancel">{{ t('dialog.button_cancel') }}</a-button>
      <a-button key="submit" type="primary" @click="yes">{{ t('dialog.button_save') }}</a-button>
    </template>
    <p>{{ t("dialog.save_file.content") }}</p>
  </a-modal>

</template>
<style>
</style>
