<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {useEditorStore, useStructureStore, useSystemStore} from "../../stores";
import {StructureNode, SearchResult, SearchMatch} from "../../api/model";
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
  data.length = 0

  if (key.value.length > 0) {
    let res = await searchTextApi(useSystemStore().workspace, key.value, 5)
    data.push(...res)
  }
}
</script>

<template>
  <a-input v-model:value="key" :placeholder="t('search.keyword_placeholder')" size="small" @change="change"/>
  <div class="search-container">
    <resource-panel v-for="file in data">
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
