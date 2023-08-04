<script lang="ts" setup>
import {useEditorStore, useStructureStore, useDialogStore, useSystemStore} from '../../stores'
import { appWindow } from '@tauri-apps/api/window'


const dialogStore = useDialogStore();
const editStore = useEditorStore();

async function dispose() {
  dialogStore.hideSaveAllDialog();
  await appWindow.close()
}

function  cancel(){
  dialogStore.hideSaveAllDialog();
}

async function  save(){
  await editStore.saveAll()
  dialogStore.hideSaveAllDialog();
  await appWindow.close()
}
</script>

<template>
  <a-modal v-model:open="useDialogStore().isSaveAllDialogVisible" title="是否保存?">
    <template #footer>
      <a-button key="back" @click="dispose" type="primary" style="float: left">不保存</a-button>
      <a-button key="back" @click="cancel">取消</a-button>
      <a-button key="submit" type="primary" @click="save">保存</a-button>
    </template>
    <p>是否保存对文件的更改？</p>
  </a-modal>

</template>
<style>
</style>
