<script lang="ts" setup>
import {createFileApi, createDirApi, existPath, readFolderApi} from "../../api/file";

import {useEditorStore, useStructureStore, useDialogStore, useSystemStore} from '../../stores'
import {reactive, ref, watch} from "vue";
import {path} from "@tauri-apps/api";
import {message} from "ant-design-vue";

const type = '文件';
const ext = ".md"

const structureStore = useStructureStore()
let dirData = ref(structureStore.dir);

interface FormState {
  folder: string;
  basename: string;
}

const formState = reactive<FormState>({
  folder: useStructureStore().currentDir,// useSystemStore().folder,
  basename: '',
});


async function doCreate() {

  let filename = formState.basename + ext;
  let filepath = await path.join(formState.folder, filename);
  let exist = await existPath(filepath);


  console.log("doCreate", formState.folder, filename)
  if (exist) {
    message.error(type + '已经存在，不能重复创建');

    return;
  }


  if (useDialogStore().isCreateDirDialogVisible) {
    await useStructureStore().create(formState.folder, filename, false)
  } else {
    await useStructureStore().create(formState.folder, filename, true)
  }

  useDialogStore().hideCreateFileDialog();

  await useEditorStore().read(filepath);

  formState.basename = ''
}

watch( () => useStructureStore().currentDir, async(newValue, oldCount) => {
   formState.folder = newValue;
});
</script>

<template>
  <a-modal v-model:open="useDialogStore().isCreateFileDialogVisible" title="创建" @ok="doCreate()">
    <a-form :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="文件夹" name="folder" :rules="[{ required: true, message: '请选择文件夹' }]">
        <a-tree-select
            v-model:value="formState.folder"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="Please select"
            allow-clear
            tree-default-expand-all
            :tree-data="dirData"
            tree-node-filter-prop="label"
            :fieldNames="{
      label: 'title',
      value: 'path',
    }"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item label="名称" name="basename" :rules="[{ required: true, message: '请输入名称' }]">
        <a-input v-model:value="formState.basename"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<style>
</style>
