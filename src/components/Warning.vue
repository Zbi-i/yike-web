<template>
  <div id="warning" ref="warningWrapper" class="hide">
    {{ warningMessage }}
  </div>
</template>

<style lang="scss" scoped>
@import '../style/viriables';
// 警告提示框弹出收起动画
@keyframes warning-in{
  0%{
    opacity: 0;
    transform: translateX(-50%) scale(0);
  }
  50%{
    opacity: 1;
    top: 6%;
    transform: translateX(-50%) scale(1.3);
  }
  100%{
    opacity: 1;
    top: 6%;
    transform: translateX(-50%) scale(1);
  }
}
@keyframes warning-out{
  0%{
    opacity: 1;
    top: 6%;
    transform: translateX(-50%) scale(1);
  }
  100%{
    opacity: 0;
    top: -10%;
    transform: translateX(-50%) scale(0);
  }
}
#warning{
  position: fixed;
  top: 0;
  left: 50%;
  padding: .12rem;
  border-radius: .05rem;
  color: $font-color-reversal;
  background-color: rgba($warning-bg-color, 0.6);
  transform: translate(-50%, -100%);
  opacity: 0;
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
}
#warning.show{
  animation-name: warning-in;
  animation-fill-mode: forwards;
}
#warning.hide{
  animation-name: warning-out;
  animation-fill-mode: forwards;
}
</style>

<script>
import { ref } from 'vue';
// 警告提醒框
const useWarningEffect = () => {
  const warningMessage = ref('');
  const warningWrapper = ref(null);
  let warningLock = false;
  const warningFun = (message) => {
    if (warningLock) return;
    warningLock = true;
    warningMessage.value = message;
    warningWrapper.value.classList.toggle('hide');
    warningWrapper.value.classList.toggle('show');
    setTimeout(() => {
      warningWrapper.value.classList.toggle('hide');
      warningWrapper.value.classList.toggle('show');
      setTimeout(() => {
        warningLock = false;
      }, 300);
    }, 1800);
  };
  return { warningMessage, warningWrapper, warningFun };
};
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Warning',
  expose: ['warningFun'],
  setup() {
    // 警告提醒框
    const {
      warningMessage,
      warningWrapper,
      warningFun,
    } = useWarningEffect();
    return {
      warningMessage,
      warningWrapper,
      warningFun,
    };
  },
};
</script>
