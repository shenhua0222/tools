<script setup lang="ts">
import countBox from "./coponents/countBox.vue";
// import Table from "./coponents/table.vue";
import TableList from "@/components/Home/TableList.vue";
import { ref } from "vue";

const tableData = ref([
  { name: "xxx系统", count: "13", address: "No. 1, Lake Park" },
  { name: "xxx系统", count: "13", address: "No. 1, Lake Park" },
  { name: "xxx系统", count: "13", address: "No. 1, Lake Park" },
]);

const tableColumns = ref([
  { prop: "name", label: "子系统" },
  { prop: "count", label: "算法数量" },
]);
</script>

<template>
  <div class="home-page">
    <div class="nav flex-center alilg-center">
      <span>智能算法演进平台软件</span>
      <!-- <p>
        <span>14:27</span>
        <span>星期二</span>
        <span>2025年7月22日</span>
      </p> -->
    </div>
    <div class="p-15">
      <div class="box mb-15 pb-20">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="title mb-15">地面</div>
            <el-row :gutter="15" class="mb-15">
              <el-col :span="8">
                <countBox></countBox>
              </el-col>
              <el-col :span="8">
                <countBox></countBox>
              </el-col>
              <el-col :span="8">
                <countBox></countBox>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <TableList
                  :data="tableData"
                  :columns="tableColumns"
                  :border="false"
                  :stripe="true"
                />
              </el-col>
              <el-col :span="8">
                <TableList
                  :data="tableData"
                  :columns="tableColumns"
                  :border="false"
                  :stripe="true"
                />
              </el-col>
              <el-col :span="8">
                <TableList
                  :data="tableData"
                  :columns="tableColumns"
                  :border="false"
                  :stripe="true"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <div class="title mb-15">地面</div>
            <el-row :gutter="15" class="mb-15">
              <el-col :span="8">
                <countBox></countBox>
              </el-col>
              <el-col :span="8">
                <countBox></countBox>
              </el-col>
              <el-col :span="8">
                <countBox></countBox>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <TableList
                  :data="tableData"
                  :columns="tableColumns"
                  :border="false"
                  :stripe="true"
                />
              </el-col>
              <el-col :span="8">
                <TableList
                  :data="tableData"
                  :columns="tableColumns"
                  :border="false"
                  :stripe="true"
                />
              </el-col>
              <el-col :span="8">
                <TableList
                  :data="tableData"
                  :columns="tableColumns"
                  :border="false"
                  :stripe="true"
                />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="20">
          <el-col :span="12">
            <div class="box">
              <div class="title">算法训练</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="box">
              <div class="title">算法概况</div>
            </div>
          </el-col>
      </el-row>
    </div>

    <div></div>
  </div>
</template>

<style lang="scss">
.app-main.no-left-menu {
  padding-left: 0px;
  padding-bottom: 0px;
}
</style>

<style scoped lang="scss">
.home-page {
  width: 100%;
  height: 100%;
  background: url("@/assets/home/bg.jpg") no-repeat center center;
  background-size: 100% 100%;
  .nav {
    height: 60px;
    background: url("@/assets/home/nav.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .box {
    background: url("@/assets/home/box_bg.png") no-repeat left top;
    background-size: 100% 100%;
    padding: 15px;
  }
  .title {
    height: 40px;
    background: url("@/assets/home/title_bg.png") no-repeat left bottom;
    background-size: contain;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #cbcfff;
    font-weight: 500;
    padding-left: 25px;
    line-height: 40px;
  }

  :deep(.el-table .el-table__cell.is-center) {
    background-color: transparent;
  }
  :deep(.table-list .el-table tr) {
    background: linear-gradient(
      90deg,
      rgba(14, 68, 189, 0.2) 0%,
      rgba(40, 127, 254, 0.05) 100%
    );
    &:hover {
      background: linear-gradient(
        90deg,
        rgba(14, 68, 189, 0.5) 0%,
        rgba(40, 127, 254, 0.2) 100%
      );
    }
    & > td.el-table__cell {
      background: transparent;
    }
  }
}


</style>
