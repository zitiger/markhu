<script setup lang="ts">
import {reactive, ref} from "vue";
import {useEditorStore, useSystemStore} from "../../stores";
import {SearchMatch, SearchResult} from "../../api/model";
import {useI18n} from "vue-i18n";
import ResourcePanel from "../panels/ResourcePanel.vue";
import {searchTextApi} from "../../api/file";
import path from "../../api/path";

const {t} = useI18n();
const key = ref<string>('');
const data = reactive<SearchResult[]>([]);

function click(path: string, match: SearchMatch) {
  useEditorStore().read(path);
}

async function change() {

  if (key.value.length > 0) {
    let res = await searchTextApi(useSystemStore().workspace, key.value, 5)
    data.length = 0
    data.push(...res)
  } else {
    data.length = 0
  }
}
</script>

<template>
  <a-input v-model:value="key" :placeholder="t('search.keyword_placeholder')" @change="change" allow-clear/>
  <div class="search-container">
    <div v-if="data.length===0&& key.length>0">
      <a-empty class="empty_result" :description="t('search.empty_result')"/>
    </div>
    <div v-else-if=" key.length===0">
      <a-empty class="empty_result" :description="t('search.keyword_placeholder')"/>
    </div>
    <resource-panel v-for="file in data" v-if="data.length!==0">
      <template v-slot:title>
        {{ path.basename(file.filepath) }}
      </template>

      <template v-slot:buttons>
        <a-badge :count="file.matches.length"/>
      </template>
      <template v-slot:content>
        <ul>
          <li v-for="match in file.matches" class="match" @click="click(file.filepath, match)">
            {{ match.prefix }}
            <span style="background-color: yellow">{{ key }}</span>
            {{ match.suffix }}
          </li>
        </ul>
      </template>
    </resource-panel>

  </div>
</template>

<style scoped>
.search-container {
  overflow-y: auto;
  height: 100%;
  padding-bottom: 20px;
}

.empty_result {
  margin-top: 50px;
}

ul {
  padding: 0;
  margin: 0;
}

li {
  list-style-type: none;
  cursor: pointer;
}


.match {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px 10px 5px 25px;
  font-size: 13px;
}

.match:hover {
  background-color: var(--mh-icon-button-background-color);
}
</style>
