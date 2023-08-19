<template>
  <div v-html="desc"></div>
  <div v-if="useOutlineStore().outlines.length===0">
    <a-empty class="empty_result" :description="t('outline.empty_hint')"/>
  </div>
  <a-tree v-else :tree-data="useOutlineStore().outlines" block-node @select="scrollTo">
  </a-tree>

</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {useOutlineStore} from "../../stores/modules/outline";

const {t} = useI18n();

const desc = ref('')

// const treeData = ref<OutlineNode[]>([]);

function scrollTo(key: string) {
  document.getElementById(key)?.scrollIntoView({behavior: 'smooth'})
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
