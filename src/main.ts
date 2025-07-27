import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './route'
import ElementPlus from 'element-plus'
// import "normalize.css"
import '@/styles/index.scss'
import "@/styles/main.scss"; // global css
// import 'element-plus/dist/index.css'
import '@/styles/td-common.scss'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')

