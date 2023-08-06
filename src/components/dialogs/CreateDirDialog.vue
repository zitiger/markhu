<script lang="ts" setup>
import {createFileApi, createDirApi, existPath, readFolderApi} from "../../api/file";
import {useEditorStore, useStructureStore, useDialogStore, useSystemStore} from '../../stores'
import {reactive, ref, watch} from "vue";
import {path} from "@tauri-apps/api";
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const formRef = ref();
const ext = ""

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

  formRef.value.validate().then(async () => {

    let filename = formState.basename + ext;
    let filepath = await path.join(formState.folder, filename);
    let exist = await existPath(filepath);


    console.log("doCreate", formState.folder, filename)
    if (exist) {
      message.error(t('dialog.create_file.file_exist_message'));
      return;
    }

    if (useDialogStore().isCreateDirDialogVisible) {
      await useStructureStore().create(formState.folder, filename, false)
      useDialogStore().hideCreateDirDialog();
    } else {
      await useStructureStore().create(formState.folder, filename, true)
      useDialogStore().hideCreateFileDialog();
    }

    console.log("path", filepath)

    await useEditorStore().read(filepath);

    formState.basename = ''
  })
      .catch((error: any) => {
        console.log('error', error);
      });

}

watch(() => useStructureStore().currentDir, async (newValue, oldCount) => {
  formState.folder = newValue;
});
</script>

<template>
  <a-modal v-model:open="useDialogStore().isCreateDirDialogVisible" :title="t('dialog.create_dir.title')"
           @ok="doCreate()">
    <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item :label="t('dialog.create_dir.parent_folder_label')" name="folder">
        <a-tree-select
            v-model:value="formState.folder"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
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
      <a-form-item :label="t('dialog.create_dir.folder_name_label')" name="basename"
                   :rules="[{ required: true, message: t('dialog.create_dir.folder_name_required_message') }]">
        <a-input v-model:value="formState.basename"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<style>
</style>
