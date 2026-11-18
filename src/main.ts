import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/global.css'
import 'animate.css'
import { useThemeStore } from './stores/themeStore'
import { initWeChatSDK } from './utils/wechat'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize theme before mounting
const themeStore = useThemeStore()
themeStore.init()

// Initialize WeChat JS-SDK (if in WeChat browser)
initWeChatSDK()

app.mount('#app')
