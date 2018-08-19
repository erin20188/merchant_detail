<template>
<div class="goods">
  <div class="menu-wrapper" ref="menuWrapper">
    <ul>
      <li v-for="(item,index) in goods" :key="index" class="menu-item"
          :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
        <span class="text">
          <span class="icon" v-show="item.type>0"  :class="classMap[item.type]"></span>
          {{item.name}}
        </span>
      </li>
    </ul>
  </div>
  <div class="foods-wrapper" ref="foodsWrapper">
    <ul>
      <li v-for="(item,index) in goods" :key="index" class="food-list-hook">
        <h1 class="title">{{item.name}}</h1>
        <ul>
          <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
            <div class="icon">
              <img width="57" height="57" :src="food.icon">
            </div>
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="count">月售{{food.sellCount}}份</span>
                <span class="rating">好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span class="now">￥{{food.price}}</span>
                <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
              </div>
              <div class="select_wrap">
                <selectBtn :food="food"></selectBtn>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></shopcart>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import shopcart from '.././shopcart/shopcart';
import selectBtn from '.././selectBtn/selectBtn';
const ERR_NUM = 0;
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listH: [],
        scrollY
      };
    },
    created () { // 当这个组件被调用的时候，通过后端获得数据赋值给goods
      this.$http.get('/api/goods').then((response) => { //   '/api/goods'请求的是data.json下的goods数组
        var obj = response.body;
        if (obj.errno === ERR_NUM) {
          this.goods = obj.data;
          this.$nextTick(() => { // 可以用 $nextTick 來确保Dom变化后再执行一些事情
             this._initScroll();
             this.getHeight();
          });
        }
      });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      _initScroll () {
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      getHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let itemH = 0;
        this.listH.push(itemH);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          itemH += (item.clientHeight - 1);
          this.listH.push(itemH);
        }
      },
      selectMenu (index, event) {
        if (!event._constructed) {
          return;
        }
        let list = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let item = list[index];
        this.foodsScroll.scrollToElement(item, 300);
      }
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listH.length; i++) {
          let height1 = this.listH[i];
          let height2 = this.listH[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods () {
        let selectFood = [];
        this.goods.forEach(item => {
          item.foods.forEach(food => {
            if (food.count) selectFood.push(food);
          });
        });
        return selectFood;
      }
    },
    components: {
      shopcart,
      selectBtn
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/main.styl";

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 64px;
      padding: 0 8px;
      line-height: 14px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
      .text
        display: table-cell
        width: 64px
        vertical-align: middle
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        .icon
         display: inline-block
         vertical-align: top
         width: 12px
         height: 12px
         margin-right: 2px
         background-size: 12px 12px
         background-repeat: no-repeat
         &.decrease
          bg-img('decrease_3')
         &.discount
          bg-img('discount_3')
         &.guarantee
          bg-img('guarantee_3')
         &.invoice
          bg-img('invoice_3')
         &.special
          bg-img('special_3')
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        margin-bottom: 0
        &:after
          display: none
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          color: rgb(147, 153, 159)
        .desc
          font-size: 10px
          line-height: 12px
          margin-bottom: 8px
       .extra
         font-size: 0
         .count
          font-size: 10px
          margin-right: 12px
         .rating
          font-size: 10px
       .price
        font-weight: 700
        line-height: 24px
        font-size: 0
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
       .select_wrap
        position: absolute
        right: 0
        bottom: 12px
</style>
