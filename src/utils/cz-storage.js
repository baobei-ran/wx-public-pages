
/**
 * 使用 html5 提供的 localStorage来缓存数据
 * 
 * function isIE() { //检测是否ie?
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
      } else {
        return false;
      }
    }
 **/
// 本地永久储存封装
// var localStorage = window.localStorage;
// export default {
//   get:function (key) {
//     var stringData = localStorage.getItem(key)
//     var val = JSON.parse(decodeURIComponent(stringData))
//     return val
//   },
//   set: function (key, value) {
//     var val = JSON.stringify(value)
//     localStorage.setItem(key, encodeURIComponent(val))
//   },
//   clear: function () {
//     localStorage.clear()
//   },
//   del: function (key) {
//     localStorage.removeItem(key)
//   }
// }

// 本地 临时存储
var sessionStorage = window.sessionStorage;
export default {
  get:function (key) {
    var stringData = sessionStorage.getItem(key)
    var val = JSON.parse(decodeURIComponent(stringData))
    return val
  },
  set: function (key, value) {
    var val = JSON.stringify(value)
    sessionStorage.setItem(key, encodeURIComponent(val))
  },
  clear: function () {
    sessionStorage.clear()
  },
  del: function (key) {
    sessionStorage.removeItem(key)
  }
}


