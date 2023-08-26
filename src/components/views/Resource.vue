<template>
  <div class="resource-container">
    <open-files></open-files>
    <structure></structure>
  </div>
</template>

<style scoped>
.resource-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 10px 0;
}

.resource-container > div:not(:first-child) {
  border-top: 1px solid var(--mh-divider-color);
  margin-top: 4px;
  padding-top: 2px;
}
</style>
<script setup lang="ts">
import OpenFiles from "./OpenFiles.vue";
import Structure from "./Structure.vue";
</script>
