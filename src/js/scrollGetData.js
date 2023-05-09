import { ref, nextTick } from 'vue';
import { get } from '../utils/axios';

const useGetMomentListEffect = (store, url, warningWrapper) => {
  const offset = ref(0);
  const size = ref(5);
  const momentListDOM = ref(null);
  const getMomentList = async () => {
    try {
      const res = await get(`${url}?offset=${offset.value}&size=${size.value}`);
      res.forEach((obj) => {
        store.state.momentList[obj.id] = obj;
      });
      if (res.length < 1) {
        warningWrapper.value.warningFun('没有更多数据了...');
        return;
      }
      offset.value += 5;
      size.value += 5;
    } catch (err) {
      warningWrapper.value.warningFun('请求数据发生错了，请检查您的网络...');
    }
  };
  // 滚动条防抖函数
  function debounceScroll(callback, delay) {
    let timer;
    return function (...args) {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback.apply(context, args);
      }, delay);
    };
  }
  let lastScrollPosition = 0;
  const pageOnscrollEvent = async () => {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollPosition > lastScrollPosition) {
      // 向下滚动
      if (window.innerHeight + window.pageYOffset >= document.getElementsByTagName('main')[0].offsetHeight - 50) {
        await getMomentList();
      }
    } else {
      // 向上滚动
    }
    lastScrollPosition = currentScrollPosition;
  };
  nextTick(() => {
    window.onscroll = debounceScroll(pageOnscrollEvent, 500);
  });
  return { getMomentList, momentListDOM };
};

export { useGetMomentListEffect };
