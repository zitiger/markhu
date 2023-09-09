<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {computed, ref} from 'vue';
import {useEditorStore} from "../stores";

const {t} = useI18n()

const activeIconIndex = ref(0);

const selectIcon = (index: number) => {
  activeIconIndex.value = index;
};

const changedCount = computed(() => useEditorStore().changedFiles.length)
</script>

<template>
  <div class="navigator">
    <ul>
      <li :class="{ 'active': activeIconIndex === 0 }">
        <router-link to="/" @click="selectIcon(0)">
          <a-badge :count="changedCount" :overflow-count="9">
            <IconFont type="icon-resource" title="资源"/>
          </a-badge>
        </router-link>
      </li>
      <li :class="{ 'active': activeIconIndex === 1 }">
        <router-link to="/outline" @click="selectIcon(1)">
          <IconFont type="icon-outline" title="大纲"/>
        </router-link>
      </li>
      <li :class="{ 'active': activeIconIndex === 2 }">
        <router-link to="/search" @click="selectIcon(2)">
          <IconFont type="icon-search" title="搜索"/>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<style>
.navigator li.active .anticon svg {
  fill: var(--mh-primary-color) !important;;
}

.navigator li .anticon svg {
  fill: var(--mh-text-color) !important;;
}
</style>
<style scoped>
ul {
  list-style-type: none;
  padding: 5px 0;
  margin: 0;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
}

li {
  list-style-type: none;
  margin: 10px 0;
  padding: 4px 0;
}

li .icon-button {
  font-size: 1.8rem;

}

.active {
  border-left: 3px solid var(--mh-primary-color);
}
</style>
