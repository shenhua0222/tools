import { createApp } from "vue";
import "./style/main.scss";
import App from "./App.vue";
import router from "./route";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import SvgIcon from "./components/SvgIcon.vue";
import "virtual:svg-icons-register"; // Register SVG sprite sheet

const app = createApp(App);

// 注册 SvgIcon 组件为全局组件
app.component("SvgIcon", SvgIcon);

app.use(ElementPlus);
app.use(router);
app.mount("#app");
