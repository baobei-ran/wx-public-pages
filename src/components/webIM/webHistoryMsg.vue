<template>
    <!-- 历史记录 -->
    <div class="userHistory dis_f flex-v">

    <div class="userHistory_box flex1" ref='boxss'>
        <dl class="emptys" v-if='isEmpty'>
            <dt></dt>
            <dd>暂无数据</dd>
        </dl>
    <div class="webHistory" >
        <div class="userMsg_box" v-for="(val, i) in historyList" :key='i' >
                    <div class="time" v-show='val.chat_time'><span>{{ val.chat_time }}</span></div> 
                    <!-- 医生 -->
                  <div class="user" v-if="val.user1 == 'doc_'+did" >
                      <ul>
                          <li>
                              <img :src="val.uimg1?$http.baseURL+val.uimg1: ''" alt="" />
                          </li>
                          <li v-if="val.type == 'txt'">
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
                          <li v-if="val.type == 'img'">
                              <img style="width: 1rem;height:1rem;" :src="$http.baseURL+val.content" alt="" />
                          </li>
                          <li v-if="val.type == 'audio'">
                             <span @click='docAmrPlayAmr(val.content)' :class='docAudioIds == val.content?"audioplay":""' class="docAudio"></span>
                          </li>
                      </ul>
                  </div>
                  
                  
                  <!-- 用户 -->
                  <div class="myuser" v-if="val.user1 == 'user_'+uid">
                      <ul>
                          <li class="msg" v-if="val.type == 'txt'">
                            <span v-for="(tm, j) in val.content" :key='j+"_tm"'  v-html="tm"></span>
                          </li>
                          <li class="msg" v-if="val.type == 'img'">
                            <img style='width: 1rem;' :src='$http.baseURL+val.content' alt='' />
                          </li>
                          <li class="msg" v-if="val.type == 'audio'">
                            <span class="userAudio" :class="docAudioIds == val.content?'audioplay':''" @click='docAmrPlayAmr(val.content)'></span>
                          </li>
                          <li class="head">
                              <img :src="val.uimg1?$http.baseURL+val.uimg1: '../../common/img/pic_grzx_tx.png'" alt="" />
                          </li>
                      </ul>
                  </div>
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
    data () {
        return {
            historyList: [],      // 聊天历史记录
            docAudioIds: '',
            uid: '',
            did: '',
            isEmpty: false,
        }
    },
    mounted () {
        this.uid = this.$route.query.uid;
        this.did = this.$route.query.did;
        this.chatHistory();
    },
    methods: {
        docAmrPlayAmr (url) { // 医生音频播放
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
        chatHistory () {  // 聊天历史记录
          var self = this;
          this.$http.post('/mobile/Wxchat/chat_pu', { uid:this.uid, did:this.did }).then(res => {
            console.log(res)
            this.$indicator.close();
            if (res.code == 1) {
                self.historyList = res.data.reverse();
                function renderTxt(txt) { // 解析文本和表情
                    var rnTxt = [],
                        match = null,
                        regex = /(\[.*?\])/g,
                        start = 0,
                        index = 0;
                    while ((match = regex.exec(txt))) {
                        index = match.index
                      if (index > start) {
                            rnTxt.push(txt.substring(start, index))
                        }
                        if (match[1] in WebIM.Emoji.map) {
                            var v = WebIM.Emoji.map[match[1]];
                            rnTxt.push('<img src="./assets/images/faces/'+v+'" style="width: 0.5rem; height: 0.5rem;vertical-align: middle;" />')
                        } else {
                            rnTxt.push(match[1])
                        }
                        start = index + match[1].length
                    }
                    rnTxt.push(txt.substring(start, txt.length))
                    return rnTxt
                }
                self.historyList.map(val => {
                  if (val.type == 'txt') {
                      val.content = renderTxt(val.content)
                    }
                })
                self.$nextTick(() => {
                    var msg = self.$refs.boxss;
                    if (msg) {
                        msg.scrollTop = msg.scrollHeight;            // 滚动高度
                    }
                })
            } else {
                self.isEmpty = true
            }
          })
        },
        chuFang: function (id) { // 去处方详情页
          console.log(id)
            if (!id) {
              this.$toast({
                  message: 'id字段不存在，无法查看详情',
                  position: 'middle',
                  duration: 2000
              });
              return
            }
            this.$router.push({ path:'/chufdetails', query: {id: id} })
        },
        yaoPin: function (id) { // 去商品详情页
          console.log(id)
            if(!id) {
              this.$toast({
                  message: 'id字段不存在，无法查看详情',
                  position: 'middle',
                  duration: 2000
              });
              return;
            }
            this.$router.push({ path:'/shopdetail', query: {id: id} })
        },
        handleCaseHistory (id) {  // 电子病历
          if(!id) {
              this.$toast({
                  message: 'id字段不存在，无法查看详情',
                  position: 'middle',
                  duration: 2000
              });
              return;
            }
            this.$router.push({ path:'/emrdetails', query: {id: id} })
        },
        handleSuggestDrug (id) {  // 建议用药
          if(!id) {
              this.$toast({
                  message: 'id字段不存在，无法查看详情',
                  position: 'middle',
                  duration: 2000
              });
              return;
            }
            this.$router.push({ path:'/recommendDrug', query: {rid: id} })
        },
        handleMZ (id) { // 线下门诊
          if(!id) {
              this.$toast({
                  message: 'id字段不存在，无法查看详情',
                  position: 'middle',
                  duration: 2000
              });
              return;
            }
            this.$router.push('/docrecommend?'+id)
        },
        handerDoctor: function () {  // 立即咨询
            this.$router.push('/chatroom?did='+this.did+'&uid='+this.uid);
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
  @return $px / 100 + rem;
}
.userHistory {
    width: 100%;
    height: 100%;
    background-color: #F5F5F7;
    .userHistory_box {
        width: 100%;
        overflow-y: scroll;
        padding: 0 rem(30);
        .emptys {
              width: 100%;
              text-align: center;
              padding-top: rem(80);
             dt {
                width: rem(240);
                height: rem(240);
                display: block;
                margin: 0 auto;
                background: url('../../common/img/pic_zwxgyyjl.png') no-repeat;
                background-size: contain;
                    
             }
             dd {
                  color: #808080;
                  font-size: rem(28);
                  margin-top: rem(30);
              }
          }
    }
    .footer {
        width: 100%;
        height: rem(98);
        button {
            width: 100%;
            height: 100%;
            display: block;
            background: url('../../common/img/icon_ljwz.png') no-repeat;
            background-position: rem(244) center;
            background-size: 8%;
            background-color: #469AF4;
            color: #fff;
            font-size: rem(32);
            -webkit-border-radius: 0px;
            border-radius: 0px;
        }
    }
}
.webHistory {
    width: 100%;
    padding: rem(20) 0;
    .userMsg_box {
              width: 100%;
              font-size: rem(28);
      .time {
              width: 100%;
              text-align: center;
              margin-top: rem(30);
              > span {
                padding: rem(5) rem(10);
                background: #fff;
                color: #181818;
                font-size: rem(24);
                -webkit-border-radius: rem(4);
                border-radius: rem(4);
              }
          }
              .user {
                width: 100%;
                margin-top: rem(20);
                ul {
                    display: flex;
                    color: #181818;
                    
                  li:first-child {
                      width: rem(80);
                      height:rem(80);
                      background: #fff;
                      -webkit-border-radius:100%;
                      border-radius:100%;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius:100%;
                    }
                  }
                  li:last-child {
                    margin-left: rem(14);
                    max-width: 70%;
                    background: #fff;
                    padding: rem(20);
                    line-height: rem(44);
                    position: relative;
                    border-radius: rem(8);
                    .docAudio {
                        display: block;
                        width: rem(120);
                        height: rem(50);
                        background: url('../../common/img/dian3.png') no-repeat center center;
                        background-size: 40%;
                    }
                    .docFang {
                        width: 100%;
                        margin-top: rem(10);
                        background-color: #F5F5F7;
                        padding: rem(10);
                        overflow: hidden;
                        >img {
                            width: rem(50);
                            height: rem(51);
                            display: block;
                            margin-right: rem(20);
                            float: left;
                        }
                        > span {
                            color: #333;
                            font-size: rem(24);
                        }
                    }
                  }
                  li:last-child:after {
                    content: '';
                    border-width: rem(10);
                    border-style: solid;
                    border-color: #fff transparent transparent transparent;
                    position: absolute;
                    left: rem(-18);
                    top: rem(10);
                    transform: rotate(90deg);
                  }
                }
            }

            .myuser {
                width: 100%;
                margin-top: rem(20); 
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
                      width: rem(80);
                      height:rem(80);
                      background: #fff;
                      -webkit-border-radius:100%;
                      border-radius:100%;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius:100%;
                    }
                  }
                    .msg {
                      margin-right: rem(14);
                      max-width: 70%;
                      background: #fff;
                      padding: rem(20);
                      line-height: rem(44);
                      position: relative;
                      border-radius: rem(8);
                      background-color: #D4E3FF;
                      color: #333;
                      .userAudio {
                          display: block;
                          width: rem(120);
                          height: rem(50);
                          background: url('../../common/img/dian3.png') no-repeat center center;
                          -webkit-transform: rotate(180deg);
                          transform: rotate(180deg);
                          background-size: 40%;
                          cursor: pointer;
                      }
                      
                    }
                    .msg:after {
                      content: '';
                      border-width: rem(10);
                      border-style: solid;
                      border-color: #D4E3FF transparent transparent transparent;
                      position: absolute;
                      right: rem(-18);
                      top: rem(10);
                      transform: rotate(-90deg);
                    }
                }
            }
          }
}
.audioplay {
    -webkit-animation: amr_Backgrounds 1s infinite step-start;
    -moz-animation: amr_Backgrounds 1s infinite step-start;
    -o-animation: amr_Backgrounds 1s infinite step-start;
    animation: amr_Backgrounds 1s infinite step-start;
}

@keyframes amr_Backgrounds {
    33.33% {background: url('../../common/img/dian.png') no-repeat center center; background-size: 40%; }
    66.66% { background: url('../../common/img/dian2.png') no-repeat center center; background-size: 40%;}
    100% {background: url('../../common/img/dian3.png') no-repeat center center;background-size: 40%;}
}
</style>