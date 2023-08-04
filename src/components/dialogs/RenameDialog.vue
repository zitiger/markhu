<script lang="ts" setup>
import {path} from "@tauri-apps/api";
import {existPath, renameApi} from "../../api/file";
import {useEditorStore, useStructureStore, useDialogStore, useSystemStore} from '../../stores'
import {reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";

let basename = ref('');
let filepath = ref('');
let extname = ref('');

watch(() => useDialogStore().isRenameDialogVisible, async (newCount, oldCount) => {
  console.log(`Count changed from ${oldCount} to ${newCount}`);
  let currentNode = useStructureStore().currentNode;

  basename.value = await path.basename(currentNode.path, '.md');
  filepath.value = currentNode.path;
  if (!currentNode.folder) {
    extname.value = await path.extname(currentNode.path);
  } else {
    extname.value = '';
  }
});

async function doRename() {

  let dirname = await path.dirname(filepath.value);
  let newPath = await path.join(dirname, basename.value)

  if (extname.value != null && extname.value.length > 0) {
    newPath = newPath + "." + extname.value
  }

  let exist = await existPath(newPath);
  if (exist) {
    message.error('目标名称 ' + basename.value + ' 已经存在');
    return;
  }

  console.log("renameParam.fullPath, newPath", filepath.value, newPath);
  await renameApi(filepath.value, newPath);
  await useStructureStore().rename(filepath.value, newPath)

  useDialogStore().hideRenameDialog()
}
</script>

<template>
  <a-modal v-model:open="useDialogStore().isRenameDialogVisible" title="修改名称" @ok="doRename()">
    <a-input v-model:value="basename"/>
  </a-modal>
</template>
<style>


</style>
