<template>
  <div class="original-picture-wrapper" >
    <transition name="fade">
      <div class="shade" v-show="isShowShade"></div>
    </transition>
    <div class="picture-box" v-show="originalPictureWrapper" @click="pictureZoomOut"
      ref="originalPictureBox">
      <img src="" class="thumbnail" cache-control="max-age=3600"
        v-show="!isShowOriginalPicture"
      />
      <img src="" class="original-picture"
       v-show="isShowOriginalPicture" @load="originalOnload"
      />
      <span v-show="!isShowOriginalPicture" class="on-load iconfont icon-jiazai"></span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../style/viriables';
.original-picture-wrapper{
  .shade{
    position:fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($warning-bg-color, 0.85);
    z-index: 9;
  }
  .picture-box{
    position: fixed;
    max-width: 100%;
    transition-property: all;
    transition-duration: .3s;
    transition-timing-function: ease;
    z-index: 99;
    img{
      width: 100%;
      height: auto;
      transition: all .3s ease;
    }
  }
}
// 加载图标动画
.on-load{
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: .24rem;
  color: $font-color-light;
  animation: rotate 1s linear infinite;
}
@keyframes rotate{
  0%{
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100%{
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
<script>
import { ref } from 'vue';
// 动态配图
const useCommentPictureEffect = () => {
  const originalPictureWrapper = ref(false);
  const isShowOriginalPicture = ref(false);
  const isShowShade = ref(false);
  const originalPictureBox = ref(null);
  const originalOnload = () => {
    console.log('加载完成');
    isShowOriginalPicture.value = true;
  };
  let pictureTarget;
  const pictureZoomIn = (event) => {
    // 显示遮罩层
    originalPictureWrapper.value = !originalPictureWrapper.value;
    isShowShade.value = !isShowShade.value;
    isShowOriginalPicture.value = false;
    // 点击图片，加载高清大图
    const { target } = event;
    pictureTarget = target;
    const smallPictureRect = target.getBoundingClientRect();
    originalPictureBox.value.style.cssText = `
      top: ${smallPictureRect.top / 100}rem;
      left: ${smallPictureRect.left / 100}rem;
      width: ${smallPictureRect.width / 100}rem;
      height: ${smallPictureRect.height / 100}rem;
      opacity: 0;
    `;
    const windowWidth = document.getElementById('momentWrapper').offsetWidth;
    setTimeout(() => {
      originalPictureBox.value.style.cssText = `
      top: 50%;
      left: 50%;
      width: ${windowWidth / 100}rem;
      height: auto;
      transform: translate(-50%, -50%);
      opacity: 1;
    `;
    }, 50);

    // 先显示缩略图，再显示高清大图
    originalPictureBox.value.childNodes[0].src = target.src;
    // 替换字符串中的middle为master
    const originalPictureSrc = target.src.replace(/middle/, 'master');
    originalPictureBox.value.childNodes[1].src = originalPictureSrc;
  };
  let pictureLock = false;
  const pictureZoomOut = () => {
    if (pictureLock) return;
    pictureLock = true;
    isShowShade.value = !isShowShade.value;
    const smallPictureRect = pictureTarget.getBoundingClientRect();
    originalPictureBox.value.style.cssText = `
      top: ${smallPictureRect.top / 100}rem;
      left: ${smallPictureRect.left / 100}rem;
      width: ${smallPictureRect.width / 100}rem;
      height: ${smallPictureRect.height / 100}rem;
      opacity: 0;
    `;
    setTimeout(() => {
      pictureLock = false;
      originalPictureWrapper.value = !originalPictureWrapper.value;
    }, 300);
  };
  return {
    pictureZoomIn,
    pictureZoomOut,
    originalPictureWrapper,
    originalPictureBox,
    originalOnload,
    isShowOriginalPicture,
    isShowShade,
  };
};
export default {
  name: 'ViewTheImage',
  setup() {
    // 图片点击展示大图
    const {
      pictureZoomIn,
      pictureZoomOut,
      originalPictureWrapper,
      originalPictureBox,
      originalOnload,
      isShowOriginalPicture,
      isShowShade,
    } = useCommentPictureEffect();
    return {
      pictureZoomIn,
      pictureZoomOut,
      originalPictureWrapper,
      originalPictureBox,
      originalOnload,
      isShowOriginalPicture,
      isShowShade,
    };
  },
};
</script>
