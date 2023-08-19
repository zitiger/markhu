<template>
  <div v-html="desc"></div>
  <div v-if="treeData.length===0">
    <a-empty class="empty_result" :description="t('outline.empty_hint')"/>
  </div>
  <a-tree v-else :tree-data="treeData" block-node @select="scrollTo">
  </a-tree>

</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const desc = ref('')
const treeData = ref<OutlineNode[]>([]);

function scrollTo(key: string) {
  document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' })
}

export interface OutlineNode {
  title: string;
  key: string;
  children?: OutlineNode[];
}

setInterval(() => {
  let ul = document.querySelector(".ant-tabs-tabpane-active .vditor-outline__content>ul")
  let result = extractOutline(ul as HTMLUListElement);

  treeData.value.length = 0;
  treeData.value.push(...result)

}, 1000)

function extractOutline(ul: HTMLUListElement): OutlineNode[] {
  if (ul == null) {
    return [];
  }

  const outlineNodes: OutlineNode[] = [];

  const lis = ul.children;
  for (let i = 0; i < lis.length; i++) {
    const li = lis[i] as HTMLLIElement;
    const span = li.querySelector('span');
    const title = span?.innerText as string;
    const key = span?.dataset.targetId as string;

    const nestedUl = li.querySelector('ul');
    let children: OutlineNode[] = [];
    if (nestedUl) {
      children = extractOutline(nestedUl);
    }

    outlineNodes.push({
      title,
      key,
      children,
    });
  }

  return outlineNodes;
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

.vditor-outline__content li > span > svg {
  width: 10px;
  height: 10px;
}
</style>
