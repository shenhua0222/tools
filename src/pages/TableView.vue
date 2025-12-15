<script setup lang="ts">
import { ref } from "vue";
import TableList from "@src/components/TableList.vue";
import type { TableColumn, TableAction } from "@src/components/TableList.vue";

// 学生数据
const studentData = ref([
  {
    id: 1,
    name: "张三",
    age: 18,
    gender: "男",
    score: 95,
  },
  {
    id: 2,
    name: "李四",
    age: 19,
    gender: "女",
    score: 88,
  },
  {
    id: 3,
    name: "王五",
    age: 18,
    gender: "男",
    score: 92,
  },
  {
    id: 4,
    name: "赵六",
    age: 20,
    gender: "女",
    score: 85,
  },
  {
    id: 5,
    name: "孙七",
    age: 19,
    gender: "男",
    score: 90,
  },
]);

// 表格列配置
const columns: TableColumn[] = [
  {
    prop: "name",
    label: "姓名",
    width: 100,
    sortable: true,
  },
  {
    prop: "age",
    label: "年龄",
    width: 80,
    align: "center",
  },
  {
    prop: "gender",
    label: "性别",
    width: 80,
    align: "center",
  },
  {
    prop: "score",
    label: "成绩",
    width: 80,
    sortable: true,
    align: "center",
  },
];

// 操作按钮配置
const actions: TableAction[] = [
  {
    key: "edit",
    label: "编辑",
    type: "primary",
    size: "small",
    handler: (row) => {
      console.log("编辑学生:", row);
    },
  },
  {
    key: "delete",
    label: "删除",
    type: "danger",
    size: "small",
    handler: (row) => {
      console.log("删除学生:", row);
    },
  },
];

// 处理行点击
const handleRowClick = (row: any) => {
  console.log("点击了行:", row);
};

// 处理排序
const handleSortChange = (sort: any) => {
  console.log("排序变化:", sort);
};

// 处理操作按钮点击
const handleActionClick = (action: any, row: any, index: number) => {
  console.log("操作:", action.key, "行数据:", row, "索引:", index);
};
</script>

<template>
  <div class="table-view">
    <div class="table-header">
      <h2>学生信息表</h2>
    </div>
    <div class="table-container">
      <TableList
        :data="studentData"
        :columns="columns"
        :actions="actions"
        :show-index="true"
        :show-selection="true"
        :show-actions="true"
        :stripe="true"
        :border="true"
        @row-click="handleRowClick"
        @sort-change="handleSortChange"
        @action-click="handleActionClick"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-view {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;

  .table-header {
    margin-bottom: 20px;

    h2 {
      margin: 0;
      color: #303133;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .table-container {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
