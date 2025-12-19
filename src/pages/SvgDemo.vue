<script setup lang="ts">
// import SvgIcon from "@src/components/SvgIcon.vue";
</script>

<template>
  <div class="svg-demo">
    <!-- <h1>SVG Icon 演示</h1> -->

    <div class="demo-section">
      <h2>基础使用</h2>
      <div class="icon-grid">
        <div class="icon-item">
          <SvgIcon name="eye" size="32" color="#409EFF" />
          <p>eye</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="star" size="32" />
          <p>star</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="settings" size="32" />
          <p>settings</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="download" size="32" />
          <p>download</p>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>不同尺寸</h2>
      <div class="icon-row">
        <div class="icon-item">
          <SvgIcon name="home" size="16" />
          <p>16px</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="home" size="24" />
          <p>24px</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="home" size="32" />
          <p>32px</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="home" size="48" />
          <p>48px</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="home" size="64" />
          <p>64px</p>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>自定义颜色</h2>
      <div class="icon-row">
        <div class="icon-item">
          <SvgIcon name="star" size="32" color="#409EFF" />
          <p>#409EFF</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="star" size="32" color="#67C23A" />
          <p>#67C23A</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="star" size="32" color="#E6A23C" />
          <p>#E6A23C</p>
        </div>
        <div class="icon-item">
          <SvgIcon name="star" size="32" color="#F56C6C" />
          <p>#F56C6C</p>
        </div>
      </div>
    </div>

    <!-- <div class="demo-section">
      <h2>在按钮中使用</h2>
      <div class="button-demo">
        <button class="demo-button">
          <SvgIcon name="home" size="20" />
          <span>主页</span>
        </button>
        <button class="demo-button">
          <SvgIcon name="download" size="20" />
          <span>下载</span>
        </button>
        <button class="demo-button">
          <SvgIcon name="settings" size="20" />
          <span>设置</span>
        </button>
        <button class="demo-button">
          <SvgIcon name="star" size="20" />
          <span>收藏</span>
        </button>
      </div>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.svg-demo {
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    text-align: center;
    font-size: 32px;
    margin-bottom: 40px;
    color: #333;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 20px;
    color: #666;
    border-bottom: 2px solid #409eff;
    padding-bottom: 10px;
  }
}

.demo-section {
  margin-bottom: 50px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.icon-row {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  p {
    font-size: 12px;
    color: #999;
    margin: 0;
  }
}

.button-demo {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.demo-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #409eff;
  background-color: #fff;
  color: #409eff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #409eff;
    color: #fff;
  }

  span {
    line-height: 1;
  }
}
</style>
