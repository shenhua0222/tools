<script setup lang="ts">
import { ref } from 'vue';

const tableData = ref([
  { date: 'xxx系统', name: '13', address: 'No. 1, Lake Park' },
  { date: 'xxx系统', name: '13', address: 'No. 1, Lake Park' },
  { date: 'xxx系统', name: '13', address: 'No. 1, Lake Park' },
]);
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="子系统" />
    <el-table-column prop="name" label="算法数量" />
  </el-table>
</template>

<style lang="scss" scoped></style>
