<template>
  <div id="app">
      <keep-alive>
          <router-view v-if='$route.meta.keeepAlive'></router-view>
      </keep-alive>
      <router-view v-if='!$route.meta.keeepAlive'></router-view>
  </div>
</template>
<script>
export default {
  name: 'uservipApp'
}
</script>
<style lang='scss'>
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
