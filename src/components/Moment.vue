<template>
<div ref="commentFormWarpper" style="display: none;">
  <form action="" method="post" ref="commentForm">
    <div class="create_comment">
      <div class="create_comment_content">
        <span ref="textareaPropUp"></span>
        <textarea
          type="tel" name="create_comment_content"
          @input="(event) => textareaInput(event)"
          @focus="(event) => textareaFocus(event)"
          ref="commentTextaea"
          placeholder="评论"
          maxlength="180"
        ></textarea>
      </div>
      <div>
        <div class="emoji_content_wrapper">
          <ul class="emoji_content">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <ul class="emoji_nav"></ul>
      </div>
      <div class="create_comment_fun_wrapper">
        <div class="create_comment_fun">
          <span class="iconfont icon-biaoqing"></span>
          <input
            type="button" name="submit" value="发送" :class="{CC_send: true, unlock: sendUnlock}"
            @click="CCSendHandleClick">
        </div>
      </div>
    </div>
  </form>
</div>
<div class="moment_list" id="momentWrapper">
  <div
    class="moment"
    v-for="(moment, index) in Object.values(momentList).reverse()"
    :key="moment.user.id"
    :id="'moment-'+ moment.id"
  >
    <div class="user">
      <div class="user_avatar">
        <!-- 如果用户没有上传头像，那么使用默认的头像 -->
        <img :src="moment.user.avvtar ? moment.user.avvtar : defaultAvatar" alt="头像">
      </div>
      <div>
        <div class="user_name">{{ moment.user.name }}</div>
        <div class="create_time">{{ howLongAgo(moment.createAt) }}</div>
      </div>
    </div>
    <div class="moment_info">
      <div class="moment_content">
        {{ moment.content }}
      </div>
      <!-- 动态配图 -->
      <div :class="
              {
                moment_picture_wrapper:true,
                gap1: moment.picture.length === 1,
                gap2: moment.picture.length === 2 || moment.picture.length === 4,
                gap3: moment.picture.length % 3 === 0 || moment.picture.length > 4,
              }"
        v-if="moment.picture">
        <div class="moment_picture" v-for="picture in moment.picture" :key="picture.picturePath"
        @click="(event) => ViewTheImageWrapper.pictureZoomIn(event, moment.id, picture.id)">
          <img class="moment_picture_img"
               :src="`${APP_HOST}moment/picture/middle/${picture.picturePath}`"/>
        </div>
      </div>
    </div>
    <div class="operate_wrapper">
      <!-- 动态标签 -->
      <div class="lables" v-if="moment.lables">
        <label class="lable"
          v-for="lable in moment.lables"
          :key="lable"
        >
          #{{ lable }}
        </label>
      </div>
      <!-- 操作：点赞、评论 -->
      <div class="operate">
        <span :class="[
                'iconfont',
                'likes_icon',
                handleLikeItOrNot(moment.likeUsers).value
                ?
                'icon-cpxihuan' : 'icon-xihuan-xianxing'
               ]"
              @click="likeHandleClick(moment.id, index)"></span>
        <span
          class="iconfont icon-pinglun comment_icon"
          :data-index="moment.id"
          @click="() => commentIconClick(moment.id)"
        ></span>
      </div>
    </div>
    <!-- 喜欢了该动态的用户 -->
    <div class="likes_users" v-show="JSON.stringify(moment.likeUsers) !== '{}'">
      <a class="iconfont icon-xihuan-xianxing likes_icon"></a>
      <span>
        <a class="likes_user_name" v-for="user in moment.likeUsers" :key="user.id">
          {{ user.username }}
        </a>
      </span>
      <span class="likes_count">
        等{{ Object.keys(moment.likeUsers)?.length }}人赞了
      </span>
    </div>
    <!-- 动态的评论 -->
    <div :class="{comment:true, show: Object.keys(moment.comments).length > 0}">
      <ul :id="'moment-comment-mark-'+ moment.id">
        <li
          v-for="commentInfo in moment.comments"
          :key="commentInfo"
          :id="'comment-mark-'+ commentInfo.commentId"
          @click="() => commentIconClick(moment.id, commentInfo)"
        >
          <a class="comment_name">
            {{ commentInfo.user.username }}
          </a>
          <span
            v-if="
              commentInfo.replyComment &&
              commentInfo.replyComment?.userid !== moment.user.id"
            >
            {{ commentInfo.replyComment?.userid }}
            回复<a>{{ commentInfo.replyComment.username }}</a>
          </span>
          <span class="comment_content">
            :{{ commentInfo.content }}
          </span>
        </li>
        <!-- 展开评论 -->
        <!-- <div class="unfold_commont">
          <div class="transverse_line"></div>
          展开{{ moment.commentCount }}条评论<span class="iconfont icon-31xiala"></span>
        </div> -->
      </ul>
    </div>
  </div>
</div>
<ViewTheImage ref="ViewTheImageWrapper"/>
</template>
<style lang="scss" scoped>
@import '../style/viriables';
.moment_list{
  padding: .24rem;
  background-color: $bg-color-default;
}
.moment{
  width: 100%;
  min-height: 1.6rem;
  margin-bottom: .24rem;
  box-sizing: border-box;
  transition: all .3s ease;
  &_content{
    font-size: .16rem;
    line-height: .24rem;
  }
  .user{
    width: 100%;
    height: .4rem;
    &_avatar{
      width: .4rem;
      height: 100%;
      margin-right: .06rem;
      border-radius: 50%;
      overflow: hidden;
      float: left;
      img{
        width: 100%;
      }
    }
    &_name{
      font-size: .16rem;
      font-weight: bold;
      // color: $font-color-light;
    }
    .create_time{
      font-size: .12rem;
      color: $font-color-light;
    }
  }
  &_info{
    width: 100%;
    margin: .08rem 0;
    .moment_content{
      margin-bottom: .06rem;
    }
    .moment_picture_wrapper{
      .moment_picture{
        position: relative;
        padding-top: 100%;
        width: 100%;
        height: 0;
        cursor: zoom-in;
        @keyframes pictureIsScale{
          0%{
            width: 0%;
          }
          100%{
            width: 100%;
          }
        }
        img{
          position: absolute;
          left: 0;
          top: 0;
          // 图片尺寸
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 50%;
        }
        img.hidden{
          display: none;
        }
      }
    }
    .moment_picture_wrapper.gap1{
      display: block;
      width: calc(100% * 5 / 8);
    }
    .moment_picture_wrapper.gap2{
      display: grid;
      width: calc(100% * 2 / 3);
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto;
      gap: .04rem;
    }
    .moment_picture_wrapper.gap3{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto;
      gap: .04rem;
    }
  }
  .operate_wrapper{
    display: flex;
    height: .18rem;
    line-height: .18rem;
    padding-bottom: .06rem;
    margin-bottom: .06rem;
    .lables{
      flex: 2;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: .12rem;
      .lable{
        display: inline-block;
        margin-right: .06rem;
      }
    }
    .operate{
      flex: 1;
      text-align: right;
      .likes_icon{
        margin-right: .16rem;
      }
      .likes_icon.icon-cpxihuan{
        color: $like-color;
      }
      .likes_icon, .comment_icon{
        font-size: .2rem;
        width: .2rem;
        height: .2rem;
        cursor: pointer;
        // font-weight: 600;
      }
    }
  }
  .likes_users{
    padding: .04rem .12rem;
    background-color: $block-bg-color;
    border-radius: .05rem .05rem 0 0 ;
    .likes_user_name:after {
      content: "、";
      color: $font-color-default;
    }
    .likes_user_name:last-child:after {
      content: "";
    }
  }
  .comment{
    display: none;
    position: relative;
    padding: .04rem .12rem;
    border-top: solid .01rem $splitline-color;
    background-color: $block-bg-color;
    border-radius: 0 0 .05rem .05rem;
    li{
      width: 100%;
      line-height: .22rem;
    }
    .unfold_commont{
      height: .24rem;
      line-height: .24rem;
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: .12rem;
      color: $font-color-light;
      .transverse_line{
        position: absolute;
        left: -.15rem;
        top: .125rem;
        width: .12rem;
        height: .01rem;
        background-color: $font-color-light;
      }
      .icon-31xiala{
        font-weight: bold;
        font-size: .12rem;
        margin-left: .02rem;
      }
    }
  }
  .comment.show{
    display: block;
  }
  &.commentForm > .comment{
    display: block;
  }
}
.create_comment{
  display: flex;
  position: relative;
  width: 100%;
  min-height: .24rem;
  line-height: .24rem;
  transition: all .3s ease;
  &_content{
    flex: 1;
    position: relative;
    background-color:$bg-color-default;
    border-radius: .04rem;
    overflow: hidden;
    transition: all .3s ease;
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
      line-height: .24rem;
      padding: 0;
      resize: none;
      outline: none;
    }
    textarea::-webkit-scrollbar{
      display: none;
    }
    span, textarea{
      font-size: .16rem;
    }
  }
  .create_comment_fun_wrapper{
    width: .98rem;
    position: relative;
    transition: all .3s ease;
    .create_comment_fun{
      position: absolute;
      bottom: 0;
      left: 0;
      height: .24rem;
      .icon-biaoqing, .CC_send{
        cursor: pointer;
      }
      .icon-biaoqing{
        font-size: .22rem;
        font-weight: bold;
        margin: 0 .08rem;
        vertical-align: -0.02rem;
      }
      .CC_send{
        font-size: .16rem;
        width: .56rem;
        height: .24rem;
        border-radius: .03rem;
        box-sizing: content-box;
        background-color: rgba($font-color-light, $alpha: .2);
      }
      .CC_send.unlock{
        color: $font-color-reversal;
        background-color: $button-activate-bg-color;
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,.fade-leave-to {
  opacity: 0;
}
</style>

<script>
import {
  ref,
  computed,
  toRefs,
} from 'vue';
import { useStore } from 'vuex';
import { post } from '../utils/axios';
import { insertAfter, useCommentFromFunEffect } from '../js/tools';
import defaultAvatar from '../images/default_avatar.jpg';
import Storage from '../module/storage';

import ViewTheImage from './ViewTheImage.vue';

// 点赞
const useLikeEffect = (userInfo, momentList, loginIsShowFun) => {
  const likeHandleClick = async (momentId) => {
    const likeUser = momentList.value[momentId].likeUsers;
    if (!JSON.parse(Storage.get('isLogin'))) {
      loginIsShowFun.value('点赞');
      return;
    }
    try {
      const res = await post('like', { momentId });
      if (res) {
        likeUser[userInfo.value.id] = { ...userInfo.value };
      } else {
        delete likeUser[userInfo.value.id];
      }
    } catch (err) {
      loginIsShowFun.value('点赞');
    }
  };
  const handleLikeItOrNot = (likeUserList) => computed(() => !!likeUserList?.[userInfo.value?.id]);
  return { userInfo, likeHandleClick, handleLikeItOrNot };
};
// 评论
const useCommentEffect = (userInfo, momentList, loginIsShowFun) => {
  let currentCommentId;
  let currentMomentId;
  const commentFromIsShow = ref(false);
  const commentFormWarpper = ref(null);
  const commentTextaea = ref(null);
  const commentForm = ref(null);

  const commentIconClick = (momentId, commentInfo) => {
    if (!momentId || !userInfo?.value?.id) {
      console.log(loginIsShowFun);
      loginIsShowFun.value('评论');
      return;
    }

    const commentFrom = document.querySelector('.commentForm');
    const momentContainer = document.getElementById(`moment-${momentId}`);
    momentContainer.classList.add('commentForm');
    commentFrom?.classList.remove('commentForm');

    const { commentId, user } = commentInfo || {};
    const commentWrapper = document.getElementById(`moment-comment-mark-${momentId}`);
    const isCommentFormShown = commentFromIsShow.value
                              && currentCommentId === commentId
                              && momentId === currentMomentId;

    if (isCommentFormShown) {
      commentFormWarpper.value.appendChild(commentForm.value);
      commentFromIsShow.value = false;
      currentCommentId = null;
    } else {
      const commentPlaceholder = commentId ? `回复@${user.username}：` : '善语结善缘，恶语伤人心';
      const commentPosition = commentId ? document.getElementById(`comment-mark-${commentId}`) : commentWrapper.childNodes[0];
      insertAfter(commentForm.value, commentPosition);
      commentTextaea.value.placeholder = commentPlaceholder;
      commentFromIsShow.value = true;
    }

    currentCommentId = commentId;
    currentMomentId = momentId;
    commentTextaea.value.focus();
  };
  // 发表评论
  const CCSendHandleClick = () => {
    const content = commentTextaea.value?.value?.trim();
    if (!content) return;
    const reply = currentCommentId ? '/reply' : '';
    const commentParams = currentCommentId ? { commentId: currentCommentId, content } : { content };
    post(`comment/${currentMomentId}${reply}`, commentParams).then(({ insertId }) => {
      const replyComment = currentCommentId ? {
        id: insertId,
        userid: userInfo.value?.id,
        username: userInfo.value?.username,
      } : null;
      const comment = {
        user: userInfo.value,
        content,
        commentId: currentCommentId,
        replyComment,
      };
      momentList.value?.[currentMomentId]?.comments?.push(comment);
      console.log(momentList.value?.[currentMomentId]?.comments);
      commentTextaea.value.value = '';
    });
  };
  return {
    commentIconClick,
    commentFormWarpper,
    commentForm,
    commentTextaea,
    CCSendHandleClick,
  };
};
// 时间：计算多久之前
const useHowLongAgoEffect = () => {
  const howLongAgo = computed(() => (commentDate) => {
    const oldDate = Date.parse(commentDate);
    const newDate = Date.now();
    const ago = newDate - oldDate;
    const intervals = [
      { unit: '年', seconds: 31536000000 },
      { unit: '个月', seconds: 2592000000 },
      { unit: '天', seconds: 86400000 },
      { unit: '小时', seconds: 3600000 },
      { unit: '分钟', seconds: 60000 },
      { unit: '秒', seconds: 1000 },
    ];
    let message = '刚刚';
    for (let i = 0; i < intervals.length; i += 1) {
      const interval = intervals[i];
      const count = Math.floor(ago / interval.seconds);
      if (count > 0) {
        message = `${count}${interval.unit}前`;
        break;
      }
    }
    return message;
  });
  return { howLongAgo };
};
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Moment',
  props: {
    loginIsShowFun: {
      type: Function,
      required: true,
    },
  },
  components: {
    ViewTheImage,
  },
  setup(props) {
    const { loginIsShowFun } = toRefs(props);
    const store = useStore();
    const { userInfo, momentList } = toRefs(store.state);
    // 多久之前
    const { howLongAgo } = useHowLongAgoEffect();
    // 喜欢
    const {
      likeHandleClick, handleLikeItOrNot,
    } = useLikeEffect(userInfo, momentList, loginIsShowFun);
    // 评论
    const {
      commentIconClick, commentFormWarpper, commentForm,
      commentTextaea, CCSendHandleClick,
    } = useCommentEffect(userInfo, momentList, loginIsShowFun);
    // 动态评论文本框
    const {
      textareaInput, textareaFocus, textareaPropUp, sendUnlock,
    } = useCommentFromFunEffect();
    // 查看图片
    const ViewTheImageWrapper = ref(null);

    return {
      howLongAgo,
      momentList,
      defaultAvatar,
      commentIconClick,
      commentFormWarpper,
      commentForm,
      commentTextaea,
      CCSendHandleClick,
      textareaInput,
      textareaFocus,
      textareaPropUp,
      sendUnlock,
      likeHandleClick,
      handleLikeItOrNot,
      userInfo,
      ViewTheImage,
      ViewTheImageWrapper,
    };
  },
};

</script>
