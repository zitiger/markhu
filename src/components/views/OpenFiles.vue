<script lang="ts" setup>
import "vditor/dist/index.css"
import {
  CloseOutlined, SaveOutlined
} from '@ant-design/icons-vue';

import {useEditorStore} from '../../stores'
import {useStructureStore} from "../../stores";
import ResourcePanel from "../panels/ResourcePanel.vue";

const editorStore = useEditorStore()
const structureStore = (useStructureStore())
await structureStore.load()

let openedFiles = editorStore.fileCache;

function focusTab(filepath: string) {
  useEditorStore().read(filepath);
}

function removeTab(filepath: string) {
  useEditorStore().close(filepath)
}


function saveAll(e: MouseEvent) {
  e.stopPropagation()
  useEditorStore().saveAll();
}

function closeAll(e: MouseEvent) {
  e.stopPropagation()
  useEditorStore().closeAll();
}
</script>

<template>
  <resource-panel>
    <template v-slot:title>
      打开的文件
    </template>

    <template v-slot:buttons>
      <IconFont type="icon-save-all" title="保存所有" @click="saveAll($event)"/>
      <IconFont type="icon-close-all" title="关闭所有" @click="closeAll($event)"/>
    </template>

    <template v-slot:content>
      <div style="max-height: 30vh">
        <ul class="content">
          <li v-for="file in openedFiles" :class="{ active: file.filepath === useEditorStore().activeFile}">

            <span class="button">
              <close-outlined class="remove-tab" @click="removeTab(file.filepath)"/>
              <span class="changed" v-if="useEditorStore().isModified(file.filepath)">
                   <svg viewBox="0 0 20 20" width="20" height="20">
                    <circle cx="12" cy="12" r="4"/> <!-- 将r属性的值从5缩小到1.67 -->
                  </svg>
              </span>
            </span>
            <span class="filename" @click="focusTab(file.filepath)">{{ file.basename }}</span>
          </li>
        </ul>
      </div>
    </template>
  </resource-panel>


</template>
<style scoped>
.content ul {
  padding: 0;
  margin:0;
}

.content li {
  cursor: pointer;
  font-size: 14px;
  padding: 0 0 0 10px;
  display: flex;
}

.content li:hover{
  background-color: rgba(255, 255, 255, 0.08);
}
.content li.active{
  background-color: #1668dc !important;
}


.content li .button {
  display: inline-block;
  width: 20px;
  text-align: center;
}


.content li span {
  height: 24px;
  line-height: 24px;
}

.content li .remove-tab {
  display: none;
}

.content li:hover .remove-tab {
  display: inline-block;
}

.content li:hover .changed {
  display: none;
}

.content li .filename {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-grow: 1
}

</style>
