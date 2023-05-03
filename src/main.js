import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import './style/index.scss';

const app = createApp(App).use(router).use(store);
app.config.globalProperties.APP_HOST = 'http://localhost:8000/';
app.mount('#app');
