import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { setupPlugins } from '@src/plugins'
import { setupDirectives } from '@src/directives'

const app = createApp(App)

app.use(store).use(router).use(setupPlugins).use(setupDirectives).mount('#app')
