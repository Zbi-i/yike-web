<template>
  <div class="yike-list">
    <template v-for="yike in yikeList" :key="yike.id">
      <div class="like-yike">
        <div class="yike-picture" v-if="yike.picture">
          <img :src="`${APP_HOST}moment/picture/middle/${yike.picture?.picturePath}`">
        </div>
        <div class="yike-content">
          {{ yike.content }}
        </div>
        <div class="footer">
          <div class="user">
            <div class="user-avatar">
              <img :src="`${APP_HOST}users/${yike.userId}/avatar/small`" alt="" srcset="">
            </div>
            <div class="user-name">
              {{ yike.username }}
            </div>
          </div>
          <div class="yike-like-count">
            <span class="iconfont icon-xihuan-xianxing"></span>
            <span>{{ yike.likeCount }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '../../style/viriables';

.yike-list{
  column-count: 2;
  column-gap: .06rem;
  width: 100%;
  padding: .06rem;
  background-color: $bg-color-body;
  overflow: scroll;
  box-sizing: border-box;
  .like-yike{
    margin-bottom: .06rem;
    background-color: $bg-color-default;
    border-radius: .06rem;
    overflow: hidden;
    .yike-picture{
      position: relative;
      margin-bottom: .06rem;
      font-size: 0;
      img{
        width: 100%;
        height: auto ;
        object-fit: cover;
        object-position: 50% 50%;
      }
    }
    .yike-content{
      overflow: hidden;
      padding: 0 .06rem;
      font-size: 0.14rem;
      text-overflow: ellipsis;
      margin-bottom: .06rem;
    }
    .footer{
      display: flex;
      flex-direction: row;
      padding: 0 .06rem;
      margin-bottom: .06rem;
      .user{
        display: flex;
        flex-direction: row;
        .user-avatar{
          width: .2rem;
          height: .2rem;
          margin-right: .06rem;
          border-radius: 50%;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .yike-like-count{
        margin-left: auto;
        vertical-align: -0.01rem;
      }
    }
  }
}
.yike-list::-webkit-scrollbar{
  display: none;
}
</style>
<script>
import { ref, reactive } from 'vue';
import { get } from '../../utils/axios';

const getYikeEffect = () => {
  const size = 1;
  const yikeList = ref({});
  const limit = reactive({
    offset: 0,
    size,
  });
  const getYikeList = async () => {
    const yikes = await get(`moment/yike/list?offset=${limit.offset}&size=${limit.size}`);
    yikes.forEach((yike) => {
      yikeList.value[yike.id] = yike;
    });
    limit.offset += size;
    limit.size += size;
  };
  getYikeList();
  return { getYikeList, yikeList };
};

export default {
  name: 'YikeList',
  props: {
    loginIsShowFun: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const { getYikeList, yikeList } = getYikeEffect('moment/yike/list');
    return {
      getYikeList,
      yikeList,
    };
  },
};
</script>
