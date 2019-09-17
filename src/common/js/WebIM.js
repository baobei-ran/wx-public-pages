
// 环信聊天配置
// 引入Strophe方法
var Strophe = require('strophe.js').Strophe;
var meStrophe = require('strophe.js');
$iq = meStrophe.$iq;
$build = meStrophe.$build;
$msg = meStrophe.$msg;
$pres = meStrophe.$pres;
 
// 给Strophe.Connection 添加方法
Strophe.Connection.prototype.setJid = (jid) => {
    Strophe.Connection.jid = jid;
    Strophe.Connection.authzid = Strophe.getBareJidFromJid(Strophe.Connection.jid);
    Strophe.Connection.authcid = Strophe.getNodeFromJid(Strophe.Connection.jid);
}
 
Strophe.Connection.prototype.getJid = () => {
    return Strophe.Connection.jid;
}
 


window.Strophe = Strophe;
 
import websdk from 'easemob-websdk';
const WebIM = window.WebIM = websdk;
//配置文件参考环信demo
var config = {
    xmppURL: 'im-api.easemob.com',
    https: false,
    apiUrl: WebIM.config.apiURL,
    apiURL: (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',
    appkey: '1100181025211076#yyk-doctor',
    https: false,
    isMultiLoginSessions: false,
    isAutoLogin: true,              // 自动出席，（如设置为false，则表示离线，无法收消息，需要在登录成功后手动调用conn.setPresence()才可以收消
    isWindowSDK: false,
    isSandBox: false,
    isDebug: true,          // 打开调试，会自动打印log，在控制台的console中查看log
    autoReconnectNumMax: 2,
    autoReconnectInterval: 2,
    isWebRTC: (/Firefox/.test(navigator.userAgent) || /WebKit/.test(navigator.userAgent)) && /^https\:$/.test(window.location.protocol),
    heartBeatWait: 4500,
    isHttpDNS: false,
    msgStatus: true,
    delivery: true,         // 是否发送已读回执
    read: true,
    saveLocal: false,
    encrypt: {
        type: 'none'
    }
}

 
//初始化配置
WebIM.config = config
 
WebIM.Emoji = {
    path: './assets/images/faces/'  /*表情包路径*/
    , map: {
        "[):]": "ee_1.png",
        "[:D]": "ee_2.png",
        "[;)]": "ee_3.png",
        "[:-o]": "ee_4.png",
        "[:p]": "ee_5.png",
        "[(H)]": "ee_6.png",
        "[:@]": "ee_7.png",
        "[:s]": "ee_8.png",
        "[:$]": "ee_9.png",
        "[:(]": "ee_10.png",
        "[:'(]": "ee_11.png",
        "[:|]": "ee_18.png",
        "[(a)]": "ee_13.png",
        "[8o|]": "ee_14.png",
        "[8-|]": "ee_15.png",
        "[+o(]": "ee_16.png",
        "[<o)]": "ee_12.png",
        "[|-)]": "ee_17.png",
        "[*-)]": "ee_19.png",
        "[:-#]": "ee_20.png",
        "[:-*]": "ee_22.png",
        "[^o)]": "ee_21.png",
        "[8-)]": "ee_23.png",
        "[(|)]": "ee_24.png",
        "[(u)]": "ee_25.png",
        "[(S)]": "ee_26.png",
        "[(*)]": "ee_27.png",
        "[(#)]": "ee_28.png",
        "[(R)]": "ee_29.png",
        "[({)]": "ee_30.png",
        "[(})]": "ee_31.png",
        "[(k)]": "ee_32.png",
        "[(F)]": "ee_33.png",
        "[(W)]": "ee_34.png",
        "[(D)]": "ee_35.png"
        
    }
};

 var conn = new WebIM.connection({    
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,    
        https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',    
        url: WebIM.config.xmppURL,    
        heartBeatWait: WebIM.config.heartBeatWait,    
        autoReconnectNumMax: WebIM.config.autoReconnectNumMax,    
        autoReconnectInterval: WebIM.config.autoReconnectInterval,    
        apiUrl: WebIM.config.apiURL,    
        isAutoLogin: true
  });

export { conn, WebIM };