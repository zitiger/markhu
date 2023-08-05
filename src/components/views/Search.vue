<template>
  <a-input v-model:value="key" placeholder="输入关键词" size="small"/>
  <a-list size="small" bordered :data-source="data" style="height: 100%;overflow-y: auto">
    <template #renderItem="{ item }">
      <a-list-item @click="click(item.path)" style="cursor: pointer">
        <a-list-item-meta description="  ">
          <template #title>
            {{ item.title }}
          </template>
        </a-list-item-meta>

      </a-list-item>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useEditorStore, useStructureStore} from "../../stores";
import {StructureNode} from "../../api/model";

const key = ref<string>('');

function click(path:string){

  useEditorStore().read(path)

}


function flatten(node: StructureNode): StructureNode[] {
  // 定义一个空的数组，用于存放当前节点和子节点的结果
  let result: StructureNode[] = [];
  // 将当前节点添加到结果数组中
  if(!node.folder){
  result.push(node);}
  // 如果当前节点有子节点，遍历子节点并递归调用函数，然后使用concat方法合并结果
  if (node.children) {
    for (let child of node.children) {
      result = result.concat(flatten(child));
    }
  }
  // 返回结果数组
  return result;
}


const data = computed(() => {
  let copy: StructureNode[] = JSON.parse(JSON.stringify(useStructureStore().list));

// 定义一个空的结果数组
  let result: StructureNode[] = [];

// 遍历list中的每个节点，并调用递归函数，然后使用concat方法合并结果
  for (let node of copy) {

    result = result.concat(flatten(node));
  }

  if (key.value.length > 0) {
    result = result.filter((s) => {
      return s.title.indexOf(key.value) > -1;
    })
  }
  return result;
})

</script>

<style scoped>

</style>
