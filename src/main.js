import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { registerComponents } from '@src/register'

const app = createApp(App)
app.config.productionTip = false

app.use(store).use(router).mount('#app')

// 注册组件
registerComponents(app)
