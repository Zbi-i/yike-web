<template>
  <div class="docker-wrapper">
    <ul class="docker">
      <li class="home active">
        <span>首页</span>
      </li>
      <div class="create" @click="createMomentHandleClikc">
        <span class="iconfont icon-tianjia"></span>
      </div>
      <li class="message">
        <span>消息<span class="message-remind" v-show="true"></span></span>
      </li>
      <li class="my">
        <span>我的</span>
        <div class="my-info">
          <div>
            <img src=""/>
          </div>
          <div></div>
        </div>
      </li>
    </ul>
  </div>
  <div class="create-moment-wrapper" v-show="createMomentIsShow">
      <!-- 顶部 -->
      <div class="bar">
        <span class="go-back iconfont icon-back"
              @click="createMomentHandleClikc"
        ></span>
        <button :class="{barBtn:true, Lock: submitIsLock}" @click="handleSubmit">发表</button>
      </div>
      <!-- 动态内容 -->
      <div class="moment-text">
        <span ref="textareaPropUp"></span>
        <textarea
          @input="(event) => textareaInput(event)"
          @focus="(event) => textareaFocus(event)"
          placeholder="这一刻的想法..."
          v-model="textareaDOM"
        ></textarea>
      </div>
      <!-- 动态配图 -->
      <div class="picture-list">
        <div class="picture" v-for="file in rawFiles" :key="file.lastModified" :id="file.id"
             ref="pictureList">
          <img :src="file.filePath" draggable="false"
               @load="event => makeDraggable(event, file.id)">
        </div>
        <div class="add-picture iconfont icon-jiahao_o"
             @click="(event) => handleClick(event)"
             v-show="Object.keys(rawFiles).length < 9">
          <input type="file" name="picture" id="picture" multiple="multiple"
                 ref="fileInput"
                 @change="(event) => handleChange(event)">
        </div>
      </div>
      <!-- 动态配图回收站 -->
      <div class="picture-remove" ref="pictureRecycleBin" v-show="isShowPictureRecycleBin">
        <span :class="{iconfont:true, 'icon-icon':true}"></span>
        <!-- 回收站提示词 -->
        <p>{{ isTouchRecycleBin ? '松手即可删除' : '拖动到此处删除' }}</p>
      </div>
      <!-- 标签 -->
      <div class="lable" id="lable">
        <div class="moment-lables">
          <p>
            <span v-show="JSON.stringify(momentLables) === '{}'">点击下方标签添加内容</span>
            <span v-for="lable in momentLables" :key="lable.name">
              #{{ lable.name }}
            </span>
          </p>
        </div>
        <ul class="lable-list"
            @mousedown="(event) => handleMousedown(event)"
            @mouseup="(event) => handlemouseup(event)"
            @mouseLeave="(event) => handlemouseup(event)"
            @touchstart="(event) => handleMousedown(event)"
            @touchmove="(event) => handlemousemove(event)"
            ref="dragLable"
            style="left:0;">
          <span
            v-for="lable in lableList"
            :key="lable.id"
            :id="'lable-' + lable.id"
            @click="(event) => lableHandleClick(event, lable.lable_name)">
            {{ lable.lable_name }}
          </span>
        </ul>
        <div class="custom-lable" id="custom-lable">
          <span @click="customLableHandleClick">+ 自定义标签</span>
          <span
            v-for="customLable in customLables"
            :key="customLable"
            @click="(event) => lableHandleClick(event, customLable)"
          >{{ customLable }}</span>
        </div>
      </div>
      <!-- 添加标签 -->
      <div class="create-lable-page" v-show="customLableIsShow">
        <div class="bar">
          <span class="go-back iconfont icon-back" @click="customLableHandleClick()"></span>
          <button class="bar-btn"
          @click="createLableHandleClick">添加</button>
        </div>
        <input type="text" name="lable" ref="customInput" placeholder="输入你的标签"
               @input="customHandleInput"/>
        <p>
          <span >{{ markedWords }}</span>
        </p>
        <span class="customInputLable"
              @click="createLableHandleClick"
              v-show="customInputLableIsShow"
              ref="customInputLable"></span>
      </div>
      <!-- 可见范围 -->
      <div class="Visible-range-wrapper">
        <span>
          <span class="iconfont icon-yonghu"></span>谁可以看
        </span>
        <span class="Visible-range">
          公开<span class="iconfont icon-icon_jiantou-you"></span>
        </span>
      </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../style/viriables';
.bar{
  position: relative;
  width: 100%;
  padding: .24rem 0;
  box-sizing: border-box;
  .go-back{
    font-size: .18rem;
    font-weight: bold;
  }
  &Btn{
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    padding: .06rem .15rem;
    border-radius: .04rem;
    font-size: .16rem;
    color: $font-color-reversal;
    background-color: $button-activate-bg-color;
  }
  &Btn.Lock{
    background-color: $button-bg-color;
  }
}
.docker-wrapper{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 3.9rem;
  height: .4rem;
  line-height: .4rem;
  text-align: center;
  font-size: .16rem;
  font-weight: bold;
  background-color: $block-bg-color;
  box-sizing: border-box;
  .docker{
    display: flex;
    height: .4rem;
    li:first-child{
      flex: 2;
    }
    li{
      height: .4rem;
      flex: 1;
      span {
        cursor: pointer;
      }
    }
    .create{
      span{
        cursor: pointer;
        font-size: .24rem;
      }
    }
    li.active{
      color: $font-color-active;
    }
  }
}
.create-moment-wrapper{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0 .24rem;
  background-color: $bg-color-default;
  overflow: scroll;
  .moment-text{
    position: relative;
    width: 100%;
    min-height: .5rem;
    margin-bottom: .24rem;
    span, textarea{
      font-size: .16rem;
      line-height: .24rem;
    }
    span{
      display: block;
      height: 100%;
      white-space: pre-wrap;
      word-wrap: break-word;
      visibility: hidden;
    }
    textarea{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      resize: none;
    }
  }
  .picture-list{
    display: flex;
    flex-wrap: wrap;
    /*  两边盒子贴边,中间平分剩余空间(*常用*) */
    justify-content: start;
    margin-bottom: .12rem;
    div{
      width: 1.1rem;
      height: 1.1rem;
      margin-bottom: .06rem;
      margin-right: .06rem;
    }
    div:nth-of-type(3n+3){
      margin-right: 0;
    }
    .picture{
      position: relative;
      img{
        position: absolute;
        width: 100%;
        height: 100%;
        transition: all .05s ease;
      }
      img.pitchOn{
        width: 110%;
        height: 110%;
        z-index: 9;
      }

    }
    .add-picture{
      line-height: 1.1rem;
      text-align: center;
      font-size: .56rem;
      color: $font-color-light;
      background-color: $block-bg-color;
      input{
        display: none;
      }
    }
  }
  .picture-remove{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: .5rem;
    background-color: rgba($color: $color-warning, $alpha: .8);
    color: $font-color-reversal;
    text-align: center;
    z-index: 99;
    .iconfont{
      display: inline-block;
      margin-top: .08rem;
      font-size: .18rem;
    }
    p{
      font-size: .12rem;
    }
  }
  .lable{
    position: relative;
    width: 100%;
    min-height: 1.7rem;
    user-select: none;
    overflow: hidden;
    margin-bottom: .48rem;
    .moment-lables{
      min-height: 0.3rem;
      margin-bottom: .08rem;
    }
    &-list{
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      width: 8rem;
      height: 1rem;
      span{
        display: inline-block;
        padding: .06rem .08rem;
        margin: 0 .12rem .12rem 0;
        border:solid .01rem $font-color-light;
        border-radius: .03rem;
        height: .2rem;
      }
    }
    .custom-lable{
      height: .3rem;
      > span{
        padding: .06rem .08rem;
        border-radius: .03rem;
        border:solid .01rem $font-color-light;
        margin-right: .08rem;
      }
    }
    .click{
      border-color:$font-color-reversal !important;
      background-color: $button-activate-bg-color;
      color: $font-color-reversal;
    }
  }
  .Visible-range-wrapper{
    position: relative;
    height: .24rem;
    line-height: .24rem;
    padding: .08rem 0;
    margin-bottom: .24rem;
    border: solid .01rem $splitline-color;
    border-left: none;
    border-right: none;
    font-size: .16rem;
    .icon-yonghu{
      margin-right: .12rem;
      font-size: .18rem;
    }

    .Visible-range{
      display: inline-block;
      float: right;
      color: $font-color-light;
      .icon-icon_jiantou-you{
        color: $font-color-light;
      }
    }
  }
}
.create-moment-wrapper::-webkit-scrollbar {
  display:none
}
.create-lable-page{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: $bg-color-default;
  z-index: 3;
  padding: 0 .24rem ;
  input{
    width: 100%;
    height: .4rem;
    line-height: .4rem;
    margin-bottom: .08rem;
    font-size: .18rem;
    border-bottom:solid .01rem $splitline-color;
  }
  input::-webkit-input-placeholder{
    color: rgba($color: $font-color-light, $alpha: .5) ;
  }
  p > span{
    font-size: .12rem;
    color: $font-color-light;
  }
  .customInputLable{
    display: inline-block;
    padding: .06rem .08rem;
    border-radius: .03rem;
    border:solid .01rem $font-color-light;
  }
}
</style>

<script>
import {
  computed, toRefs, reactive, ref,
} from 'vue';
import { useStore } from 'vuex';
import { useCommentFromFunEffect, isMobile } from '../js/tools';
import { get, post } from '../utils/axios';
import Storage from '../module/storage';

// 发表动态/返回
const useBarEffect = (rawFiles, momentLables, loginIsShowFun, submitMomentCallback) => {
  const textareaDOM = ref('');
  const createMomentIsShow = ref(false);
  const createMomentHandleClikc = () => {
    const isLogin = Storage.get('isLogin');
    if (JSON.parse(isLogin)) {
      createMomentIsShow.value = !createMomentIsShow.value;
    } else {
      loginIsShowFun.value('发表动态');
    }
  };
  const submitIsLock = computed(() => {
    const pictureCount = Reflect.ownKeys(rawFiles).length;
    const content = textareaDOM.value;
    const lock = !(content !== '' || pictureCount > 0);
    return lock;
  });
  const handleSubmit = () => {
    if (submitIsLock.value) return;
    const content = textareaDOM.value || '';
    const formData = new FormData();
    formData.append('content', content);
    const lables = [];
    Object.keys(momentLables).forEach((key) => {
      lables.push(key);
    });
    formData.append('lables', JSON.stringify(lables));
    Object.values(rawFiles).forEach((rawfile) => {
      formData.append('picture', rawfile.file, `${rawfile.id}`);
    });
    post('moment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(async (response) => {
      // vuex
      textareaDOM.value = '';
      await submitMomentCallback(response.momentId);
      createMomentHandleClikc();
    }).catch((error) => {
      console.log(error);
    });
  };
  return {
    createMomentIsShow, createMomentHandleClikc, handleSubmit, textareaDOM, submitIsLock,
  };
};
// 图片上传预览
const useUploadEffect = () => {
  const fileInput = ref(null);
  const rawFiles = reactive({});
  const maxFile = 9;
  const handleClick = () => {
    fileInput.value.value = null;
    fileInput.value.click();
  };
  const handleChange = function (event) {
    const { files } = event.target;
    if (files.length + Object.keys(rawFiles).length <= maxFile) {
      Object.keys(files).forEach((key) => {
        const filePath = URL.createObjectURL(files[key]);
        const rawfile = {};
        rawfile.id = Date.now() + files[key].name;
        rawfile.file = files[key];
        rawfile.filePath = filePath;
        rawFiles[rawfile.id] = rawfile;
      });
    } else {
      alert(`您最多再选择${maxFile - Object.keys(rawFiles).length}个文件~`);
    }
  };
  // 回收站
  const pictureRecycleBin = ref(null);
  // 回收站是否显示
  const isShowPictureRecycleBin = ref(false);
  // 是否碰到回收站
  const isTouchRecycleBin = ref(false);
  // 图片列表
  const pictureList = ref(null);

  // pc端拖动删除图片
  function makeDraggable(imgEvent, pictureId) {
    const { target } = imgEvent;
    let startX;
    let startY;
    let offsetX;
    let offsetY;
    function moveImage(event) {
      const x = event.clientX - startX;
      const y = event.clientY - startY;
      target.style.transform = `translate(${x / 100}rem, ${y / 100}rem)`;

      const rect = pictureRecycleBin.value.getBoundingClientRect();

      const deltaX = event.clientX + offsetX;
      const deltaY = event.clientY + offsetY;
      if (deltaX >= rect.left && deltaX <= rect.right
          && deltaY >= rect.top && deltaY <= rect.bottom) {
        isTouchRecycleBin.value = true;
      } else {
        isTouchRecycleBin.value = false;
      }
    }

    function mouseUpImage(event) {
      isShowPictureRecycleBin.value = false;
      const rect = pictureRecycleBin.value.getBoundingClientRect();
      const deltaX = event.clientX + offsetX;
      const deltaY = event.clientY + offsetY;
      if (deltaX >= rect.left && deltaX <= rect.right
          && deltaY >= rect.top && deltaY <= rect.bottom) {
        delete rawFiles[pictureId];
      } else {
        target.style.transform = 'translate(0rem, 0rem)';
      }
      target.classList.remove('pitchOn');
      document.removeEventListener('mousemove', moveImage);
      document.removeEventListener('mouseup', mouseUpImage);
    }
    target.addEventListener('mousedown', (event) => {
      isShowPictureRecycleBin.value = true;
      const rect = event.target.getBoundingClientRect();
      // 按下位置的x，y坐标
      startX = event.clientX;
      startY = event.clientY;
      // 按下放大了1.1倍的图片的x，y坐标
      offsetX = rect.width * 1.1 - event.offsetX;
      offsetY = rect.height * 1.1 - event.offsetY;
      target.classList.add('pitchOn');
      document.addEventListener('mousemove', moveImage);
      document.addEventListener('mouseup', mouseUpImage);
    });
  }

  // 移动端拖动删除图片
  // 判断是pc端还是移动端

  return {
    fileInput,
    rawFiles,
    handleClick,
    handleChange,
    isShowPictureRecycleBin,
    isTouchRecycleBin,
    pictureList,
    pictureRecycleBin,
    makeDraggable,
  };
};

// 添加标签
const useLableEffect = () => {
  const data = reactive({
    lableList: {},
    momentLables: {},
    customLables: {},
  });
  const customLableIsShow = ref(false);
  const customInput = ref(null);
  const offset = ref(0);
  const size = ref(15);

  const getLableList = () => {
    get(`lable?offset=${offset.value}&limit=${size.value}`)
      .then((res) => {
        res.forEach((item) => {
          data.lableList[item.id] = item;
        });
        offset.value += 10;
        size.value += 10;
      });
  };
  getLableList(0, 5);

  const lableHandleClick = (event, id) => {
    event.stopPropagation();

    const newEvent = event?.target || event;
    newEvent.classList.toggle('click');
    if (data.momentLables[id]) {
      delete data.momentLables[id];
      return;
    }
    data.momentLables[id] = { name: newEvent.innerText };
  };
  // 标签列表拖动
  const lableListDragFun = () => {
    const dragLable = ref(null);
    let diffWidth;
    let diffFatherWidth;
    let diffX;
    const handlemousemove = (event) => {
      const moveX = event.offsetX + dragLable.value.offsetLeft - diffX;
      // console.log(moveX, diffWidth - diffFatherWidth);
      if (moveX < -(diffWidth - diffFatherWidth) || moveX > 0) return;
      dragLable.value.style.left = `${moveX}px`;
    };
    const handlemouseup = () => {
      document.removeEventListener('mousemove', handlemousemove);
      document.removeEventListener('mouseup', handlemouseup);
    };
    const handleMousedown = (event) => {
      diffX = event.offsetX;
      diffWidth = dragLable.value.clientWidth;
      diffFatherWidth = document.getElementById('lable').clientWidth;
      document.addEventListener('mousemove', handlemousemove);
      document.addEventListener('mouseup', handlemouseup);
    };

    return {
      dragLable, handleMousedown, handlemousemove, handlemouseup,
    };
  };
  // 自定义标签
  const customInputLable = ref(null);
  const customInputLableIsShow = ref(false);
  const markedWords = ref('自定义标签最多八个字');
  const customLableHandleClick = () => {
    customLableIsShow.value = !customLableIsShow.value;
  };
  const customHandleInput = (event) => {
    if (event.target.value !== '') {
      markedWords.value = '点击添加标签';
    } else {
      markedWords.value = '自定义标签最多八个字';
    }
    customInputLable.value.innerText = event.target.value;
    customInputLableIsShow.value = event.target.value !== '';
  };
  const createLableHandleClick = () => {
    const labelName = customInput.value.value;
    if (!labelName || labelName === '') return;
    post('lable', { name: labelName }).then((res) => {
      // 如果标签库里面没有
      console.log(res);
      if (res.affectedRows > 0) {
        data.customLables[labelName] = labelName;
      } else {
        // 说明标签已存在
        data.lableList[res.id] = res;
        lableHandleClick(document.getElementById(`lable-${res.id}`), res.lable_name);
      }
    }).catch((err) => {
      console.log(err);
    });
    customLableHandleClick();
  };
  const customGoBack = () => {
    customLableHandleClick();
  };
  const {
    dragLable, handleMousedown, handlemousemove, handlemouseup,
  } = lableListDragFun();
  const { lableList, momentLables, customLables } = data;
  return {
    dragLable,
    handleMousedown,
    handlemousemove,
    handlemouseup,
    lableList,
    getLableList,
    momentLables,
    lableHandleClick,
    customLableHandleClick,
    customLableIsShow,
    customInput,
    createLableHandleClick,
    customInputLable,
    markedWords,
    customLables,
    customGoBack,
    customHandleInput,
    customInputLableIsShow,
  };
};

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Docker',
  props: {
    loginIsShowFun: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { loginIsShowFun } = toRefs(props);
    const store = useStore();
    // 图片上传
    const {
      fileInput,
      rawFiles,
      handleClick,
      handleChange,
      isShowPictureRecycleBin,
      isTouchRecycleBin,
      pictureList,
      pictureRecycleBin,
      makeDraggable,
    } = useUploadEffect();
    // 标签
    const {
      lableList, getLableList,
      dragLable,
      momentLables,
      lableHandleClick,
      handleMousedown, handlemousemove, handlemouseup,
      customLableHandleClick,
      customLableIsShow,
      customInput,
      createLableHandleClick,
      customInputLable,
      markedWords,
      customLables,
      customGoBack,
      customHandleInput,
      customInputLableIsShow,
    } = useLableEffect();
    // 输入动态
    const {
      textareaInput, textareaFocus, textareaPropUp,
    } = useCommentFromFunEffect();
    // 发表动态
    const submitMomentCallback = async (momentId) => {
      momentLables.value = {};
      rawFiles.value = {};
      const moment = await get(`moment/${momentId}`);
      store.state.momentList[moment.id] = moment;
    };
    const {
      createMomentIsShow,
      createMomentHandleClikc,
      handleSubmit,
      textareaDOM,
      submitIsLock,
    } = useBarEffect(rawFiles, momentLables, loginIsShowFun, submitMomentCallback);
    return {
      createMomentIsShow,
      handleSubmit,
      textareaDOM,
      submitIsLock,
      createMomentHandleClikc,
      dragLable,
      fileInput,
      rawFiles,
      lableList,
      getLableList,
      momentLables,
      lableHandleClick,
      handleMousedown,
      handlemousemove,
      handlemouseup,
      customLableHandleClick,
      customLableIsShow,
      customInput,
      handleClick,
      handleChange,
      isShowPictureRecycleBin,
      isTouchRecycleBin,
      pictureList,
      pictureRecycleBin,
      makeDraggable,
      textareaInput,
      textareaFocus,
      textareaPropUp,
      createLableHandleClick,
      customInputLable,
      markedWords,
      customLables,
      customGoBack,
      customHandleInput,
      customInputLableIsShow,
    };
  },
};
</script>
