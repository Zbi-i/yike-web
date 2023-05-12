<template>
  <div class="moment-detaile-wrapper">
    <div class="moment-detaile-pictures">
      <div class="pictures-list">
        <div v-for="" :key=""></div>
      </div>
      <ul class="carousel-nav">
        <li v-for="" :key=""></li>
      </ul>
    </div>
    <div class="user">
      <div>
        <div class="user-avatar"><img src="" alt="" srcset=""></div>
        <div class="user-name"></div>
      </div>
      <div class="follow-btn"></div>
    </div>
    <div class="moment-info">
      <div class="moment-content"></div>
      <div class="moment-lables"></div>
    </div>
    <div class="comment-list">
      <div class="comment-item">
        <div></div>
        <div>
          <div class="comment-username"></div>
          <div class="comment-content"></div>
          <div>
            <span class="comment-date"></span>
            <span>·</span>
            <span class="comment-ip"></span>
            <button class="reply">回复</button>
          </div>
          <div class="unfold-commont">
            <div class="transverse-line"></div>
            <div>
              展开{{ moment.commentCount }}条评论<span class="iconfont icon-31xiala"></span>
            </div>
            <div>
              收起<span class="iconfont icon-31xiala"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="action bar">
    <div>
      <input type="text"/>
    </div>
    <ul>
      <li class="like">
        <span class="iconfont "></span>
        <span></span>
      </li>
      <li class="comment">
        <span class="iconfont "></span>
        <span></span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
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
</style>

<script>

export default {
  name: 'MomentDetaile',
  setup() {
    return {};
  },
};
</script>
