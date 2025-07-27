<script setup lang="ts"></script>

<template>
  <div class="box-wrap flex pl-15 pr-10">
    <div class="flex desc-wrap">
      <img width="42px" src="@/assets/home/system1.png" alt="" />
      <span class="pl-5">xxx系统</span>
    </div>
    <span class="count">28</span>
  </div>
</template>

<style lang="scss" scoped>
.box-wrap {
  height: 62px;
  background: url("@/assets/home/title_bg1.png") no-repeat center center;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  .desc-wrap {
    align-items: center;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #9eaab9;
    letter-spacing: 0.5px;
    font-weight: 500;
  }
  .count {
    font-family: DingTalk-JinBuTi;
    font-size: 20px;
    color: #00ffff;
    letter-spacing: 0.71px;
    line-height: 30px;
    font-weight: 400; 
  }
}
</style>
