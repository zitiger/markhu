<template>
  <div v-html="desc"></div>
  <a-tree :tree-data="treeData" block-node>

  </a-tree>
</template>
<script lang="ts" setup>

import {ref} from "vue";

const desc = ref('')
const treeData = ref<TreeNode[]>([]);

export interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
}


setInterval(() => {
  let ul= document.querySelector(".ant-tabs-tabpane-active .vditor-outline__content>ul")
  console.log("vditor-outline__content",ul)
  if (ul != null) {
    treeData.value.length=0;
    let result = parse(ul as HTMLUListElement);
    treeData.value.push(...result)
  }

}, 1000)



function parse(ul: HTMLUListElement): TreeNode[] {
  // 定义一个空的数组，用于存放TreeNode对象
  let result: TreeNode[] = [];
  // 获取ul元素下的所有直接子节点
  let children = ul.children;
  // 遍历子节点，如果是li元素，就创建一个TreeNode对象，并添加到结果数组中
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    if (child instanceof HTMLLIElement) {
      // 获取li元素下的第一个子节点，如果是span元素，就获取它的title和key
      let span = child.firstElementChild;
      if (span instanceof HTMLSpanElement) {
        let title = span.textContent || "";
        let key = span.getAttribute("data-target-id") || "";
        // 创建一个TreeNode对象，并设置它的title和key
        let node: TreeNode = {
          title,
          key,
        };
        // 获取li元素下的第二个子节点，如果是ul元素，就递归调用函数，并设置它的children
        let subUl = child.lastElementChild;
        if (subUl instanceof HTMLUListElement) {
          node.children = parse(subUl);
        }
        // 将TreeNode对象添加到结果数组中
        result.push(node);
      }
    }
  }
  // 返回结果数组
  return result;
}

</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0px 5px;
}

li {
  list-style-type: none;
  padding: 5px 0;
}

li:hover {
}



.vditor-outline__content li > span > svg{
  width: 10px;
  height: 10px;
}


</style>
