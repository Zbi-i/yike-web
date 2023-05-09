import { createStore } from 'vuex';
import Stroage from '../module/storage';

export default createStore({
  state: {
    token: Stroage?.get('token') || '',
    userInfo: (function () {
      try {
        return JSON?.parse(Stroage.get('userInfo')) || {};
      } catch (err) {
        return {};
      }
    }()),
    momentList: {},
  },
  mutations: {
    delStateByKey(state, payload) {
      const { key } = payload;
      state[key] = '';
      Stroage.remove(key);
    },
    loginInOrUp(state) {
      state.token = Stroage.get('token');
      state.userInfo = JSON.parse(Stroage.get('userInfo'));
    },
  },
});
