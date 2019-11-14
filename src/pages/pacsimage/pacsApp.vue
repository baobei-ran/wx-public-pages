<template>
    <div id='root'>
        <router-view />
    </div>
</template>
<style lang="scss" scoped>
html, body, #root {
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
#root {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>