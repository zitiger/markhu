<script lang="ts" setup>
import {existPath, renameApi} from "../../api/file";
import {useDialogStore, useStructureStore} from '../../stores'
import {reactive, ref, watch} from "vue";
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import path from "../../api/path";

const {t} = useI18n()
const formRef = ref();

const structureStore = useStructureStore()
let dirData = ref(structureStore.dir);

interface FormState {
  oldFolder: string;
  newFolder: string;
}

const formState = reactive<FormState>({
  oldFolder: useStructureStore().currentDir,
  newFolder: useStructureStore().currentDir,
});

watch(() => useStructureStore().currentDir, async (newValue, oldCount) => {
  formState.oldFolder = newValue;
  formState.newFolder = newValue;
});

async function doMove() {

  formRef.value.validate().then(async () => {

    const currentPath = useStructureStore().currentNode.path;
    const basename = path.basename(currentPath);
    let newPath = path.join(formState.newFolder, basename);
    let exist = await existPath(newPath);

    if (exist) {
      message.error(t('dialog.move.path_exist_message'));
      return;
    }

    await renameApi(currentPath, newPath)

    useStructureStore().move(currentPath, newPath)

    console.log("doMove", formState.newFolder, newPath)

    useDialogStore().hideMoveDialog();

    formState.newFolder = ''
  })
      .catch((error: any) => {
        console.log('error', error);
      });

}
</script>

<template>
  <a-modal v-model:open="useDialogStore().isMoveDialogVisible" :title="t('dialog.move.title')" @ok="doMove()">
    <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item :label="t('dialog.move.old_folder_label')" name="basename">
        <a-input v-model:value="formState.oldFolder"/>
      </a-form-item>
      <a-form-item :label="t('dialog.move.new_folder_label')" name="newFolder">
        <a-tree-select
            v-model:value="formState.newFolder"
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
    </a-form>
  </a-modal>
</template>
<style>
</style>
