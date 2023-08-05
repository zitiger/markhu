<script lang="ts" setup>
import {createFileApi, createDirApi, existPath, readFolderApi} from "../../api/file";
import {useEditorStore, useStructureStore, useDialogStore, useSystemStore} from '../../stores'
import {reactive, ref, watch} from "vue";
import {path} from "@tauri-apps/api";
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const formRef = ref();
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
    } else {
      await useStructureStore().create(formState.folder, filename, true)
    }

    console.log("path", filepath)


    useDialogStore().hideCreateFileDialog();

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
  <a-modal v-model:open="useDialogStore().isCreateFileDialogVisible" :title="t('dialog.create_file.title')"
           @ok="doCreate()">
    <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item :label="t('dialog.create_file.parent_folder_label')" name="folder"
                   :rules="[{ required: true, message: t('dialog.create_file.parent_folder_required_message') }]">
        <a-tree-select
            v-model:value="formState.folder"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :placeholder="t('dialog.create_file.parent_folder_required_message')"
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
      <a-form-item :label="t('dialog.create_file.file_name_label')" name="basename"
                   :rules="[{ required: true, message: t('dialog.create_file.file_name_required_message') }]">
        <a-input v-model:value="formState.basename" addon-after=".md"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<style>
</style>
