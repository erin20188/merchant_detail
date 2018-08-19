<template>
<div class="selectBtn">
  <div class="dec icon-minus-sign" v-show="food.count>0" @click="decCart"></div>
  <div class="count" v-show="food.count>0">{{food.count}}</div>
  <div class="add icon-plus-sign" @click="addCart"></div>
</div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      if (!event._constructed) {
          return;
      }
      console.log('1');
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
    },
    decCart (event) {
      if (!event._constructed) {
          return;
      }
      this.food.count--;
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .selectBtn
    font-size: 0
    .count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 20px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .add,.dec
      display: inline-block
      padding: 6px
      line-height: 20px
      font-size: 20px
      color: rgb(0, 160, 220)
</style>
