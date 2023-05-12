<template>
  <div id="wrapper">
    <component
      :is="currentPage"
      :loginIsShowFun="loginIsShowFun"
      :warningWrapper="warningWrapper"
      :userId="id">
    </component>
    <Docker :loginIsShowFun="loginIsShowFun"  :changePage="changePage"/>
    <login v-show="loginIsShow" v-model="loginIsShow" :message="message" />
    <Warning ref="warningWrapper"/>
  </div>
</template>

<style lang="scss" scoped>
@import '../../style/viriables';
#wrapper{
  position: relative;
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
}
</style>

<script>
import { ref } from 'vue';
import 'default-passive-events';
import { useStore } from 'vuex';
import Storage from '../../module/storage';
import Docker from '../../components/Docker.vue';
import Login from '../login/Login.vue';
import Warning from '../../components/Warning.vue';
import HomePageContent from './HomePageContent.vue';
import MyHomePage from '../my/MyHomePage.vue';
// 登录
const useLoginEffect = () => {
  const loginIsShow = ref(false);
  const message = ref('');
  const loginIsShowFun = (value) => {
    message.value = value;
    loginIsShow.value = !loginIsShow.value;
  };
  return {
    loginIsShow, message, loginIsShowFun,
  };
};

// 提示用户登录
const useLoginWarningEffect = (loginIsShowFun) => {
  const loginPromptTime = Storage.get('loginPromptTime');
  const isLogin = JSON.parse(Storage.get('isLogin'));
  if (isLogin) {
    return;
  }
  // 判断是否超过了登录提示时间
  console.log(loginPromptTime);
  if (!loginPromptTime) {
    loginIsShowFun();
    Storage.set('loginPromptTime', new Date().getTime());
  } else {
    const nowTime = new Date().getTime();
    const timeDifference = nowTime - loginPromptTime;
    if (timeDifference > 1000 * 60 * 60 * 24) {
      loginIsShowFun();
      Storage.set('loginPromptTime', new Date().getTime());
    }
  }
};
// 切换页面
const useChangePageEffect = () => {
  const PageList = ['HomePageContent', 'MessagePage', 'MyHomePage'];
  const currentPage = ref('HomePageContent');
  const changePage = (page) => {
    currentPage.value = PageList[page];
  };
  return {
    currentPage,
    changePage,
  };
};

export default {
  name: 'HomePage',
  // 组件
  components: {
    Warning,
    Docker,
    Login,
    HomePageContent,
    MyHomePage,
  },
  setup() {
    const store = useStore();
    const { id } = store.state.userInfo;
    // 切换页面
    const { currentPage, changePage } = useChangePageEffect();
    // 登录
    const { loginIsShow, message, loginIsShowFun } = useLoginEffect();
    // 提示用户登录
    useLoginWarningEffect(loginIsShowFun);
    const warningWrapper = ref(null);
    return {
      Docker,
      Login,
      Warning,
      MyHomePage,
      currentPage,
      changePage,
      warningWrapper,
      loginIsShow,
      message,
      loginIsShowFun,
      id,
    };
  },
};

</script>
