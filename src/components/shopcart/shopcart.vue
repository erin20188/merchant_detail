<template>
  <div>
    <div class="shopcart">
    <div class="main" @click="toggle_shopCList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping-cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <!--stop.prevent防止冒泡-->
        <div class="pay" :class="payClass" @click.stop.prevent="pay">
          {{payPrice}}
        </div>
      </div>
    </div>
    <transition name="show">
      <div class="shopcart-list" v-show="this.show && this.totalCount > 0">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,index) in selectFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="select_wrap">
                <selectBtn :food="food"></selectBtn>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
  <transition name="show">
    <div class="list-mask" @click="hideList" v-show="this.show && this.totalCount > 0"></div>
  </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import selectBtn from '.././selectBtn/selectBtn';
import BScroll from 'better-scroll';
  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array
      }
    },
    data () {
        return {
          show: false
        };
    },
    computed: {
      totalPrice () {
        let tPrice = 0;
        this.selectFoods.forEach((item) => {
          tPrice += item.price * item.count;
        });
        return tPrice;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((item) => {
          count += item.count;
        });
        return count;
      },
      payPrice () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          return `还差${this.minPrice - this.totalPrice}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      }
    },
    methods: {
      toggle_shopCList () {
        if (!this.totalCount) {
          if (this.show) this.show = !this.show;
          return false;
        }
        this.show = !this.show;
        return this.show;
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        alert(`支付${this.totalPrice}元`);
      },
      hideList () {
        this.show = false;
      }
    },
    watch: {
      totalCount: {
        handler () {
          if (this.totalCount === 0) this.show = false;
        }
      },
      show: {
        handler () {
          if (this.show === true && this.totalCount > 0) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        }
      }
    },
    components: {
      selectBtn
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/main.styl";
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .main
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
             background: rgb(0, 160, 220)
            .icon-shopping-cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
               color: #fff
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
           color: #fff
        .desc
         display: inline-block
         vertical-align: top
         margin: 12px 0 0 12px
         line-height: 24px
         font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
           background: #2b333b
          &.enough
           background: #00b43c
           color: #fff
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.show-enter-active,&.show-leave-active
       transition: all 0.5s ease-in-out
      &.show-leave-active,&.show-enter
       transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .select_wrap
            position: absolute
            right: 0
            bottom: 6px

 .list-mask
   position: fixed
   top: 0
   left: 0
   width: 100%
   height: 100%
   z-index: 40
   backdrop-filter: blur(10px)
   opacity: 1
   background: rgba(7, 17, 27, 0.6)
   &.show-enter-active,&.show-leave-active
     transition: all 0.5s ease-in-out
   &.show-leave-active,&.show-enter
      opacity: 0
</style>
