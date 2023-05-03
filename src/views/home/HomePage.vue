<template>
  <main>
    <header>
      <h1>一刻心情</h1>
    </header>
    <Comment :loginIsShowFun="loginIsShowFun"/>
    <Docker :loginIsShowFun="loginIsShowFun"/>
    <login v-show="loginIsShow" v-model="loginIsShow" :message="message" />
  </main>
</template>

<style lang="scss" scoped>
@import '../../style/viriables';
header{
  width: 100%;
  text-align: center;
  padding: .12rem 0;
  height: .26rem;
  background-color: rgba($color: $block-bg-color, $alpha: .4);
  h1{
    font-size: .18rem;
  }
}
main{
  position: absolute;
  width: 3.9rem;
  top: 0;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  overflow: hidden;
  background-color: $bg-color-default;
}
</style>

<script>
import { ref } from 'vue';
import Comment from '../../components/Comment.vue';
import Docker from '../../components/Docker.vue';
import Login from '../login/Login.vue';

// 登录
const useLoginEffect = () => {
  const loginIsShow = ref(false);
  const message = ref('');
  const loginIsShowFun = (value) => {
    if (value) message.value = value;
    loginIsShow.value = !loginIsShow.value;
  };
  return {
    loginIsShow, message, loginIsShowFun,
  };
};

export default {
  name: 'HomePage',
  components: { Comment, Docker, Login },
  setup() {
    const { loginIsShow, message, loginIsShowFun } = useLoginEffect();
    return {
      Comment,
      Docker,
      Login,
      loginIsShow,
      message,
      loginIsShowFun,
    };
  },
};

</script>
