<template>
  <template></template>
  <div id="HomePage">
      <nav>
        <ul>
          <li class="active" @click="event => navItemHandleClick(event, 'Moment')">推荐</li>
          <li @click="event => navItemHandleClick(event, 'YikeList')">时刻</li>
        </ul>
      </nav>
      <main ref="momentListDOM">
        <KeepAlive>
          <component :is="currentContent" :loginIsShowFun="loginIsShowFun"/>
        </KeepAlive>
      </main>
    </div>
</template>
<style lang="scss" scoped>
@import '../../style/viriables';
#HomePage{
  width: 100%;
}
main{
  margin-top: .4rem;
  padding-bottom: .4rem;
  width: 100%;
  height: 100%;
}
nav{
  position: fixed;
  top: 0;
  width: $pc-default-width;
  height: .4rem;
  text-align: center;
  background-color: rgba($color: $block-bg-color, $alpha: .8);
  -webkit-backdrop-filter: blur(.08rem);
  backdrop-filter: blur(.08rem);
  z-index: 1;
  ul{
    display: flex;
    justify-content:center;
    align-items: center;
    height: 100%;
    li{
      font-size: .16rem;
      color: $font-color-light;
      padding: .06rem;
      margin: 0 .2rem;
      cursor: pointer;
      &.active{
        color: $font-color-default;
        font-weight: bold;
        border-bottom: .02rem solid $font-color-default;
      }
    }
  }
}
</style>

<script>
import { ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import YikeList from '../yike/YikeList.vue';
import Moment from '../../components/Moment.vue';
import ScrollGetData from '../../js/scrollGetData';
// content标签内容切换
const useNavEffect = () => {
  // comment/yike
  const currentContent = ref('Moment');
  const navItemHandleClick = (event, params) => {
    const { target } = event;
    document.querySelector('nav .active').classList.remove('active');
    target.classList.add('active');
    currentContent.value = params;
  };
  return { currentContent, navItemHandleClick };
};
export default {
  name: 'HomePageContent',
  props: {
    loginIsShowFun: {
      type: Function,
      required: true,
    },
    warningWrapper: {
      type: Function,
      required: true,
    },
  },
  components: {
    Moment,
    YikeList,
  },
  setup(props) {
    const store = useStore();
    const { warningWrapper } = toRefs(props);
    const { currentContent, navItemHandleClick } = useNavEffect();
    // 获取数据
    const GetData = new ScrollGetData();
    const { momentList } = GetData.momentList('moment/list', warningWrapper);
    store.state.momentList = momentList;
    return {
      currentContent,
      navItemHandleClick,
    };
  },
};
</script>
