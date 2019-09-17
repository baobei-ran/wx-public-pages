
function isMobile () { // 是否在手机微信端
    var u = window.navigator.userAgent, app = navigator.appVersion;
    var mobile = !!u.match(/AppleWebKit.*Mobile.*/); //是否为移动终端
    var ua = window.navigator.userAgent.toLowerCase();//获取判断用的对象
    var isBool;
    if (mobile && ua.match(/MicroMessenger/i) == "micromessenger") {
        isBool = true
    } else {
        isBool = false
    }
    return isBool;
}
export default isMobile();