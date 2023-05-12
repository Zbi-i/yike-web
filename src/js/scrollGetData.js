import { ref, nextTick, reactive } from 'vue';
import { get } from '../utils/axios';

class ScrollGetData {
  momentList(url, warningWrapper) {
    console.log(url);
    const offset = ref(0);
    const size = ref(5);
    const momentList = reactive({});
    const getMomentList = async () => {
      try {
        const res = await get(`${url}?offset=${offset.value}&size=${size.value}`);
        res.forEach((obj) => {
          momentList[obj.id] = obj;
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
      console.log('scroll');
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollPosition >= lastScrollPosition) {
        // 向下滚动
        console.log(window.innerHeight + window.pageYOffset, document.body.offsetHeight - 100);
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100) {
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
    getMomentList();
    return { momentList };
  }
}

export default ScrollGetData;
