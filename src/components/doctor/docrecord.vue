<template>
    <!-- 咨询记录 -->
    <div class="docrecord dis_f flex_c">
        <div class="content_box flex1" ref='scrolls'> 
            <div class='content'>
                <dl class="emptys" v-if='!msgList.length'>
                    <dt></dt>
                    <dd>暂无数据</dd>
                </dl>
               <div class="userMsg_box" v-for='(val, i) in msgList' :key='i'>
                    <div class="time"><span>{{ val.chat_time }}</span></div>
                     <div class="doc" v-if='val.user1 == "doc_"+did' >
                      <ul>
                          <li class="doc_img">
                              <img :src="$http.baseURL+val.uimg1" alt="">
                          </li>
                          <li class="txt" v-if='val.type == "txt"'>
                              <p> {{ val.content }}</p>
                              <div class="docFang" v-if='val.stype == 1' @click='chuFang(val.ext)'>
                                  <img src="../../common/img/img_lt_cfy.png" alt="">
                                  <span>电子处方</span>
                              </div>
                              <div class="docFang" v-if='val.stype == 2' @click='yaoPin(val.ext)'>
                                  <img src="../../common/img/icon_yptj.png" alt="">
                                  <span>推荐商品</span>
                              </div>
                              <div class="docFang" v-if='val.stype == 3'>
                                  <img src="../../common/img/icon_xxmz.png" alt="">
                                  <span>线下门诊</span>
                              </div>
                          </li>
                          <li class="imgs"  v-if='val.type == "img"'><img :src="$http.baseURL+val.content" alt=""></li>
                          <li class="audios"  v-if='val.type == "audio"'>
                                <div>
                                    <span class="doc_audio">
                                        <b></b>
                                    </span>
                                    <span class="mar_time"></span>
                                </div>
                          </li>
                      </ul>
                  </div>
                  <div class="myuser" v-if='val.user1 == "user_"+uid'>
                      <ul>
                          <li class="msg" v-if='val.type == "txt"'>{{ val.content }}</li>
                          <li class="msg2" v-if='val.type == "img"'><img :src="$http.baseURL+val.content" alt=""></li>
                          <li class="msg3" v-if='val.type == "audio"'>
                              <div>
                                    <span class="doc_audio user_audio" > 
                                        <b></b>
                                    </span>
                                    <span class="mar_time user_time"></span>
                                </div>
                          </li>
                          <li class="head">
                              <img :src="$http.baseURL+val.uimg1" alt="">
                          </li>
                      </ul>
                  </div>

                <!-- <div class="myuser" >
                    <ul>
                        <li class="msg" >我购买了您的付费问诊，
                            <router-link style="color: #5189F6;" to='/' >点此查看相关病情</router-link>
                        </li>
                        
                        <li class="head">
                            <img :src="$http.baseURL+val.uimg1" alt="">
                        </li>
                    </ul>
                </div>
                  <div class="payVisitsMsg">
                      <p><span>09-30 14:30</span></p>
                      <div>—— 已申请退诊 付费问诊已结束 ——</div>
                  </div> -->

               </div>
            </div>
        </div>
        <div class="footer">
            <mt-button @click.native="handerDoctor">立即咨询</mt-button>
            <!-- <mt-button v-show="status == 1" @click.native="handerDoctor2">继续咨询</mt-button> -->
        </div>
    </div>
</template>

<script>
var BenzAMRRecorder = require('benz-amr-recorder');
export default {
    name: 'docrecord',
    data () {
        return {
            msgList: [],  // 数据
            uid: this.$cookie.get('userLogins'),
            did: this.$route.query.id,               // 医生 id 
            status: this.$route.query.status,        // 咨询状态
        }
    },
    beforeCreate () {
        this.$indicator.close();
    },
    beforeDestroy () {
        this.$indicator.close();
    },
    mounted () {
        this.initdata();
    },
    methods: {
        initdata: function () {
            var self = this; var obj = { uid: this.uid, did: this.did };
            this.$http.post('/mobile/Wxregistration/chatting_records', obj).then(response => {
                console.log(response)
                if (response.code == 1) {
                    self.msgList = response.data
                    var t = setTimeout(() => {
                        // self.funcReadImgInfo(".doc_img");
                        // self.funcReadImgInfo(".head");
                        self.funcReadImgInfo(".imgs");
                        self.funcReadImgInfo(".msg2");
                        clearTimeout(t);
                    }, 100)
                    this.$nextTick(() => {
                        var msg = self.$refs.scrolls;
                        msg.scrollTop = msg.scrollHeight;            // 滚动高度
                    // 解析语音
                        var list_audio = self.msgList;
                        var _self = this;
                        var Audio = document.getElementsByClassName('doc_audio');
                    for (var d=0; d<list_audio.length;d++) {
                        if(list_audio[d].type == "audio") {
                                for (var i=0; i< Audio.length; i++) {
                                    for (var j =0; j< mar_time.length;j++) {
                                        var amr = new BenzAMRRecorder();
                                        var urls = this.$http.baseURL + list_audio[d].content;
                                        var mar_time = document.getElementsByClassName('mar_time');
                                        amr.initWithUrl(urls).then(function() {
                                            mar_time[j].innerHTML = amr.getDuration().toFixed(0) + '\"';
                                        })
                                        Audio[i].onclick = function () {
                                            var _this = this;
                                            amr.onPlay(function () {
                                                console.log('开始播放');
                                                _this.children[0].className = 'honr'
                                            });
                                            amr.onEnded(function() {
                                                console.log('播放完毕');
                                                _this.children[0].className = ''
                                            })
                                            amr.onStop(function() {
                                                console.log('停止播放');
                                                _this.children[0].className = ''
                                            })
                                            amr.onAutoEnded(function () {
                                                console.log('Event: autoEnded');
                                            });
                                            amr.onStartRecord(function () {
                                                console.log('Event: startRecord');
                                            });
                                            amr.onFinishRecord(function () {
                                                console.log('Event: finishRecord');
                                            });
                                            amr.onCancelRecord(function () {
                                                console.log('Event: cancelRecord');
                                            });
                                            if (amr.isPlaying()) {
                                                console.log('停止播放');
                                                amr.stop();
                                            } else {
                                                console.log('播放');
                                                amr.play();
                                            }
                                        }
                                    }
                                }
                            }   
                        }
                        
                        

                    })
                }
            })
        },
        handerDoctor: function () {  // 立即咨询
            
            this.$router.push('/chatroom?did='+this.did+'&uid='+this.uid);
            // var self = this;
            // var obj = { did: this.did, uid: this.uid}
            // this.$http.post('/mobile/wxauth/consult', obj).then(res => {
            //     console.log(res)
            //     if (res.code == 1) {
            //         self.$messagebox.confirm('已选择该医生，返回公众号首页，即可向医生咨询问题', {showCancelButton: false, confirmButtonText: '确定'}).then(action => {
            //             WeixinJSBridge.call('closeWindow'); 
            //         });
            //     } else {
            //         this.$toast({
            //             message: res.msg,
            //             position: 'middle',
            //             duration: 2000
            //         });
            //     }
            // })
        },
        handerDoctor2: function () {  // 继续咨询
            this.$messagebox.confirm('返回公众号首页，即可继续向医生咨询问题', {showCancelButton: false, confirmButtonText: '确定'}).then(action => {
               WeixinJSBridge.call('closeWindow'); 
            });
        },
        chuFang: function (id) { // 去处方详情页
            this.$router.push({ path:'/chufdetails', query: {id: id} })
        },
        yaoPin: function (id) { // 去商品详情页
            console.log(id)
            this.$router.push({ path:'/shopdetail', query: {id: id} })
        },
        /*调用微信预览图片的方法*/
        funcReadImgInfo: function (dom) {
            var imgs = [];
            // var imgObj = $(".imgs img");//这里改成相应的对象
            var imgObj = $( dom +" "+"img")
            for(var i=0; i<imgObj.length; i++) {
                imgs.push(imgObj.eq(i).attr('src'));
                imgObj.eq(i).click(function() {
                    var nowImgurl = $(this).attr('src');
                        WeixinJSBridge.invoke("imagePreview",{
                    "urls":imgs,
                    "current":nowImgurl
                });
                });
            }
        },
    }
}

    
    
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 +rem;
}
.docrecord {
    width: 100%;
    height: 100%;
    font-size: rem(14);
    background-color: #F5F5F7;
    .content_box {
        width: 100%;
        overflow-y: scroll;
        
        .content {
          width: 100%;
          padding: 0 rem(18) rem(18);
          .emptys {
              width: 100%;
              text-align: center;
              padding-top: rem(40);
             dt {
                width: rem(120);
                height: rem(120);
                display: block;
                margin: 0 auto;
                background: url('../../common/img/pic_zwxgyyjl.png') no-repeat;
                background-size: contain;
                    
             }
             dd {
                  color: #808080;
                  font-size: rem(14);
                  margin-top: rem(15);
              }
          }
          .userMsg_box {
              width: 100%;
              .time {
                    width: 100%;
                    margin-top: rem(18);
                    text-align: center;
                    > span {
                        color: #999;
                        font-size: rem(11);
                    }
                }
              .doc {
                width: 100%;
                margin-top: rem(15);
                ul {
                    display: -webkit-box; 
                    display: -moz-box; 
                    display: -webkit-flex; 
                    display: -moz-flex; 
                    display: -ms-flexbox; 
                    display: flex;
                    color: #181818;
                    
                  li.doc_img {
                      width: rem(40);
                      height:rem(40);
                     -webkit-border-radius:100%;
                      border-radius:100%;
                    img {
                        width: rem(40);
                        height:rem(40);
                        -webkit-border-radius:100%;
                        border-radius:100%;
                    }
                  }
                  li.txt {
                    margin-left: rem(10);
                    max-width: 80%;
                    background: #fff;
                    padding: rem(10);
                    line-height: rem(18);
                    position: relative;
                    -webkit-border-radius:0px rem(10) rem(10) rem(10);
                    border-radius:0px rem(10) rem(10) rem(10);
                    .docFang {
                        width: 100%;
                        margin-top: rem(10);
                        background-color: #F5F5F7;
                        padding: rem(5);
                        overflow: hidden;
                        >img {
                            width: rem(41);
                            height: rem(41);
                            display: block;
                            margin-right: rem(11);
                            float: left;
                        }
                        > span {
                            color: #333;
                            font-size: rem(12);
                        }
                    }
                  }
                  li.imgs {
                        margin-left: rem(10);
                        max-width: 80%;
                        background: #fff;
                        padding: rem(10);
                        line-height: rem(18);
                        -webkit-border-radius:0px rem(10) rem(10) rem(10);
                        border-radius:0px rem(10) rem(10) rem(10);
                      > img {
                          width: rem(60);
                          -webkit-border-radius: 4px;
                          border-radius: 4px;
                      }
                  }
                  li.audios {
                      margin-left: rem(10);
                     > div {
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-align-items: center; 
                        -ms-align-items: center;
                        align-items: center;
                        .doc_audio {
                            display: block;
                            width: rem(110);
                            padding: rem(5) rem(16);
                            margin-right: rem(5);
                            margin-top: rem(5);
                            background-color: #FFF;
                            -webkit-border-radius: 4px;
                            border-radius: 4px;
                            >b {
                                display: block;
                                width: rem(22);
                                height: rem(22);
                                background: url('../../common/img/dian3.png') no-repeat center center;
                                background-size: 100% 100%;
                            }
                        }

                    }
                  }
                  
                }
            }

            .myuser {
                width: 100%;
                margin-top: rem(15);
                ul {
                    display: -webkit-box; 
                    display: -moz-box; 
                    display: -webkit-flex; 
                    display: -moz-flex; 
                    display: -ms-flexbox; 
                    display: flex;
                    -webkit-justify-content: flex-end;
                    -moz-justify-content: flex-end;
                    -ms-justify-content: flex-end;
                    -o-justify-content: flex-end;
                    justify-content: flex-end;
                    color: #181818;
                    .head {
                      width: rem(40);
                      height:rem(40);
                      -webkit-border-radius:100%;
                      border-radius:100%;
                    img {
                        width: rem(40);
                        height:rem(40);
                        -webkit-border-radius:100%;
                        border-radius:100%;
                    }
                  }
                    .msg {
                        margin-right: rem(10);
                        max-width: 80%;
                        background: #fff;
                        padding: rem(10);
                        line-height: rem(18);
                        position: relative;
                        -webkit-border-radius: rem(10) 0px rem(10) rem(10);
                        border-radius:rem(10) 0px rem(10) rem(10);
                    }
                   .msg2 {
                       margin-right: rem(10);
                        max-width: 80%;
                        background: #fff;
                        padding: rem(10);
                        -webkit-border-radius: rem(10) 0px rem(10) rem(10);
                        border-radius:rem(10) 0px rem(10) rem(10);
                        > img {
                            width: rem(60);
                        }
                   }
                   .msg3 {
                       margin-right: rem(10);
                       >div {
                           display: -webkit-box;
                            display: -ms-flexbox;
                            display: flex;
                            -webkit-align-items: center; 
                            -ms-align-items: center;
                            align-items: center;
                            -webkit-transform: rotate(180deg);
                            transform: rotate(180deg);
                            .user_audio {
                                display: block;
                                width: rem(110);
                                padding: rem(5) rem(16);
                                margin-right: rem(5);
                                margin-bottom: rem(5);
                                background-color: #FFF;
                                -webkit-border-radius: 4px;
                                border-radius: 4px;
                                >b {
                                    display: block;
                                    width: rem(22);
                                    height: rem(22);
                                    background: url('../../common/img/dian3.png') no-repeat center center;
                                    background-size: 100% 100%;
                                }
                            }
                            .user_time {
                                -webkit-transform: rotate(180deg);
                                transform: rotate(180deg);
                            }
                       }
                   }
                }
            }

                .payVisitsMsg {
                    text-align: center;
                    width: 100%;
                    margin-top: rem(15);
                    > p {
                        span {
                            padding: rem(4) rem(6);
                            background-color: #C4C4C6;
                            color:#fff;
                            font-size: rem(12);
                            border-radius: rem(3);
                        }
                    }
                    > div {
                        margin-top: rem(15);
                        color: #808080;
                        font-size: rem(14);
                    }
                }

          }
          
        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        button {
            width: 100%;
            height: 100%;
            background: url('../../common/img/icon_ljwz.png') no-repeat;
            background-position: rem(123) center;
            background-size: 8%;
            background-color: #469AF4;
            color: #fff;
            font-size: rem(16);
            -webkit-border-radius: 0px;
            border-radius: 0px;
        }
    }
}
.honr {
    -webkit-animation: amr_Backgrounds 1s infinite step-start;
    -moz-animation: amr_Backgrounds 1s infinite step-start;
    -o-animation: amr_Backgrounds 1s infinite step-start;
    animation: amr_Backgrounds 1s infinite step-start;
}
@keyframes amr_Backgrounds {
    33.33% {background: url('../../common/img/dian.png') no-repeat center center; background-size: 100% 100%; }
    66.66% { background: url('../../common/img/dian2.png') no-repeat center center; background-size: 100% 100%;}
    100% {background: url('../../common/img/dian3.png') no-repeat center center;background-size: 100% 100%;}
}
</style>

