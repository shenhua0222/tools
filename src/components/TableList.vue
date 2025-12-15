<template>
  <div class="table-list">
    <el-table
      class="td-table"
      :data="tableData"
      :height="height"
      :stripe="stripe"
      :border="border"
      :size="size"
      :fit="fit"
      :show-header="showHeader"
      :show-overflow-tooltip="true"
      :highlight-current-row="highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        :width="55"
        fixed="left"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        :width="60"
        align="center"
      />

      <!-- 动态列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :resizable="column.resizable"
        :formatter="column.formatter"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :align="column.align || 'center'"
        :header-align="column.headerAlign || 'center'"
        :class-name="column.className"
        :filters="column.filters"
        :filter-method="column.filterMethod"
        :filtered-value="column.filteredValue"
      >
        <template #default="scope">
          <!-- 自定义渲染 -->
          <slot
            v-if="column.slot"
            :name="column.slot"
            :row="scope.row"
            :$index="scope.$index"
            :column="scope.column"
          />
          <!-- 默认渲染 -->
          <span v-else>{{ get(scope.row, column.prop) }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="showActions && actions.length > 0"
        :label="actionsLabel"
        :width="actionsWidth"
        :fixed="actionsFixed"
        :align="actionsAlign"
      >
        <template #default="scope">
          <div class="action-buttons">
            <el-button
              v-for="action in actions"
              :key="action.key"
              :type="action.type || 'primary'"
              :size="action.size || 'small'"
              :disabled="
                action.disabled
                  ? action.disabled(scope.row, scope.$index)
                  : false
              "
              :loading="
                action.loading ? action.loading(scope.row, scope.$index) : false
              "
              :icon="action.icon"
              :round="action.round"
              :circle="action.circle"
              :plain="action.plain"
              @click="handleActionClick(action, scope.row, scope.$index)"
            >
              {{ action.label }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="showPagination"
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      :total="pagination.total"
      :layout="pagination.layout"
      :background="pagination.background"
      :small="pagination.small"
      :disabled="pagination.disabled"
      :hide-on-single-page="pagination.hideOnSinglePage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { get } from "lodash";

// 列配置接口
export interface TableColumn {
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: boolean | "left" | "right";
  sortable?: boolean | "custom";
  resizable?: boolean;
  formatter?: (row: any, column: any, cellValue: any, index: number) => string;
  showOverflowTooltip?: boolean;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  className?: string;
  filters?: { text: string; value: any }[];
  filterMethod?: (value: any, row: any, column: any) => boolean;
  filteredValue?: any[];
  slot?: string; // 自定义插槽名称
}

// 操作按钮接口
export interface TableAction {
  key: string;
  label: string;
  type?: "primary" | "success" | "warning" | "danger" | "info";
  size?: "large" | "default" | "small";
  icon?: string;
  disabled?: (row: any, index: number) => boolean;
  loading?: (row: any, index: number) => boolean;
  round?: boolean;
  circle?: boolean;
  plain?: boolean;
  handler: (row: any, index: number) => void;
}

// 分页配置接口
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  pageSizes?: number[];
  total: number;
  layout?: string;
  background?: boolean;
  small?: boolean;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
}

// Props定义
interface Props {
  // 数据
  data: any[];
  columns: TableColumn[];
  actions?: TableAction[];

  // 表格属性
  height?: string | number;
  stripe?: boolean;
  border?: boolean;
  size?: "large" | "default" | "small";
  fit?: boolean;
  showHeader?: boolean;
  highlightCurrentRow?: boolean;

  // 选择列
  showSelection?: boolean;

  // 序号列
  showIndex?: boolean;

  // 操作列
  showActions?: boolean;
  actionsLabel?: string;
  actionsWidth?: number;
  actionsFixed?: boolean | "left" | "right";
  actionsAlign?: "left" | "center" | "right";

  // 分页
  showPagination?: boolean;
  pagination?: PaginationConfig;
}

// 默认Props
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  actions: () => [],

  // 表格默认属性
  stripe: false,
  border: true,
  size: "default",
  fit: true,
  showHeader: true,
  highlightCurrentRow: false,

  // 选择列默认属性
  showSelection: false,

  // 序号列默认属性
  showIndex: false,

  // 操作列默认属性
  showActions: true,
  actionsLabel: "操作",
  actionsWidth: 150,
  actionsFixed: "right",
  actionsAlign: "center",

  // 分页默认属性
  showPagination: false,
  pagination: () => ({
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    total: 0,
    layout: "total, sizes, prev, pager, next, jumper",
    background: true,
    small: false,
    disabled: false,
    hideOnSinglePage: false,
  }),
});

// Emits
const emit = defineEmits<{
  selectionChange: [selection: any[]];
  rowClick: [row: any, column: any, event: Event];
  sortChange: [sort: any];
  actionClick: [action: TableAction, row: any, index: number];
  sizeChange: [size: number];
  currentChange: [page: number];
}>();

// 计算属性
const tableData = computed(() => props.data);

// 事件处理
const handleSelectionChange = (selection: any[]) => {
  emit("selectionChange", selection);
};

const handleRowClick = (row: any, column: any, event: Event) => {
  emit("rowClick", row, column, event);
};

const handleSortChange = (sort: any) => {
  emit("sortChange", sort);
};

// 操作按钮点击处理
const handleActionClick = (action: TableAction, row: any, index: number) => {
  emit("actionClick", action, row, index);
  if (action.handler) {
    action.handler(row, index);
  }
};

// 分页事件处理
const handleSizeChange = (size: number) => {
  emit("sizeChange", size);
};

const handleCurrentChange = (page: number) => {
  emit("currentChange", page);
};
</script>

<style scoped lang="scss">
.table-list {
  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .el-button {
      margin: 0;
    }
  }

  .el-pagination {
    margin-top: 16px;
    text-align: right;
  }
}
</style>
