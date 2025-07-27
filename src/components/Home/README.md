# TableList 通用表格组件

基于 Element Plus 的 `el-table` 封装的通用表格组件，支持动态列配置、操作按钮和分页功能。

## 基本用法

```vue
<template>
  <TableList
    :data="tableData"
    :columns="columns"
    :show-index="true"
    :show-selection="true"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup>
import TableList from '@/components/Home/TableList.vue'

const tableData = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
]

const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'email', label: '邮箱', minWidth: 200 }
]

const handleSelectionChange = (selection) => {
  console.log('选中的行:', selection)
}
</script>
```

## Props

### 数据相关
- `data`: 表格数据数组
- `columns`: 列配置数组
- `actions`: 操作按钮配置数组（可选）

### 表格属性
- `height`: 表格高度
- `stripe`: 是否显示斑马纹
- `border`: 是否显示边框
- `size`: 表格尺寸（large/default/small）
- `fit`: 列的宽度是否自撑开
- `showHeader`: 是否显示表头
- `highlightCurrentRow`: 是否高亮当前行

### 功能列
- `showSelection`: 是否显示选择列
- `showIndex`: 是否显示序号列
- `showActions`: 是否显示操作列
- `showPagination`: 是否显示分页

### 操作列配置
- `actionsLabel`: 操作列标题
- `actionsWidth`: 操作列宽度
- `actionsFixed`: 操作列固定位置
- `actionsAlign`: 操作列对齐方式

### 分页配置
- `pagination`: 分页配置对象

## 列配置 (TableColumn)

```typescript
interface TableColumn {
  prop: string           // 字段名
  label: string          // 列标题
  width?: string | number // 列宽度
  minWidth?: string | number // 最小宽度
  fixed?: boolean | 'left' | 'right' // 固定位置
  sortable?: boolean | 'custom' // 是否可排序
  resizable?: boolean    // 是否可调整宽度
  formatter?: Function   // 格式化函数
  showOverflowTooltip?: boolean // 是否显示tooltip
  align?: 'left' | 'center' | 'right' // 对齐方式
  headerAlign?: 'left' | 'center' | 'right' // 表头对齐
  className?: string     // 自定义类名
  filters?: Array        // 过滤器
  filterMethod?: Function // 过滤方法
  slot?: string          // 自定义插槽名称
}
```

## 操作按钮配置 (TableAction)

```typescript
interface TableAction {
  key: string            // 按钮唯一标识
  label: string          // 按钮文本
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' // 按钮类型
  size?: 'large' | 'default' | 'small' // 按钮尺寸
  icon?: string          // 图标
  disabled?: Function    // 禁用条件函数
  loading?: Function     // 加载状态函数
  round?: boolean        // 是否圆角
  circle?: boolean       // 是否圆形
  plain?: boolean        // 是否朴素按钮
  handler: Function      // 点击处理函数
}
```

## 分页配置 (PaginationConfig)

```typescript
interface PaginationConfig {
  currentPage: number    // 当前页
  pageSize: number       // 每页条数
  pageSizes?: number[]   // 每页条数选项
  total: number          // 总条数
  layout?: string        // 布局
  background?: boolean   // 是否有背景色
  small?: boolean        // 是否小尺寸
  disabled?: boolean     // 是否禁用
  hideOnSinglePage?: boolean // 单页时是否隐藏
}
```

## 事件

- `selectionChange`: 选择变化事件
- `rowClick`: 行点击事件
- `sortChange`: 排序变化事件
- `actionClick`: 操作按钮点击事件
- `sizeChange`: 分页大小变化事件
- `currentChange`: 当前页变化事件

## 自定义渲染

通过 `slot` 属性可以自定义列渲染：

```vue
<template>
  <TableList :data="tableData" :columns="columns">
    <!-- 自定义状态列 -->
    <template #status="{ row }">
      <el-tag :type="getStatusType(row.status)">
        {{ getStatusText(row.status) }}
      </el-tag>
    </template>
    
    <!-- 自定义头像列 -->
    <template #avatar="{ row }">
      <el-avatar :src="row.avatar" :size="40" />
    </template>
  </TableList>
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'avatar', label: '头像', width: 80, slot: 'avatar' }
]
</script>
```

## 完整示例

```vue
<template>
  <TableList
    :data="tableData"
    :columns="columns"
    :actions="actions"
    :show-index="true"
    :show-selection="true"
    :show-pagination="true"
    :pagination="paginationConfig"
    @selection-change="handleSelectionChange"
    @action-click="handleActionClick"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'
import TableList from '@/components/Home/TableList.vue'
import { ElMessage } from 'element-plus'

// 数据
const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
])

// 列配置
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80, align: 'center' },
  { prop: 'email', label: '邮箱', minWidth: 200 }
]

// 操作按钮
const actions = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    size: 'small',
    handler: (row) => {
      ElMessage.success(`编辑用户: ${row.name}`)
    }
  },
  {
    key: 'delete',
    label: '删除',
    type: 'danger',
    size: 'small',
    handler: (row) => {
      ElMessage.warning(`删除用户: ${row.name}`)
    }
  }
]

// 分页配置
const paginationConfig = reactive({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 100,
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true
})

// 事件处理
const handleSelectionChange = (selection) => {
  console.log('选中的行:', selection)
}

const handleActionClick = (action, row, index) => {
  console.log('操作按钮点击:', action.key, row)
}

const handleSizeChange = (size) => {
  paginationConfig.pageSize = size
}

const handleCurrentChange = (page) => {
  paginationConfig.currentPage = page
}
</script>
```

## 特性

- ✅ 基于 Element Plus，兼容性好
- ✅ 支持动态列配置
- ✅ 支持操作按钮和自定义处理函数
- ✅ 支持分页功能
- ✅ 支持自定义列渲染
- ✅ 支持选择、排序、过滤等功能
- ✅ TypeScript 类型支持
- ✅ 响应式设计 