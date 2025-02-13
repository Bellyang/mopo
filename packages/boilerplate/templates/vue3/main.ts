import { createApp } from 'vue'

import router from './router'
import { key, store } from './store'
import App from './views/App.vue'

const app = createApp(App).use(store, key).use(router)

router.isReady().then(() => app.mount('#app'))
