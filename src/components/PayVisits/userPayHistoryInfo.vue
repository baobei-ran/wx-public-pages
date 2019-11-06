<template>
    <!-- 付费问诊历史聊天记录 -->
    <div class="docrecord dis_f flex_c">
        <div class="content_box flex1" ref='scrolls'> 
            <div class='content'>
                <dl class="emptys" v-if='!msgList.length'>
                    <dt></dt>
                    <dd>暂无数据</dd>
                </dl>
                <van-pull-refresh style="height: 100%;" v-model="isLoading" @refresh="onRefresh" pulling-text='下拉加载更多' loosing-text='释放即可加载'>
               <div class="userMsg_box" v-for='(val, i) in msgList' :key='i'>
                    <div class="time"><span>{{ val.chat_time }}</span></div>
                     <div class="doc" v-if='val.user1 == "doc"' >
                      <ul>
                          <li class="doc_img">
                              <img :src="$http.baseURL+val.uimg1" alt="" />
                          </li>
                          <li class="txt" v-if="val.type == 'txt'">
                              <span v-if='val.data'>{{ val.data }}</span>
                              <span v-if='val.content' v-for="(t, i) in val.content" :key='i+"_emjj"' v-html='t'></span>
                              <div class="docFang" v-if='val.stype == 1' @click='chuFang(val.ext)'>
                                  <img src="../../common/img/img_lt_cfy.png" alt=""/>
                                  <span>电子处方</span>
                              </div>
                              <div class="docFang" v-if='val.stype == 2' @click='yaoPin(val.ext)'>
                                  <img src="../../common/img/icon_yptj.png" alt=""/>
                                  <span>推荐商品</span>
                              </div>
                              <div class="docFang" v-if='val.stype == 3' @click='handleMZ(val.ext)'>
                                  <img src="../../common/img/icon_xxmz.png" alt=""/>
                                  <span>线下门诊</span>
                              </div>
                              <div class="docFang" v-if='val.stype == 5' @click='handleSuggestDrug(val.ext)'>
                                  <img src="../../common/img/icon_yptj.png" alt=""/>
                                  <span>建议用药</span>
                              </div>
                               <div class="docFang" v-if='val.stype == 6' @click='handleCaseHistory(val.ext)' >
                                  <img src="../../common/img/icon_dzbl@2x.png" alt="" />
                                  <span>电子病历</span>
                              </div>
                          </li>
                          <li class="imgs"  v-if='val.type == "img"'><img :src="$http.baseURL+val.content" alt="" /></li>
                          <li class="audios"  v-if='val.type == "audio"'>
                               <span :data-url='val.content' @click='docAmrPlayAmr(val.content)' :class='docAudioIds == val.content?"honr":""' ></span>
                          </li>
                      </ul>
                  </div>
                  <div class="myuser" v-if='val.user1 == "user"'>
                      <ul>
                          <li class="msg" v-if='val.type == "txt"'>{{ val.content }}</li>
                          <li class="msg2" v-if='val.type == "img"'><img :src="$http.baseURL+val.content" alt=""></li>
                          <li class="msg3" v-if='val.type == "audio"'>
                              <span :data-url='val.content' @click='docAmrPlayAmr(val.content)' :class='docAudioIds == val.content?"honr":""' ></span>
                          </li>
                          <li class="head">
                              <img :src="$http.baseURL+val.uimg1" alt="">
                          </li>
                      </ul>
                  </div>

                <div class="myuser" v-if='false'>
                    <ul>
                        <li class="msg" >我购买了您的付费问诊，
                            <router-link style="color: #5189F6;" to='/' >点此查看相关病情</router-link>
                        </li>
                        
                        <li class="head">
                            <img :src="$http.baseURL+val.uimg1" alt="">
                        </li>
                    </ul>
                </div>
                  <div class="payVisitsMsg" v-if='false'>
                      <p><span>09-30 14:30</span></p>
                      <div>—— 已申请退诊 付费问诊已结束 ——</div>
                  </div>

               </div>
               </van-pull-refresh>
            </div>
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
            page: 1,
            limit: 10,
            isLoading: false,
            did: '',
            uid: '',
            docAudioIds: ''
        }
    },
    mounted () {
        var docdid = this.$route.query.did
        if (docdid) {
            this.did = docdid
        }
        this.uid = this.$route.query.uid || this.$cookie.get('userLogins');
        this.initdata();
    },
    methods: {
        docAmrPlayAmr (url) { // 医生音频播放
            console.log(url)
              var self = this;
              var urls = this.$http.baseURL+url;
              var amr = new BenzAMRRecorder();
              amr.initWithUrl(urls).then(function() { // 加载
                var mar_time = amr.getDuration().toFixed(0) + '\"';
                  console.log(mar_time);
                  self.$nextTick(() => {
                    amr.onPlay(function () {
                        console.log('开始播放');
                    });
                    amr.onEnded(function() {
                        console.log('播放完毕');
                        self.docAudioIds = ''
                    })
                    amr.onStop(function() {
                        console.log('停止播放');
                        self.docAudioIds = ''
                    })
                    if (amr.isPlaying()) {
                        console.log('停止播放');
                        amr.stop();
                        self.docAudioIds = ''
                    } else {
                        console.log('播放');
                        amr.play();
                        self.docAudioIds = url;
                    }
                  })
              })
        },
        onRefresh() {
            this.page++
            this.initdata()
        },
        initdata: function () {
            var self = this, obj = { number: this.$route.query.number, page: this.page, limit: this.limit  };
            this.$http.post('/mobile/doch5/ask_data', obj).then(response => {
                console.log(response)
                self.$indicator.close();
                self.isLoading = false;
                if (response.code == 1) {
                    if (response.data.length > 0) {
                        response.data.map(itm => {
                            if (itm.user1.indexOf("doc") != -1) {
                                itm.user1 = 'doc'
                            }
                            if (itm.user1.indexOf("user") != -1) {
                                itm.user1 = 'user'
                            }
                        })
                    }
                    if (self.page == 1) {
                        if (response.data.length > 1) {
                            self.msgList = response.data.reverse()
                        } else {
                            self.msgList = response.data
                        }
                        
                    } else {
                        var list = self.msgList;
                        self.msgList = response.data.reverse().concat(list)
                    }
                    
                    this.$nextTick(() => {
                        if (self.page == 1) {
                             var msg = self.$refs.scrolls;
                            if (msg) {
                                msg.scrollTop = msg.scrollHeight;            // 滚动高度
                            }
                        }
                       
                    })
                } else {
                    this.$toast('没有更多数据');
                }
            })
        },
        
        
        chuFang: function (id) { // 去处方详情页
            this.$router.push({ path:'/chufdetails', query: {id: id} })
        },
        yaoPin: function (id) { // 去商品详情页
            this.$router.push({ path:'/shopdetail', query: {id: id} })
        },
        /*调用微信预览图片的方法*/
        funcReadImgInfo: function (dom) {
            var imgs = [];
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
    },
    beforeDestroy () {
        this.$indicator.close();
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
                      background: #fff;
                      padding: rem(8);
                      -webkit-border-radius:0px rem(10) rem(10) rem(10);
                      border-radius:0px rem(10) rem(10) rem(10);
                      span {
                            display: block;
                            width: rem(60);
                            height: rem(25);
                            background: url('../../common/img/dian3.png') no-repeat center center;
                            background-size: 40%;
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
                       max-width: 80%;
                        background: #fff;
                        padding: rem(8);
                        -webkit-border-radius: rem(10) 0px rem(10) rem(10);
                        border-radius:rem(10) 0px rem(10) rem(10);
                        span {
                            -webkit-transform: rotate(180deg);
                            transform: rotate(180deg);
                            display: block;
                            width: rem(60);
                            height: rem(25);
                            background: url('../../common/img/dian3.png') no-repeat center center;
                            background-size: 40%;
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

