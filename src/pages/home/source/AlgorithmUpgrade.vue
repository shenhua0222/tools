<script setup>
defineOptions({ name: "AlgorithmUpgrade" });
import { ref, onMounted } from "vue";
import {
  getAlgoUpgradeNumForHome,
  getStatisticsUpgradeAlgoForHome,
} from "@/api/TD/algorithm";

const upgradeNum = ref(0);
const alogTypeData = ref([]);

const fetchAlgoUpgradeNumForHome = async () => {
  const res = await getAlgoUpgradeNumForHome();
  upgradeNum.value = res.data.upgrade || 0;
};

const fetchAlgoTypeStatisticsForHome = async () => {
  const res = await getStatisticsUpgradeAlgoForHome();
  alogTypeData.value = res.data.result_dict || [];
};

onMounted(() => {
  // 获取升级总数
  fetchAlgoUpgradeNumForHome();
  // 获取算法类型数量
  fetchAlgoTypeStatisticsForHome();
});
</script>

<template>
  <div class="m-algorithm-upgrade">
    <el-row :span="24" :gutter="20">
      <el-col :span="24">
        <div class="item-bg">
          <div><img src="@/images/home/algor-upgrade.png" /></div>
          <div>
            <p>
              <span class="num">{{ upgradeNum }}</span> <span>个</span>
            </p>
            <p><span>已升级</span></p>
          </div>
          <div>
            <p v-for="item in alogTypeData" :key="item.type">
              <span>{{ item.comment }}</span
              ><span class="num small">{{ item.count }}</span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.m-algorithm-upgrade {
  height: 11rem;
  .el-row,
  .item-bg {
    height: 100%;
  }
  .item-bg {
    background-image: url("../../../images/home/algorithm-upgrade-bg.png");
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px;
    p {
      white-space: nowrap;
    }
  }
  img {
    height: 5rem;
    width: 5rem;
  }
  .num {
    font-size: 36px;
    color: #137aff;
    letter-spacing: 0;
    text-align: right;
    line-height: 28px;
    font-weight: 600;
    &.small {
      font-size: 20px;
      line-height: 24px;
      margin-left: 8px;
    }
  }
}
// @media screen and (min-width: 1600px) {
//   .m-algorithm-upgrade {
//     .item-bg {
//       padding: 20px 40px;
//       p {
//         font-size: 16px;
//       }
//     }
//     img {
//       height: 7rem;
//       width: 8rem;
//     }
//     .num {
//       &.small {
//         margin-left: 20px;
//       }
//     }
//   }
// }
</style>