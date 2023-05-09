<template>
  <div class="login_wrapper">
    <div class="masking"></div>
    <div class="login_box">
      <h2 id="title">登录后即可{{ message }}</h2>
      <div class="close iconfont icon-guanbi" @click="closeHandleClick"></div>
      <div class="login">
        <div class="nav_warper">
          <div class="nav">
            <span :class="{nav_active: showLogin === 'loginIn' }"
                  @click="(event) => changeShowLogin(event, 'loginIn')">登录</span>
            <span :class="{nav_active: showLogin === 'loginUp' }"
                  @click="(event) => changeShowLogin(event, 'loginUp')">注册</span>
          </div>
        </div>
        <!-- 登录 -->
        <form @submit="(event) => loginInBtnClick(event)"  v-show="showLogin === 'loginIn'">
          <div class="login_in">
            <div class="accout">
              <input
                type="text" name="account" id="login_in_account"
                autocomplete="username"
                v-model="loginInInfo.account" placeholder="用户名/邮箱">
            </div>
            <div class="password">
              <input v-model="loginInInfo.password"
              autocomplete="current-password"
              type="password" name="password" id="login_in_password" placeholder="密码">
            </div>
            <input
              id="login_in_btn" class="login_in_btn" type="submit"
              :class="{active: loginInBtnLock}" ref="loginInBtn" value="登录"/>
          </div>
        </form>
        <!-- 注册 -->
        <form @submit="(event) => loginUpBtnClick(event)" v-show="showLogin == 'loginUp'">
          <div class="login_up">
            <div class="accout">
              <input v-model="loginUpInfo.account"
                type="text" name="account" id="login_up_account"
                autocomplete="email"
                placeholder="请输入邮箱">
              <ul></ul>
            </div>
            <div class="username">
              <input v-model="loginUpInfo.username"
              autocomplete="username"
              type="text" name="username" id="login_up_username" placeholder="请输入用户名">
            </div>
            <div class="password">
              <input v-model="loginUpInfo.password"
              autocomplete="off"
              type="password" name="password" id="login_up_password" min="6" placeholder="请输入密码">
            </div>
            <div class="confirm_password">
              <input v-model="loginUpInfo.confirmPassword"
                autocomplete="off"
                type="password" name="password" id="login_up_confirm_password"
                min="6" placeholder="确认密码">
            </div>
            <input
              id="login_up_btn" class="login_up_btn" type="submit"
              :class="{active: loginUpBtnLock, login_up_btn: true}" ref="loginUpBtn" value="注册"/>
          </div>
        </form>
      </div>
      <div class="warning" ref="warning"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../../style/viriables';
.login_wrapper{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.masking{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.4);
  z-index: 2;
}
.login_box{
  position: fixed;
  left: 50%;
  top: 50%;
  width: 3.2rem;
  padding: .16rem;
  background-color: $bg-color-default;
  transform: translate(-50%, -50%);
  overflow: hidden;
  box-sizing: border-box;
  z-index: 3;
}
#title{
  text-align: center;
  margin-bottom: .16rem;
}
.login{
  padding: .12rem;
  border-radius: .06rem;
  background-color: $bg-color-default;
  box-sizing: border-box;
}
.nav_warper{
  margin-bottom: .12rem;
  .nav{
    text-align: center;
    span{
      display: inline-block;
      padding: .08rem .16rem;
      margin: 0 .08rem;
      cursor: pointer;
    }
    &_active{
      border-bottom: solid .03rem #febbc8;
    }
  }
}
.login_in, .login_up{
  .accout, .password, &_btn, .username, .confirm_password{
    width: 100%;
    height: .4rem;
    padding: 0 .08rem;
    border-radius: .03rem;
    background-color: $block-bg-color;
    margin: .06rem 0;
    box-sizing: border-box;
    input{
      width: 100%;
      height: 100%;
    }
  }
  &_btn{
    color: $font-color-reversal;
    background-color: $button-activate-bg-color;
    opacity: .5;
  }
  &_btn.active{
    opacity: 1;
  }
}
.close{
  position: absolute;
  top: .16rem;
  right: .16rem;
  font-size: .18rem;
  // font-weight: bold;
  color: $font-color-default;
  cursor: pointer;
}
.warning{
  font-size: .12rem;
  padding: 0 .06rem;
  color: $color-warning;
}

</style>

<script>
import {
  computed, reactive, ref,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { post } from '../../utils/axios';
import { insertAfter } from '../../js/tools';
import Storage from '../../module/storage';

// 错误警告
const useWarningEffect = () => {
  // newElement 传递过来一个节点的ID值
  // message警告文本信息
  const warning = ref(null);
  const showWarningMessage = (newElement, warningMessage) => {
    insertAfter(warning.value, document.getElementById(`${newElement}`)?.parentNode);
    warning.value.innerHTML = warningMessage;
  };
  return { warning, showWarningMessage };
};

// 登录
const useLoginInEffect = (router, store, showWarningMessage, closeHandleClick) => {
  // 给文本框做双向绑定
  const loginInBtn = ref(null);
  const loginInInfo = reactive({
    account: '',
    password: '',
  });
  // 是否符合登录条件？/btn 按钮激活
  const loginInBtnLock = computed(() => {
    const btnLock = (!!loginInInfo.account && loginInInfo.password.length > 5);
    return btnLock;
  });
  // 登录校验
  const loginInHandle = () => {
    let warningMessage = '';
    let newElement;
    let upcheck = false;
    if (!loginInInfo.account) {
      warningMessage = '请输入邮箱/用户名~';
      newElement = 'login_in_account';
    } else if (!loginInInfo.password) {
      warningMessage = '请输入用户名~';
      newElement = 'login_in_password';
    } else {
      upcheck = true;
    }
    showWarningMessage(newElement, warningMessage);
    return upcheck;
  };
  // 发送登录请求
  const loginIn = async (username, password) => {
    console.log('发送登录请求');
    post('login', { username, password }).then((res) => {
      console.log(res);
      const { user, token } = res;
      Storage.set('token', token);
      Storage.set('userInfo', JSON.stringify(user));
      Storage.set('isLogin', true);
      store.commit('loginInOrUp');
      closeHandleClick();
    }, (error) => {
      console.log(error);
      showWarningMessage('login_in_account', error.data);
    });
  };
  // 登录按钮点击事件
  const loginInBtnClick = async (event) => {
    event.preventDefault();
    // 执行表单校验，通过后发送登录请求
    console.log(loginInHandle());
    if (loginInHandle()) loginIn(loginInInfo.account, loginInInfo.password);
  };
  return {
    loginIn,
    loginInInfo,
    loginInBtn,
    loginInBtnLock,
    loginInBtnClick,
  };
};

// 注册
const useLoginUpEffect = (showWarningMessage, closeHandleClick) => {
  const { loginIn } = useLoginInEffect();

  // 给文本框做双向绑定
  const loginUpBtn = ref(null);
  const loginUpInfo = reactive({
    account: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  // 注册错误警告
  function checkInput(value, message, element) {
    if (!value) {
      showWarningMessage(element, message);
      return false;
    }
    return true;
  }
  const loginUpHandle = async () => {
    let warningMessage = '';
    let newElement;
    let upcheck = false;

    // 使用 checkInput 函数进行验证
    if (!checkInput(loginUpInfo.account, '请输入邮箱~', 'login_up_account')) {
      return false;
    }
    if (!checkInput(loginUpInfo.username, '请输入用户名~', 'login_up_username')) {
      return false;
    }
    if (!checkInput(loginUpInfo.password, '密码长度大于5位数~', 'login_up_password')) {
      return false;
    }
    if (!checkInput(loginUpInfo.confirmPassword, '请确认密码~', 'login_up_confirm_password')) {
      return false;
    }

    // 验证密码是否一致
    if (loginUpInfo.password !== loginUpInfo.confirmPassword) {
      warningMessage = '两次密码输入不一致~';
      newElement = 'login_up_confirm_password';
      showWarningMessage(newElement, warningMessage);
      return false;
    }

    // 验证用户名和邮箱是否已被使用
    const resultName = await post('users/info', { username: loginUpInfo.username });
    const resultMail = await post('users/info', { account: loginUpInfo.account });
    if (resultName === loginUpInfo.username) {
      warningMessage = '用户名已被使用~';
      newElement = 'login_up_username';
    } else if (resultMail === loginUpInfo.account) {
      warningMessage = '该邮箱已被注册~';
      newElement = 'login_up_account';
    } else {
      upcheck = true;
    }
    showWarningMessage(newElement, warningMessage);
    return upcheck;
  };
  // 是否符合注册条件？/btn 按钮激活
  const loginUpBtnLock = computed(() => {
    const {
      account, username, password, confirmPassword,
    } = loginUpInfo;
    // 账号和用户名不能为空，密码长度最小6位，确认密码要和密码一致
    const btnLock = (!!account && !!username
    && password.length > 5 && password === confirmPassword);
    return btnLock;
  });
  // 注册按钮点击事件
  const loginUpBtnClick = async (event) => {
    event.preventDefault();
    const isLoginUp = await loginUpHandle();
    if (isLoginUp) {
      post('users', loginUpInfo).then(async (res) => {
        console.log(res);
        // 用户注册成功，默认登录
        loginIn(loginUpInfo.account, loginUpInfo.password);
        closeHandleClick();
      }, (err) => {
        console.log(err);
      });
    }
  };
  return {
    loginUpInfo,
    loginUpBtn,
    loginUpBtnLock,
    loginUpBtnClick,
  };
};

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  props: {
    message: {
      type: String,
      default: '分享一刻心情',
    },
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    // 隐藏界面
    const closeHandleClick = () => {
      if (route.path === '/login') {
        router.push('/');
      }
      emit('update:modelValue', false);
    };
    // 登录注册页面切换
    const showLogin = ref('loginIn');
    const changeShowLogin = (event, msg) => {
      showLogin.value = msg;
    };
    // 错误警告
    const { warning, showWarningMessage } = useWarningEffect();
    // 登录
    const {
      loginInInfo,
      loginInBtn,
      loginInBtnLock,
      loginInBtnClick,
    } = useLoginInEffect(router, store, showWarningMessage, closeHandleClick);
    // 注册
    const {
      loginUpInfo,
      loginUpBtn,
      loginUpBtnLock,
      loginUpBtnClick,
    } = useLoginUpEffect(showWarningMessage, closeHandleClick);

    return {
      router,
      showLogin,
      changeShowLogin,
      warning,
      showWarningMessage,
      loginInInfo,
      loginUpInfo,
      loginInBtn,
      loginUpBtn,
      loginInBtnLock,
      loginUpBtnLock,
      loginUpBtnClick,
      loginInBtnClick,
      closeHandleClick,
    };
  },
};
</script>
