<script lang="ts" setup>
import {useDialogStore, useEditorStore, useSystemStore} from '../../stores'
import {useI18n} from "vue-i18n";
import path from "../../api/path";
import {reactive, ref, watch} from "vue";

const {t} = useI18n();
const editStore = useEditorStore();

const keyword = ref('');

const list = reactive<string[]>([]);

watch(() => useDialogStore().isHistoryFileDialogVisible, async (newCount, oldCount) => {
  list.length = 0;
  list.push(...useSystemStore().history);

  keyword.value = ""
});

async function open(filepath: string) {
  await editStore.read(filepath)
}

async function change() {
  let result = useSystemStore().history.filter(f => f.indexOf(keyword.value) > -1);
  list.length = 0;
  list.push(...result);
}
</script>

<template>
  <a-modal v-model:open="useDialogStore().isHistoryFileDialogVisible" :title="t('dialog.history_file.title')">
    <template #footer>

    </template>
    <a-input v-model:value="keyword" @change="change" :placeholder="t('dialog.history_file.keyword_placeholder')"
             allow-clear/>

    <a-list item-layout="horizontal" :data-source="list" size="small">
      <template #renderItem="{ item }">
        <a-list-item @click="open(item)">
          <a-list-item-meta :description="item">
            <template #title>
              <div>{{ path.basename(item) }}</div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>

</template>
<style scoped>

.ant-list-item {
  padding-left: 2px !important;
  padding-right: 2px !important;;
}
</style>
