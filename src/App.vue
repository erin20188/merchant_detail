<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="navbar border-1px">
      <div class="navbar-item">
        <router-link to="/goods">商品</router-link></div>
      <div class="navbar-item">
        <router-link to="/comments">评论</router-link></div>
      <div class="navbar-item">
        <router-link to="/seller">商家</router-link></div>
    </div>
    <router-view class="main" :seller="seller"></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import header from './components/header/header.vue';

  const ERR_NUM = 0;

  export default{
    data () {
      return {
       seller: {}
      };
    },
    created () {
      this.$http.get('/api/seller').then((response) => {
        var obj = response.body;
        if (obj.errno === ERR_NUM) {
          this.seller = obj.data;
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/main.styl";

  #app .navbar
    display: flex
    height: 40px
    width: 100%
    border-1px(rgba(7, 17, 27, 0.1))

  #app .navbar-item
    flex: 1
    text-align: center

  #app .navbar-item a
    display: block
    font-size: 14px
    line-height: 40px
    color: rgb(77,85,93)

  #app .navbar-item .active
    color: rgb(240,20,20)!important

</style>
