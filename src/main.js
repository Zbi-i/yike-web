import { createApp } from 'vue';
import App from './App.vue';

import router from './router/index';
import store from './store/index';
import './style/index.scss';
// import ViewTheImage from './components/ViewTheImage.vue';
// 注册一个全局组件
// component('ViewTheImage', ViewTheImage);

const app = createApp(App).use(router).use(store);
app.config.globalProperties.APP_HOST = 'http://localhost:8000/';
app.mount('#app');
