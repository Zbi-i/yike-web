import axios from 'axios';
import store from '../store';
import Stroage from '../module/storage';

const instance = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

// request 请求拦截(发送请求的时候携带着token)
instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.state.token}`;
  return config;
}, (err) => {
  console.log('err', err);
});

// 响应拦截
instance.interceptors.response.use(
  (response) => (response.status === 200 ? response : Promise.reject(response.statusText)),
  (error) => {
    const { status } = error.response;
    switch (status) {
      case 401:
        Stroage.remove('token');
        Stroage.remove('userInfo');
        Stroage.set('isLogin', false);
        store.commit('loginInOrUp');
        break;
      default:
        console.log('默认服务端响应错误~');
        break;
    }
    return Promise.reject(error);
  },
);

const get = (url, params = {}) => new Promise((resolve, reject) => {
  instance.get(url, params).then((response) => {
    resolve(response.data);
  }, (err) => {
    reject(err);
  });
});

const post = (url, params = {}) => new Promise((resolve, reject) => {
  instance.post(url, params).then((response) => {
    resolve(response.data);
  }, (err) => {
    reject(err.response);
  });
});

export {
  get,
  post,
};
