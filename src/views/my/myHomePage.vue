<template>
  <div class="my-home-page-wrepper">
    <div class="header-bar">
      <div class="setting">设置</div>
    </div>
    <div class="user">
      <div class="user-bg">
        <div class="user-bg-shadow"></div>
        <div class="user-module">
          <div>
            <div class="user-name">{{ userInfo.username }}</div>
            <!-- <div class="user-account">{{  }}</div> -->
          </div>
          <div class="user-avatar">
            <img :src="`${APP_HOST}users/${userInfo.id}/avatar/middle`"
             alt="头像" v-if="userInfo?.id">
          </div>
        </div>
      </div>
      <div class="user-info">
        <div class="container">
          <div class="like-count">
            <span>{{ userInfo?.HarvestLikes }}</span>获赞
          </div>
          <div class="follow-count">
            <span>{{ userInfo?.follow }}</span>关注
          </div>
          <div class="fan-count">
            <span>{{ userInfo?.fan }}</span>粉丝
          </div>
        </div>
        <div class="bio" v-if="userInfo?.bio">
          <span>{{ userInfo?.bio }}</span>
        </div>
        <div>
          <span class="user-ip">{{ userInfo.ipAddress }}</span>
        </div>
      </div>
    </div>
    <div class="moment-wrapper">
      <ul class="activity-container">
        <li class="active" @click="(event) => MSHandleClick(event, 'userMoments')">
          动态
        </li>
        <li v-if="isUserHimself" @click="(event) => MSHandleClick(event, 'userPrivateMoments')">
          私密
        </li>
        <li @click="(event) => MSHandleClick(event, 'userLikeMoments')">
          喜欢
        </li>
      </ul>
      <div :class="[
        'moment-list',
        'user-moments',
        { show:momentType === 'userMoments' }
      ]">
        <div v-for="moment in Object.values(userMomentData.userMoment).reverse()"
          :key="moment.id">
          <div :class="{'moment-item':true,  'plain-text': !moment.picture}">
            <div class="moment-item-date">
              <span class="date-days">{{ getDateFunc(moment.createAt).day }}</span>
              <span class="date-month">{{ getDateFunc(moment.createAt).month }}月</span>
            </div>
            <div :class="{
              'moment-pictures':true,
              grid1: moment.picture.length === 1,
              grid2: moment.picture.length === 2,
              grid3: moment.picture.length === 3,
              grid4: moment.picture.length >= 4,
            }" v-if="moment.picture">
              <div class="picture"
                v-for="picture in moment.picture.slice(0, 4)" :key="picture.id">
                <img :src="`${APP_HOST}moment/picture/small/${picture.picturePath}`" alt="图片">
              </div>
            </div>
            <div class="moment-info">
              <div class="moment-content">
                {{ moment.content }}
              </div>
              <span class="moment-picture-count" v-if="moment.picture">
                {{ `共${moment.picture.length}张` }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div :class="[
        'moment-list',
        'user-private-moments',
        { show:momentType === 'userPrivateMoments' }
      ]">
      </div>
      <div :class="[
        'moment-list',
        'user-like-moments',
        { show:momentType === 'userLikeMoments' }
        ]">
        <template v-for="moment in userMomentData.userLikeMoment" :key="moment.id">
          <div class="like-moment">
            <div class="moment-picture" v-if="moment.picture">
              <img :src="`${APP_HOST}moment/picture/middle/${moment.picture?.picturePath}`">
            </div>
            <div class="moment-content">
              {{ moment.content }}
            </div>
            <div class="footer">
              <div class="user">
                <div class="user-avatar">
                  <img :src="`${APP_HOST}users/${userInfo.id}/avatar/small`" alt="" srcset="">
                </div>
                <div class="user-name">
                  {{ moment.username }}
                </div>
              </div>
              <div class="moment-like-count">
                <span class="iconfont icon-xihuan-xianxing"></span>
                <span>{{ moment.likeCount }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
.my-home-page-wrepper{
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .header-bar{
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: 0;
    width: 100%;
    height: 0.44rem;
    padding: 0 0.12rem;
    color: $font-color-reversal;
    box-sizing: border-box;
    z-index: 1;
    div{
      cursor: pointer;
    }
    .setting{
      font-size: 0.16rem;
    }
  }
  .user{
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    background-color: #fff;
    .user-bg{
      position: relative;
      width: 100%;
      height: 2rem;
      background: url('../../images/default_login_bg_img.jpg') no-repeat center center;
      background-size: cover;
      .user-module{
        display: flex;
        align-items: center;
        position: absolute;
        bottom: .18rem;
        right: .18rem;
        .user-avatar{
          width: 0.8rem;
          height: 0.8rem;
          margin-left: .12rem;
          border-radius: 50%;
          border: 0.02rem solid #fff;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .user-name{
          font-size: 0.20rem;
          font-weight: 600;
          color: $font-color-reversal;
        }
      }
      &-shadow{
        position: absolute;
        bottom: -.2rem;
        width: 100%;
        height: 80%;
        background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1));
      }
    }
    .user-info{
      width: 100%;
      background-color: #fff;
      border-radius: .08rem .08rem 0 0;
      z-index: 1;
      .container{
        display: flex;
        align-items: center;
        div{
          padding: 0 0.08rem;
          font-size: .14rem;
          span{
            font-size: .2rem;
            font-weight: 600;
          }
        }
      }
      .bio{
        padding: 0.2rem 0.3rem;
        span{
          font-size: 0.2rem;
          color: #ccc;
        }
      }
    }
  }
  .moment-wrapper{
    .activity-container{
      display: flex;
      width: 100%;
      height: 0.4rem;
      line-height: .4rem;
      text-align: center;
      background-color: #fff;
      border-bottom: 0.01rem solid #ccc;
      li{
        flex: 1;
        font-size: 0.14rem;
        color: $font-color-light;
        cursor: pointer;
      }
      li.active{
        font-weight: bold;
        color: $font-color-active;
        border-bottom: 0.02rem solid $font-color-active;
      }
    }
    .user-moments{
      width: 100%;
      background-color: #fff;
      display: none;
      .moment-item{
        display: flex;
        width: 100%;
        padding: .18rem;
        box-sizing: border-box;
        .moment-item-date{
          display: flex;
          align-items: baseline;
          justify-content: left;
          width: .78rem;
          .date-days{
            font-size: 0.28rem;
            font-weight: 600;
          }
          .date-month{
            font-size: 0.14rem;
          }
        }
        .moment-pictures{
          display: grid;
          grid-gap: 0.03rem;
          position: relative;
          width: 0.8rem;
          height: 0.8rem;
          margin-right: 0.1rem;
          .picture{
            position: relative;
            width: 100%;
            height: 100%;
            img{
              position: absolute;
              left: 0;
              top: 0;
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: 50% 50%;
            }
          }
        }
        .moment-pictures.grid1{
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
        }
        .moment-pictures.grid2{
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
          .picture:nth-child(1){
            grid-column: 1 / 2;
            grid-row: 1 / 2;
          }
        }
        .moment-pictures.grid3{
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          .picture:nth-child(1){
            grid-column: 1 / 2;
            grid-row: 1 / 3;
          }
        }
        .moment-pictures.grid4{
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }
        .moment-info{
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          .moment-content{
            font-size: 0.14rem;
            color: $font-color-light;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .moment-picture-count{
            font-size: 0.14rem;
            color: #ccc;
          }
        }
      }
      .moment-item.plain-text{
        .moment-info{
          justify-content: center;
          .moment-content{
            background-color: $block-bg-color;
          }
        }
      }
    }
    div.moment-list{
      display: none;
      padding-bottom: .4rem;
    }
    .moment-list.show{
      display: block;
    }
    .user-like-moments{
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      .like-moment{
        padding: .08rem;
        box-sizing: border-box;
        .moment-picture{
          position: relative;
          width: 1.7rem;
          height: 0;
          padding-top: 2rem;
          margin-bottom: .1rem;
          img{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100% ;
            object-fit: cover;
            object-position: 50% 50%;
          }
        }
        .like-moment-content{
          font-size: 0.14rem;
          color: $font-color-light;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .footer{
          .user{
            display: flex;
            flex-direction: row;
            .user-avatar{
              width: .2rem;
              height: .2rem;
              border-radius: 50%;
              overflow: hidden;
              img{
                width: 100%;
                height: 100%;
              }
            }
          }
          .moment-like-count{

          }
        }
      }
    }
  }
}
</style>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { get } from '../../utils/axios';
import ScrollGetData from '../../js/scrollGetData';

const useUserMomentEffect = (urlUserId, isUserHimself, store, warningWrapper) => {
  const userMomentData = reactive({
    userMoment: {},
    userLikeMoment: {},
    userPrivateMoment: {},
  });
  // 每次获取的数据条数，
  const momentType = ref('userMoment');

  const getUserData = new ScrollGetData();
  const { momentList } = getUserData.momentList(`moment/user/${urlUserId}`, warningWrapper);
  userMomentData.userMoment = momentList;

  // 点击加载更多 ms = moment classify
  const MSHandleClick = (event, classify) => {
    const { target } = event;
    // 移除选中的样式，给当前点击的添加选中样式
    target.parentNode.querySelector('.active').classList.remove('active');
    target.classList.add('active');
    if (classify === 'userMoments') {
      momentType.value = 'userMoments';
    } else if (classify === 'userLikeMoments') {
      momentType.value = 'userLikeMoments';
      const getUserLike = new ScrollGetData();
      const { momentList: momentLikeList } = getUserLike.momentList(`moment/user/${urlUserId}/like`, warningWrapper);
      userMomentData.userLikeMoment = momentLikeList;
    } else if (classify === 'userPrivateMoments') {
      momentType.value = 'userPrivateMoments';
      const getUserPrivate = new ScrollGetData();
      const { momentList: momentPrivateList } = getUserPrivate.momentList(`moment/user/${urlUserId}/private`, warningWrapper, 'post');
      userMomentData.userPrivateMoment = momentPrivateList;
    }
  };
  return {
    momentType,
    userMomentData,
    MSHandleClick,
  };
};
const useDateEffect = () => {
  const getDateFunc = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const second = dateObj.getSeconds();
    return {
      year, month, day, hour, minute, second,
    };
  };
  return { getDateFunc };
};
const useUserEffect = (userId, store) => {
  const isUserHimself = ref(false);
  const userInfo = ref({});
  const getUserInfo = async () => {
    const result = await get(`users/${userId}`);
    isUserHimself.value = (userId === store.state.userInfo.id);
    userInfo.value = result;
  };
  getUserInfo();
  return { userInfo, isUserHimself };
};
export default {
  name: 'MyHomePage',
  props: {
    userId: {
      type: String,
      default: '',
    },
    loginIsShowFun: {
      type: Function,
      default: () => {},
    },
    warningWrapper: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const { warningWrapper } = toRefs(props);
    const { userId } = props.userId ? props : route.params;
    console.log(userId);
    // 获取用户信息
    const { userInfo, isUserHimself } = useUserEffect(userId, store);
    // 获取用户动态
    const {
      momentType,
      userMomentData,
      MSHandleClick,
    } = useUserMomentEffect(userId, isUserHimself, store, warningWrapper);
    // 获取时间
    const { getDateFunc } = useDateEffect();
    return {
      router,
      userInfo,
      isUserHimself,
      momentType,
      userMomentData,
      MSHandleClick,
      getDateFunc,
    };
  },
};
</script>
