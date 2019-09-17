<template>
    <!-- 医生详情 -->
    <div class="doctor dis_f flex_d">
        <div v-wechat-title="datalist.true_name+'的工作室'"></div>
         <!-- <div class="header">
            <img @click='Return' src="../../common/img/icon_fh.png" alt="">
            <span>{{ datalist.true_name }}的工作室</span>
        </div> -->
        <div class="section flex1">
            <div >
                <div class="list">
                    <ul>
                        <li>
                            <img ref='userImg' class="userImg" src="../../common/img/pic_wdys_ystx.png" alt="">
                            <dl>
                                <dt>
                                    <span>{{ datalist.true_name }}</span>
                                    <b>{{ datalist.gname }} | {{ datalist.department_name }}</b>
                                </dt>
                                <dd>
                                    {{ datalist.hospital_name }}
                                </dd>
                            </dl>
                        </li>
                        <li class="list_c">擅长：<span>{{ datalist.title }}</span></li>
                        <li class="list_intro ">
                            {{ datalist.true_name }}医生想与你继续沟通
                        </li>
                    </ul>
                    
                </div>
                <div class="docContent">
                    <div class='content'>
                        <div class="time"><span>{{ time }}</span></div>
                        <div class="userMsg_box">
                            <div class="user" v-if='type == 1'>
                                <ul>
                                    <li class="head_portrait">
                                        <img class="userImg" :src="$http.baseURL + datalist.picture" alt="">
                                    </li>
                                    <li class="txt">
                                        {{ con }}
                                    </li>
                                </ul>
                            </div>
                            <div class="user" v-if='type == 2'>
                                <ul>
                                    <li class="head_portrait">
                                        <img class="userImg" :src="$http.baseURL + datalist.picture" alt="">
                                    </li>
                                    <li class="file_img">
                                        <img :src="$http.baseURL+ con" alt="">
                                    </li>
                                </ul>
                            </div>
                            <div class="user" v-if="type == 3">
                                <ul>
                                    <li class="head_portrait">
                                        <img class="userImg" :src="$http.baseURL + datalist.picture" alt="">
                                    </li>
                                    <li class="audios">
                                        <!-- <audio hidden='true' id="player" :src='$http.baseURL + con' controls="controls" >
                                            <source :src='$http.baseURL + con'/>
                                        </audio> -->
                                        
                                        <div>
                                            <span class="audio" id='Audio' @click='playAudio'>
                                                <b :class="{'honr':flag}"></b>
                                            </span>
                                            <span>{{ playTime }}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <mt-button type="primary" id='btnout' size="large" @click.native="initdata">立即咨询</mt-button>
        </div>
    </div>
</template>

<script>
var BenzAMRRecorder = require('benz-amr-recorder');
export default {
    name: 'doctordetail',
    data () {
        return {
            uid: '',   // 用户id
            did: '',   // 医生id
            openid: '',
            datalist: {},
            type: '',
            con: '',
            time: '',
            playTime: '',
            flag: false,
            amr: '',
            Interval: '',    // 定时器
        }
    },
    mounted() {
    function changeTime(time){ // 时间转换
        if(time){
            var oDate = new Date(time*1000),
                oYear = oDate.getFullYear(),
                oMonth = oDate.getMonth()+1,
                oDay = oDate.getDate(),
                oHour = oDate.getHours(),
                oMin = oDate.getMinutes(),
                oSen = oDate.getSeconds(),
                oTime = oYear +'-'+ getBz(oMonth) +'-'+ getBz(oDay) +' '+ getBz(oHour) +':'+ getBz(oMin) +':'+getBz(oSen);//拼接时间
            return oTime;
        }else{
            return "";
        }
    }
    //补0
    function getBz(num){
        if(parseInt(num) < 10){
            num = '0'+num;
        }
        return num;
    }

        this.type = this.$route.query.type  // 1、文本 2、图片 3、音频
        this.con = this.$route.query.con    // 内容
        this.time = changeTime(this.$route.query.time)  // 时间
        this.did = this.$route.query.did
        this.uid = this.$route.query.uid
        this.openid = this.$route.query.openid
        if (this.type == 3) {
            setTimeout(() => {
                var _self = this;
                this.amr = new BenzAMRRecorder();
                var url = this.$http.baseURL + this.con
                this.amr.initWithUrl(url).then(function() {
                    _self.playTime = _self.amr.getDuration().toFixed(0) + '\"';
                })
                this.amr.onPlay(function () {
                    console.log('开始播放');
                    _self.flag = true
                });
                this.amr.onEnded(function() {
                    console.log('播放完毕');
                    _self.flag = false
                })
                this.amr.onStop(function() {
                    console.log('停止播放');
                    _self.flag = false
                })
                this.amr.onAutoEnded(function () {
                    console.log('Event: autoEnded');
                });
                this.amr.onStartRecord(function () {
                    console.log('Event: startRecord');
                });
                this.amr.onFinishRecord(function () {
                    console.log('Event: finishRecord');
                });
                this.amr.onCancelRecord(function () {
                    console.log('Event: cancelRecord');
                });
                var Audio = document.getElementById('Audio');
                console.log(this.amr)
                Audio.onclick = function () {
                    if (_self.amr.isPlaying()) {
                        console.log('停止播放');
                        _self.amr.stop();
                    } else {
                        console.log('播放');
                        _self.amr.play();
                    }
                }
            }, 300)
            // this.playTime = Math.floor(Math.random() * 199)
        }
        this.inituser()
        
    },
    methods: {
        playAudio () {
            console.log('test')
            // this.flag = !this.flag
            // var player = document.getElementById('player');
            // if (player.paused) {
            //     player.play();
            // } else {
            //     player.pause();
            // }
        },
        inituser () {
            var self = this;
            this.$http.post('/mobile/wxdoccenter/doctor_detail', {did:this.did, uid: this.uid}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.datalist = res.data
                    if (self.datalist.picture) {
                        self.$refs.userImg.src = self.$http.baseURL + self.datalist.picture
                    }
                }
            })
        },
        initdata () {   // // 立即咨询
            var self = this;
            this.$http.post('/mobile/wxauth/consult', {did:this.did, uid: this.uid, openid: this.openid}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.usermsg()
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'conter',
                        duration: 2000
                    });
                }
            })
        },
        Return () {
            this.$router.back()
        },
        
        usermsg () {
            var self = this;
            this.$messagebox.confirm('你已选择该医生，请直接返回聊天', {showCancelButton: false, confirmButtonText: '确定并返回'}).then(action => {
                self.wx_clocs()
            });
        },
         wx_clocs () {   // 返回公众号首页

                if(typeof WeixinJSBridge !== "undefined"){
                    WeixinJSBridge.call('closeWindow');
                    // parent.WeixinJSBridge.call('closeWindow');
                    // setTimeout('WeixinJSBridge.call("closeWindow")', 300);
                } else {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', function () {
                            WeixinJSBridge.call('closeWindow');
                        }, false)
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', function () {
                            WeixinJSBridge.call('closeWindow');
                        })
                        document.attachEvent('onWeixinJSBridgeReady', function () {
                            WeixinJSBridge.call('closeWindow');
                        })
                    }
                     else if (navigator.userAgent.indexOf("MSIE") > 0) {  

                            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {  
                                window.opener = null; window.close();  
                            } else {  
                                window.open('', '_top'); window.top.close();  
                            }  
                    } else if (navigator.userAgent.indexOf("Firefox") > 0) {  
                        window.location.href = 'about:blank ';  
                    } else {  
                        window.opener = null;   
                        window.open('', '_self', '');  
                        window.close();  
                    }
                }
            }
    },
    beforeDestroy () {
          if (this.Interval)  {
              clearInterval(this.Interval)
          }
    },
}
</script>

<style>

</style>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}

@mixin rounded ($l, $r, $t, $b, $color) {
    -webkit-box-shadow: $l $r $t $b $color;  
    -moz-box-shadow: $l $r $t $b $color;
    box-shadow: $l $r $t $b $color;
}

@mixin radius ($v1, $v2, $v3, $v4) {
    -webkit-appearance:none;
    -webkit-border-radius: $v1 $v2 $v3 $v4;
    -moz-border-radius: $v1 $v2 $v3 $v4;
    -ms-border-radius: $v1 $v2 $v3 $v4;
    -o-border-radius: $v1 $v2 $v3 $v4;
    border-radius: $v1 $v2 $v3 $v4;
}

.doctor {
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: rem(14);
    .header {
        display: -webkit-flex;
        display: flex;
        height: rem(40);
        justify-content: center;
        color: #212121;
        position: relative;
        @include rounded(0px,1px,0px,0px, rgba(224,224,224,.5));
        padding-top: rem(0);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-size: rem(16);
        background: #fff;
        img {
            font-size: rem(30);
            position: absolute;
            left: rem(15);
            top: rem(10);
            line-height: 1;
            font-size: rem(19);
            width: rem(24);
            padding: rem(3);
        }
        span {
            padding-top: rem(15);
            font-weight:400;
            color: #212121;
        }
    }
    .section {
        width: 100%;
        font-size: rem(14);
        overflow-y: scroll;
        .list {
            width: 100%;
            font-size: rem(12);
            padding: 0 rem(15);
            >ul {
                padding: rem(15);
                width: 100%;
                background:rgba(255,255,255,1);
                @include rounded(0px,2px,5px,0px, rgba(0,0,0,0.1));
                border-radius:4px;
                margin-top: rem(5);
                li:first-child {
                    -webkit-display: flex;
                    display: flex;
                    >img {
                        display: block;
                        width: rem(49);
                        height: rem(49);
                        border-radius: 50%;
                    }
                    >dl {
                        flex: 1;
                        padding-left: rem(15);
                        dt {
                            line-height: rem(30);
                            span {
                                margin-right: rem(15);
                                color:#333;
                                font-size: rem(16);
                            }
                            b {
                                color: #808080;
                                font-size: rem(12);
                            }
                        }
                        dd {
                            font-size: rem(12);
                            color: #333;
                        }
                    }
                }
                .list_c {
                    margin-top: rem(10);
                    font-size: rem(12);
                    color: #333;
                    line-height: rem(18);
                    padding-bottom: rem(15);
                    border-bottom: 1px solid #e6e6e6;
                }
                .list_intro {
                   margin-top: rem(15);
                   color: #3196FF;
                   position: relative;
                   padding-bottom: rem(10);
                   background: #fff;                 
                }
               

            }

        .server {
            width: 100%;
            box-shadow:0px 5px 10px 0px rgba(0, 0, 0, 0.1);
            border-radius:4px;
            margin-top: rem(5);
            h4 {
                padding: rem(15) rem(16);
                border-bottom: 1px solid #E6E6E6;
                color: #333;
                font-size: rem(16);
                font-weight:500;
                }
                .server_ul {
                    width: 100%;
                    position: relative;
                    li {
                        -webkit-display: flex;
                        display: flex;
                        padding: rem(15);
                        >img {
                            width: rem(40);
                            height: rem(40);
                        }
                        >div {
                            margin-left: rem(10);
                            >h5 {
                                color: #333;
                                font-size: rem(14);
                                line-height: rem(20);
                                font-weight: 550;
                                span {
                                    color: #F09F88;
                                    font-size: rem(16);
                                }
                            }
                            >p {
                                line-height: rem(20);
                                color: #808080;
                                font-size:rem(11);
                                margin-top: rem(3);
                                padding-right: rem(18);
                            }
                        }
                        .server_right {
                            position: absolute;
                            right: rem(3);
                            top: 30%;
                            > img {
                                width: rem(35);
                                font-size: rem(9);
                            }
                        }
                    }
                }
            }
        }


        .docContent {
            width: 100%;
        .content {
          width: 100%;
          padding: rem(15);
          .time {
              width: 100%;
              text-align: center;
              > span {
                  padding: rem(1) rem(2);
                text-align: center;
                background: #fff;
                color: #666;
                font-size: rem(13);
                @include radius(rem(4), rem(4), rem(4), rem(4));
              }
          }
          .userMsg_box {
              width: 100%;
              .user {
                width: 100%;
                margin-top: rem(15);
                ul {
                    display: flex;
                    color: #181818;
                  .head_portrait {
                      width: rem(33);
                      height:rem(33);
                      background: #fff;
                      -webkit-appearance:none;
                      -webkit-border-radius:50%;
                      -moz-border-radius:50%;
                      -ms-border-radius:50%;
                      -o-border-radius:50%;
                      border-radius:50%;
                    img {
                        width: 100%;
                        height: 100%;
                        -webkit-appearance:none;
                        -webkit-border-radius:50%;
                        -moz-border-radius:50%;
                        -ms-border-radius:50%;
                        -o-border-radius:50%;
                        border-radius:50%;
                    }
                  }
                  .txt {
                    margin-left: rem(10);
                    max-width: 80%;
                    background: #eee;
                    padding: rem(10) rem(15);
                    line-height: rem(20);
                    position: relative;
                    font-size: rem(13);
                    @include radius(0, 10px, 10px, 10px);
                    
                  }
                  .file_img {
                       margin-left: rem(10);
                        max-width: 70%;
                        background: #eee;
                        padding: rem(10);
                        line-height: rem(20);
                        position: relative;
                        font-size: rem(13);
                        @include radius(0, 10px, 10px, 10px);
                      >img {
                        width: rem(110);
                        height: rem(110);
                    }
                    
                  }
                  .audios {
                      margin-left: rem(10);
                      > div {
                        display: flex;
                        align-items: center; 
                        .audio {
                            display: block;
                            width: rem(110);
                            padding: rem(5) rem(16);
                            margin-right: rem(5);
                            @include radius(0, 10px, 10px, 10px);
                            background-color: #EEE;
                            >b {
                                display: block;
                                width: rem(22);
                                height: rem(22);
                                background: url('../../common/img/dian3.png') no-repeat center center;
                                background-size: 100% 100%;
                            }
                            .honr {
                                -webkit-animation: Backgrounds 1s infinite step-start;
                                -moz-animation: Backgrounds 1s infinite step-start;
                                -o-animation: Backgrounds 1s infinite step-start;
                                animation: Backgrounds 1s infinite step-start;
                            }
                        }

                    }
                  }
                  
                }
            }

          }
          
        }
        }


    }
    .footer {
        width: 100%;
        button {
            height: rem(49);
            font-size: rem(16);
            border-radius: 0;
        }
        #btnout {
            background:#469AF4 url(../../common/img/icon_ljwz.png) no-repeat rem(120) center;
            background-size: 7%;
        }
    }
}
@keyframes Backgrounds {
    33.33% {background: url('../../common/img/dian.png') no-repeat center center; background-size: 100% 100%; }
    66.66% { background: url('../../common/img/dian2.png') no-repeat center center; background-size: 100% 100%;}
    100% {background: url('../../common/img/dian3.png') no-repeat center center;background-size: 100% 100%;}
}
</style>
