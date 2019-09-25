<template>
  <div id="app">
    <!-- <transition :name="transitionName"> -->
        <keep-alive>
            <router-view v-if='$route.meta.keepAlive'></router-view>
        </keep-alive>
        <router-view v-if='!$route.meta.keepAlive'></router-view>
        <!-- <router-view class="app-router"/> -->
    <!-- </transition> -->
  </div>
</template>
<script>
export default {
  name: 'uservipApp',
  data () {
    return {
      transitionName: 'slide-right',
    }
  },
  watch: {
   '$route' (to, from){
      let isBack = to.meta.index;
      let isBack2 = from.meta.index;
      if(isBack < isBack2) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
    }
  }
}
</script>
<style lang='scss'>
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}


.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}

html, body, #app {
  width:100%;
  height: 100%;
  display: -webkit-box;
  display: -moz-box; 
  display: -webkit-flex; 
  display: -moz-flex; 
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -o-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
}
.app-router {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  -webkit-overflow-scrolling: touch;
  -moz-overflow-scrolling: touch;
  -ms-flex-overflow-scrolling: touch;
}
select {
  background: #fff;
}
// ::-webkit-scrollbar{ display: none; }
// 改变滚动条
// ::-webkit-scrollbar{width:0;height:1px}
// ::-webkit-scrollbar-thumb{border-radius:5px;-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,.2);box-shadow:inset 0 0 5px rgba(0,0,0,.2);background:rgba(0,0,0,.2)}
// button:active{
//   -webkit-tap-highlight-color: transparent;
// }
input:disabled,
.bg-white {
  background-color: #FFF;
}
// 去电 input number 里面的上下箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type=number]{
  -moz-appearance: textfield;
}
</style>
