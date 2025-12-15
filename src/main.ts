import { createApp } from "vue";
import "./style/main.scss";
import App from "./App.vue";
import router from "./route";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import SvgIcon from "./components/SvgIcon.vue";
import svgIcons from "./icons/index";

const app = createApp(App);

// 注册 SvgIcon 组件为全局组件
app.component("SvgIcon", SvgIcon);

// 注册所有 SVG 图标组件
for (const [name, component] of Object.entries(svgIcons)) {
  app.component(name, component as any);
}

app.use(ElementPlus);
app.use(router);
app.mount("#app");
