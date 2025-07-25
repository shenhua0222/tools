<script setup lang="ts">
import { ref, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import { json2Obj } from "@utils/index";
import "vue-json-pretty/lib/styles.css";

const input = ref("");
const output = ref({});

watch(
  () => input.value,
  (newValue) => {
    try {
      output.value = json2Obj(newValue);
    } catch (e) {
      output.value = { error: "Invalid JSON" };
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="json-wrap">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>JSON 输入</span>
        </div>
      </template>
      <el-input
        v-model="input"
        :autosize="{ minRows: 2, maxRows: 5 }"
        type="textarea"
        placeholder="请输入 JSON 数据"
      />
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>输出</span>
        </div>
      </template>
      <vue-json-pretty :data="output" :deep="5" />
    </el-card>
  </div>
</template>

<style scoped>
.json-wrap {
  width: 90vw;
  height: 90vh;
}
.el-card {
  width: 100%;
  margin-top: 20px;
}
</style>
