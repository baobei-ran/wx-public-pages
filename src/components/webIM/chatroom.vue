
<template>
<!-- 在线聊天室 -->
    <div class="index dis_f flex_d" id='chat-box'>
      <div v-wechat-title="'与医生在线聊天'"></div>
      <div class='chat-head-msg' v-if='daoMsg'>医生将在<span>{{ daoTime }}</span>内回复你，超时未回复，将自动为您退诊</div>
      <div class='chat-head-msg' v-show="userMsg" ><span v-html='userMsg'></span> <span v-if='viewTime' style="margin-left: 15px;">{{viewTime}}</span></div>
        <div class='chat-head-msg' v-show="isbuyMsg">
          <p>当前为付费问诊，您需要购买<router-link style="color:#469AF4;" :to="'/buyWebImInfo?did='+did+'&uid='+uid" >医生的问诊服务</router-link>才可向医生咨询</p>
        </div>
        <div class="content_box flex1" ref='xwBody'> 
            <div class='content'>
              <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh">             -->
                <div class="userMsg_box" v-for="(val, i) in historyList" :key='i+"_lishi"' >
                    <div class="time" v-show='val.chat_time'><span>{{ val.chat_time }}</span></div> 
                    <!-- 医生 -->
                  <div class="user" v-if="val.user1 == 'doc_'+did" >
                      <ul>
                          <li>
                              <img :src="val.uimg1?$http.baseURL+val.uimg1: ''" alt="" />
                          </li>
                          <!-- txt -->
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
                          <!-- img -->
                          <li v-if="val.type == 'img'">
                              <img style="width: 1rem;height:1rem;" @click='clickScalePic($http.baseURL+val.content)' :src="$http.baseURL+val.content" alt="" />
                          </li>
                          <!-- audio -->
                          <li v-if="val.type == 'audio'">
                             <span :data-url='val.content' @click='docAmrPlayAmr(val.content)' :class='docAudioIds == val.content?"audioplay":""' class="docAudio"></span>
                          </li>
                      </ul>
                  </div>
                  
                  <!-- 用户 -->
                  <div class="myuser" v-if="val.user1 == 'user_'+uid">
                      <ul>
                        <!-- txt -->
                          <li class="msg" v-if="val.type == 'txt'">
                            <span v-for="(tm, j) in val.content" :key='j+"_tm"'  v-html="tm"></span>
                          </li>
                          <!-- img -->
                          <li class="msg" v-if="val.type == 'img'">
                            <img style='width: 1rem;' @click='clickScalePic($http.baseURL+val.content)' :src='$http.baseURL+val.content' :alt='val.content' />
                          </li>
                          <!-- audio -->
                           <li class="msg" v-if="val.type == 'audio'">
                            <span class="userAudio" :class="docAudioIds == val.content?'audioplay':''" :data-url='val.content' @click='docAmrPlayAmr(val.content)'></span>
                          </li>
                          <li class="head">
                              <img :src="val.uimg1?$http.baseURL+val.uimg1: '../../common/img/pic_grzx_tx.png'" alt="" />
                          </li>
                      </ul>
                  </div>
          </div>
          <!-- </van-pull-refresh> -->
                <!-- /////////////////////// /////////////////////////// -->
                
               <div class="userMsg_box" v-for="(val, i) in msgContent" :key='i' >
                 <!-- 时间 -->
                    <div class="time" v-show='val.startTiem'><span>{{ val.startTiem | chatTime }}</span></div> 

                    <!-- 超时退诊提示 -->
                      <div class="user-msg-title" v-if='val.type == "txt" && val.ext && val.ext.messageTig'>{{ val.ext.messageTig }}</div> 
                    <!-- 医生 -->
                    <div class="user" v-show="val.from == 'doc_'+did">
                      
                      <ul>
                          <li>
                              <img :src="(val.ext && val.ext.yykIcon) ?$http.baseURL+val.ext.yykIcon:'../../common/img/pic_wdys_ystx.png'" alt="">
                          </li>
                          <!-- txt -->
                          <li v-if='val.type == "txt"' >
                            <span v-html="val.data"></span>
                            <div class="docFang" v-if='val.ext && val.ext.stype == 1' @click='chuFang(val.ext.ext)'>
                                  <img src="../../common/img/img_lt_cfy.png" alt=""/>
                                  <span>电子处方</span>
                              </div>
                              <div class="docFang" v-if='val.ext && val.ext.stype == 2' @click='yaoPin(val.ext.ext)'>
                                  <img src="../../common/img/icon_yptj.png" alt=""/>
                                  <span>推荐商品</span>
                              </div>
                              <div class="docFang" v-if='val.ext && val.ext.stype == 5' @click='handleSuggestDrug(val.ext.ext)'>
                                  <img src="../../common/img/icon_yptj.png" alt=""/>
                                  <span>建议用药</span>
                              </div>
                              <div class="docFang" v-if='val.ext && val.ext.stype == 3' @click='handleMZ(val.ext.ext)'>
                                  <img src="../../common/img/icon_xxmz.png" alt="" />
                                  <span>线下门诊</span>
                              </div>
                              <div class="docFang" v-if='val.ext && val.ext.stype == 6' @click='handleCaseHistory(val.ext.ext)' >
                                  <img src="../../common/img/icon_dzbl@2x.png" alt="" />
                                  <span>电子病历</span>
                              </div>
                          </li>
                          <!-- 表情 -->
                          <li class='dis_f' v-if="val.type == 'emoji'">
                              <p v-for="(t, i) in val.data" :key='i+"_emjj"'>
                                  <span v-show="t.type == 'txt' && t.data" >{{ t.data }}</span>
                                  <img style="vertical-align: middle; width: 0.5rem;height:0.5rem;" :src="t.type == 'emoji'? t.data: ''" alt="" />
                              </p>
                          </li>
                          <!-- 图片 -->
                           <li v-if="val.type == 'img'">
                              <img style="width: 1rem;height:1rem;font-size:0.24rem;" @click='clickScalePic(val.url)' :src="val.url" alt="图片加载失败" />
                          </li>
                          <!-- 语音 -->
                          <li v-if="val.type == 'audio'">
                             <span :data-url='val.url' @click='docAmrPlay(val.url)' :class='docAudioId == val.url?"audioplay":""' class="docAudio"></span>
                          </li>
                      </ul>
                  </div>
                  
                
                  <!-- 用户 -->
                  <div class="myuser" v-show="val.to == 'doc_'+did">
                    
                      <ul>
                          <!-- txt -->
                          <li class="msg" v-if="val.type == 'txt'">
                            <span v-for="(tm, j) in val.msg" :key='j+"_tm"' v-html="tm"></span>
                          </li>
                          <!-- img -->
                          <li class="msg" v-if="val.type == 'img'">
                            <img style='width: 1rem;' @click='clickScalePic(val.imgUrl)' :src='val.imgUrl' :alt='val.imgname?val.imgname.filename:""' />
                          </li>
                          <!-- audio -->
                          <li class="msg" v-if="val.type == 'audio'">
                            <span class="userAudio" :class="audioId == val.wxid?'audioplay':''" @click='playRecordBtn(val.wxid)'></span>
                          </li>
                          <li class="head">
                              <img :src="userPic?$http.baseURL+userPic: '../../common/img/pic_grzx_tx.png'" alt="" />
                          </li>
                      </ul>
                  </div>
                 
               </div>

                  <!-- 图片上传加载样式 -->
                  <div class="ImgLoading" v-show="shows">
                    <ul>
                        <li class="msg">
                          <img style="width: 0.5rem;" src="../../common/images/lazy.gif" alt="" />
                        </li>
                        <li class="head">
                            <img :src="userPic?$http.baseURL+userPic: '../../common/img/pic_grzx_tx.png'" alt="" />
                        </li>
                    </ul>
                </div>
                <!-- <div class='dayEnd' v-show='isUserMsg'>—— 付费问诊已结束 ——</div> -->
            </div>
        </div>
        <div class="footer">
            <ul class="dis_f flex-vc">
              <li>
                <i @click="handleAudio" :class="audioShow?'audio-icon':'jianpan-icon'"></i>
              </li>
              <li class="audioInput flex1" v-show="!audioShow">
                  <button :class="isStyle?'btnactive':''"  @touchstart.prevent="audioStart($event)" @touchmove='touchMove($event)' @touchend="audioEnd($event)" >{{ audioMsg }}</button>
              </li>
              <li v-show="audioShow" class="contentTxt flex1 dis_f"><textarea class="flex1" @focus="animateWidth" id='chat-txt' ref='textMsg' v-model="textVal" ></textarea><i @click="handleIconShow" class="tb-icon"></i></li>
              <li class="btn">
                <mt-button v-show="textVal" @click.native="handleReply">发送</mt-button>
                <span v-show="!textVal" @click='handlePicture' class="btn-utils"><img src="../../common/img/icon_zd@2x.png" alt="" /></span>
              </li>
            </ul>
            <Emotion v-show="isShow" ref='emotion' @handleIcon='handleIcon' ></Emotion>
            <FilePic v-show='isPic' @changeTakeApicture='sendPrivateImg' ></FilePic>
        </div>
       

       <div class="mask" v-show="isVoice">
            <img src="../../common/img/luyin.gif" alt="" />
            <p>{{ audioTxt }}</p>
        </div>
      <transition name="bounce">
            <div @click='hideShade' class="model-shade dis_f dis_j flex_i" v-show='isModel'>
                <img :src="pics" alt="" />
            </div>
      </transition>
    </div>
</template>

<script>
var BenzAMRRecorder = require('benz-amr-recorder');
import Emotion from './Emotion';
import FilePic from './webPic';
export default {
      name: 'chatroom',
      components: {
        Emotion: Emotion,
        FilePic: FilePic
      },
      data () {
          return {
              isLoading: false,        // 下拉加载
              isModel: false,       // 查看图片遮罩
              historyList: [],      // 聊天历史记录
              docAudioIds: '',      // 历史记录播放动画
              isUserMsg: false,     // 提示用户信息
              isStyle: false,
              shows: false,
              isPic: false,
              audioShow: true,                      // 语音图片展示
              isShow: false,                        // 表情展示
              userPic: '',
              userName: '',
              msgContent: [],
              uid: '',
              did: '',
              textVal: '',                            // 输入框消息
              userId: '',
              docId: '',
              num: 0,
              TimeFun: '',  // 时间定时器
              userMsg: '',
              audioMsg: '按住 说话',
              audioTxt: '录音中······',
              posStart: 0,            // 手指按下位置
              posMove: 0,             // 手指移动距离
              flag: true,            // 是否发送录音
              recorder: '',           // 录音
              isVoice: false,         // 录音动画
              isbuyMsg: false,        // 是否购买问诊服务
              audioId: '',            // 用户播放动画
              docAudioId: '',         // 医生播放动画
              // timeInt: 60,             // 记录录音时间
              // timeBox: '',            // 定时器的容器
              viewTime: '',           // 问诊中正计时
              timeBox: '',            // 问诊中正计时容器
              onlines: false,         // 检测是否掉线
              daoTime: '',            // 倒计时
              daoBox: '',             // 倒计时容器 
              daoMsg: false,          // 展示倒计时
              userUpInfo: 0,          // 可以发送的消息数
              pics: '',
              isCode: 0,              // 首次进入页面获取code值来检测状态
          }
      },
      created () {
        this.$indicator.close();
        var querys= this.$route.query;
        var userId = querys.uid || this.$cookie.get('userLogins');
        if (userId) {
          this.uid = userId;
        }
        this.did = querys.did;
        this.userId = 'user_'+this.uid;
        this.docId = 'doc_'+this.did;
        this.$http.post('/mobile/wxauth/center', { uid: this.uid}).then(res => {
          console.log(res)
          if (res.code == 1) {
            this.userPic = res.data.pic;
            this.userName = res.data.real_name;
          }
        })
        this.initDialogMsg(); // 对话框显示信息
      },
      mounted () {
        this.$indicator.close();
        var userInfos = this.$storage.get('chatRoomInfo_'+this.did);
        console.log(userInfos)
        if (userInfos) {
          this.msgContent = userInfos;
          this.$nextTick (() => { // 进入聊天，初始化
            var msg = this.$refs.xwBody;
            if (msg) {  // childrenMsg
              msg.scrollTop = msg.scrollHeight;
              this.scrollToBottom();
            }
          })
        }
        this.chatHistory() // 获取历史记录

        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isiOS) {
              document.body.addEventListener('touchmove', function (e) {
                if(document.activeElement) {
                    document.activeElement.blur();
                }
                var node = document.activeElement; //当前focus的dom元素
                if (node) {
                    if (node.nodeName == "TEXTAREA" || node.nodeName == 'INPUT') { //如果是input或textarea
                        if (node.style.textShadow === '') {
                            node.style.textShadow = 'rgba(0,0,0,0) 0 0 0'; //改变某个不可见样式，触发dom重绘
                        } else {
                            node.style.textShadow = '';
                        }
                    }
                }
            }, {passive: false})

              $("textarea").on("focus", function() {
                  setTimeout(function(){ 
                      // document.body.scrollTop = document.body.scrollHeight; 
                       document.querySelector('textarea').scrollIntoView();
                  },300); 
              })
        }
      },
      methods: { 
        hideShade () {
          this.isModel = false
        },
        clickScalePic(url) {
            this.pics = url
            this.isModel = true
        },
        docAmrPlay (url) { // 医生音频播放
              if (!url) {
                return;
              }
              var self = this;
              if (self.docAudioId == url) {
                  self.docAudioId = ''
              } else {
                self.docAudioId = url
              }
              if (self.audioId) {
                  wx.stopVoice({
                    localId: self.audioId // 需要暂停的音频的本地ID，由stopRecord接口获得
                  });
                  self.audioId = '';
              }
              var amr = new BenzAMRRecorder();
              amr.initWithUrl(url).then(function() { // 加载
                var mar_time = amr.getDuration().toFixed(0) + '\"';
                  console.log(mar_time);
                  self.$nextTick(() => {
                    amr.onPlay(function () {
                        console.log('开始播放');
                    });
                    amr.onEnded(function() {
                        console.log('播放完毕');
                        self.docAudioId = ''
                        
                    })
                    amr.onStop(function() {
                        console.log('停止播放');
                        self.docAudioId = ''
                    })
                    if (amr.isPlaying()) {
                        console.log('停止播放');
                        amr.stop();
                        self.docAudioId = ''
                    } else {
                        console.log('播放');
                        amr.play();
                    }
                  })
              })
        },
        initDialogMsg () { // 获取对话框信息
          /**
           *  0=>’缺少参数
              1=>图文问诊未回复
              2=>图文问诊问诊中
              3=>阅片服务未回复
              4=>阅片服务问诊中
              7=>免费问诊
              8=>付费问诊->已用尽->患者需支付金额再次问诊
              9=>付费问诊->有免费天数
              10=>付费问诊->有免费条数
              11=>付费问诊->有免费条数 天数
              12=>付费问诊->未设置免费次数
              110=>暂无信息展示
           */
          var self = this;
          var obj = {did: this.did, uid: this.uid};
          console.log(obj)
          this.$http.post('/mobile/wxchat/user_title', obj).then(res => {
            self.$indicator.close();
            console.log(res)
              self.isCode = res.code;
            if (res.code == 1) {  // 图文问诊（付费问诊）
              this.userMsg = '';
              self.timerOrder(res.inquiry_time)
              self.daoMsg = true
            } else if (res.code == 2) {
              this.zhengTimer(res.inquiry_time);
              this.userMsg = '付费问诊中';
              if (this.$route.query.is_image_end && this.$route.query.is_image_end == 1) {  //  医生结束问诊 发起弹框
                  this.handleDialog(this.$route.query.did, this.$route.query.number);     
              }
            } else if (res.code == 3) { // 阅片问诊
              this.userMsg = '';
              self.timerOrder(res.inquiry_time)
              self.daoMsg = true
            } else if (res.code == 4) {
              this.zhengTimer(res.inquiry_time);
              this.userMsg = '阅片服务中';
              if (this.$route.query.is_image_end && this.$route.query.is_image_end == 1) {  //  医生结束问诊 发起弹框
                  this.handleDialog(this.$route.query.did, this.$route.query.number);   
              }
            } else if (res.code == 7) {
              this.userMsg = '当前为免费问诊，咨询医生的问题数量无限制';
            } else if (res.code == 8) { 
              this.userMsg = '';
              this.isbuyMsg = true;
              // self.isUserMsg = true;  // 页面展示，问诊结束
              this.getBuyDay()
            } else if (res.code == 9) {
              this.userMsg = '当前为付费问诊，您有'+res.sky+'天免费时间可向医生发送消息';
            } else if (res.code == 10) {
              self.userUpInfo = res.num
              this.userMsg = '当前为付费问诊，您可免费向医生发送'+res.num+'条消息';
            } else if (res.code == 11) {
              self.userUpInfo = res.num
              this.userMsg = '当前为付费问诊，您可在'+res.sky+'天内向医生发送'+res.num+'条消息';
            } else if (res.code == 12) {
              this.userMsg = '';
              this.isbuyMsg = true;
              this.getBuyDay()
            } else {
              this.userMsg = '';
            }

            self.$nextTick(() => {
              if (!self.isbuyMsg) {
                self.$http.post('/mobile/Wxchat/user_pwd', null).then(res => {  // 获取用户登录密码
                    console.log(res)
                    if (res.code == 1) {
                        self.loginWebIM(res.data); // 进入页面环信登录，进入聊天
                        self.weixinSdk(); // 微信登录，进行语音功能
                    }
                })
              }
            })

          }).catch(err => {
              self.$toast({
                  message: '服务器错误，无法服务',
                  position: 'middle',
                  duration: 3000
              });
          })
        },
        
        upRouterDay () {
          var self = this;
          self.$router.push({path:'/buyWebImInfo', query: { did: self.did, uid: self.uid }});  // 去购买问诊服务
        },
        weixinSdk () {  // 微信录音sdk进行登录
          var self = this,
            urls = '';
            if (this.$isIos()) {
              var storageUrl = this.$storage.get('chatRoom');
              urls = storageUrl?storageUrl : window.location.href;
            } else {
              urls = window.location.href;
            }
            console.log(urls)
          this.$http.post('/mobile/wxchat/wx_jsapi', { url: urls }).then(res => {
            console.log(res)
              if (res.code == 1) {
                  this.$nextTick(() => {
                    wx.config({
                      debug: false, // 开启调试模式,
                      appId: res.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                      nonceStr: res.data.nonce_str, // 必填，生成签名的随机串
                      signature: res.data.signature,// 必填，签名，见附录1
                      jsApiList:  ['startRecord', 'stopRecord', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'downloadVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                  })
              } else {
                  this.$toast({
                      message: '微信登陆失败，请退出重新进入登录',
                      position: 'middle',
                      duration: 3000
                  });
              }
          }).catch(err => {
              self.$toast({
                  message: '微信登陆失败，服务器出现错误',
                  position: 'middle',
                  duration: 3000
              });
          })
        },
        getBuyDay () {
          var self = this;
          this.$dialog.confirm({
            title: '',
            message: '<div style="color:#333;"><p >需购买医生的问诊服务才能继续咨询医生</p><h1 style="font-size: 0.32rem;margin-top:0.4rem;">是否购买医生的问诊服务</h1></div>',
            cancelButtonText: '取消',
            confirmButtonText: '前往购买',
            className: 'vant-day-dialog'
          }).then(() => {
            self.upRouterDay()
          }).catch(() => {
            console.log('no')
          });
        },
        audioStart (e) {
          var self = this;
          e.preventDefault(); // 阻止默认事件（长按手机振动）
          if (this.onlines) {
              this.$toast({
                  message: '你未在线，请退出重新进入',
                  position: 'middle',
                  duration: 3000
              });
              return;
          }
          if (this.isbuyMsg) {  // 当前为付费问诊，您需要购买医生的问诊服务才可向医生咨询
              this.getBuyDay()  // 弹起提示支付框
            return;
          }
          this.posStart =0;
          this.posStart = e.touches[0].pageY;
          this.audioMsg = '松开 结束';
          this.isStyle = true;
          this.isVoice = true;
          this.flag = true;
          this.audioTxt = '录音中······';
          
          wx.startRecord({
            success: function () {
              // alert('成功调起录音')
            },
            cancel: function () {
              self.$toast({
                  message: '用户拒绝授权录音',
                  position: 'middle',
                  duration: 3000
              });
              self.flag = false;
              self.audioEnd();
            }
          })
          
        },
        touchMove (e) {  // 录音滑动
            e.preventDefault();
            if (this.onlines) { return }
            if (this.isbuyMsg) {
              return;
            }
            this.posMove =0;
            this.posMove = e.targetTouches[0].pageY;
            if (Math.abs(this.posStart - this.posMove) < 50) {
              this.flag = true;
              this.audioMsg = '松开 结束';
            } else {
              this.flag = false;
              this.audioMsg = '松开手指, 取消发送';
            }
            
        },
        audioEnd (e) { // 录音结束
          e.preventDefault();
          if (this.onlines) { return; }
          if (this.isbuyMsg) {
            return;
          }
          var self = this;
          this.audioMsg = '按住 说话';
          this.isStyle = false;
          this.isVoice = false;
         
         
          if (this.flag) {      // 上传语音
            console.log('上传')
            // wx.onVoiceRecordEnd({
            //   // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            //     complete: function (res) {
            //       var localId = res.localId;
            //       console.log(localId)
            //     }
            // });
            
            wx.stopRecord({
              success: function (res) {
                var localId = res.localId;
                wx.uploadVoice({
                    localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                    var serverId = res.serverId; // 返回音频的服务器端ID
                    var audios = {to: self.docId, type:'audio', wxid: localId, serverId: serverId};  // 存进数组中
                    
                    self.$http.post('/mobile/wxchat/index', { uid: self.uid, did: self.did, type: 3, con: serverId  }).then(res => {
                        if (res.code == 1) {
                            self.onTextMsg(audios)  // 存进本地
                            self.$toast({
                                message: '语音发送成功',
                                position: 'middle',
                                duration: 1500
                            });
                        } else if (res.code == 5) {
                          if (self.isCode ==1 || self.isCode == 3 ) {
                            var dy = setTimeout(() => {
                              if (self.daoBox) {
                                clearInterval(self.daoBox); 
                              }
                              clearTimeout(dy)
                            }, 1000)
                          }
                          if (self.isCode == 2 || self.isCode == 4) {
                            var tim1 = setTimeout(() => {
                              if (self.timeBox) {
                                clearInterval(self.timeBox); 
                              }
                              self.viewTime = '';
                              clearTimeout(tim1)
                            }, 1000)
                          }
                          self.getHeadTitle()  // 接收消息更新信息
                          self.getBuyDay()
                        } else {
                            self.$toast({
                                message: res.msg,
                                position: 'middle',
                                duration: 2000
                            });
                        }
                    }).catch(err => { 
                        self.$toast({
                            message: '服务器错误',
                            position: 'middle',
                            duration: 2000
                        });
                     })
                  }
                });
              },
              fail: function (err) {
                self.$toast({
                    message: '语音发送失败',
                    position: 'middle',
                    duration: 2000
                });
              }
          });
            
          } else {
            // 取消不上传服务器
            
            wx.stopRecord({
              success: function (res) {}
            })
            console.log('取消上传')
          }
        },
        playRecordBtn: function (id) { 
            console.log(id)
            if (this.audioId == id) { //  停止播放
              this.audioId = ''
              wx.stopVoice({
                localId: id // 需要暂停的音频的本地ID，由stopRecord接口获得
              });
            } else {
              this.docAudioId = '';
              this.audioId = id  // 播放
              wx.playVoice({
                localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
              });
              this.PlayEnd() // 监听播放是否完毕
            }
        },
        PlayEnd () {
          var self = this;
          wx.onVoicePlayEnd({  // 监听语音播放完毕接口
            success: function (res) {
              var localId = res.localId; // 返回音频的本地ID
              self.audioId = '';
              // alert('ok')        // 监听成功
            }
          });
        },
        
        handleDialog (id, number) { // 提示: 是否结束问诊
            console.log(id, number)
            var self = this;
            self.$http.post('/mobile/Wxchat/doc_data', { did: id}).then(val => {
              console.log(val)
              if (val.code == 1) {
                  self.$dialog.confirm({
                    title: val.data.true_name+'医生申请结束问诊',
                    message: '若无其他咨询问题，请确认结束问诊',
                    cancelButtonText: '继续问诊',
                    confirmButtonText: '结束问诊',
                    className: 'vant-day-dialog'
                  }).then(() => {
                      self.$http.post('/mobile/WxSeeImage/user_consent_image_over', { number: number, is_ask_end: 3 }).then(res => {
                        console.log(res)
                        if (res.code == 1) {
                          if (self.timeBox) {
                            clearInterval(self.timeBox);
                            self.viewTime = ''
                          }
                          self.userMsg = false;
                          var as = setTimeout(() => {
                            self.getHeadTitle()       // 接收消息更新信息
                            clearTimeout(as)
                          }, 1000)
                          self.$toast({
                              message: '操作成功，已结束当前问诊',
                              position: 'middle',
                              duration: 3000
                          });
                        } else {
                            self.$toast({
                                message: res.msg,
                                position: 'middle',
                                duration: 3000
                            });
                        }
                      })
                  }).catch(() => {  // 继续问诊
                      self.$http.post('/mobile/WxSeeImage/user_consent_image_over', { number: number, is_ask_end: 4 }).then(res => {
                        console.log(res)
                        if (res.code == 2) {
                          self.isUserMsg = false
                          self.$toast({
                              message: '操作成功，请继续发送消息问诊',
                              position: 'middle',
                              duration: 3000
                          });
                        } else {
                            self.$toast({
                                message: res.msg,
                                position: 'middle',
                                duration: 3000
                            });
                        }
                      })
                  });
              } else {
                  self.$toast({
                      message: val.msg,
                      position: 'middle',
                      duration: 3000
                  });
              }
            })
            
        },
        handlePicture () {  // 打开上传图片
          if (this.onlines) {
              this.$toast({
                  message: '你未在线，请退出重新进入',
                  position: 'middle',
                  duration: 2000
              });
              return;
          }
            if (this.isbuyMsg) {  // 当前为付费问诊，您需要购买医生的问诊服务才可向医生咨询
                this.getBuyDay()  // 弹起提示支付框
              return;
            }
            if (this.isShow == true) {
                this.isShow = false
            }
            this.isPic = !this.isPic;
        },
        handleAudio () {  // 语音键盘切换
          this.audioShow = !this.audioShow         
        },
        animateWidth() {  // 文本框获取焦点的事件
          if (this.isShow == true) {
              this.isShow = false
          }
          if(this.isPic === true) {
            this.isPic = false
          }
          var u = navigator.userAgent;
          var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          if (isiOS) {
            setTimeout(function(){
              // document.body.scrollTop = document.body.scrollHeight;
              document.querySelector('textarea').scrollIntoView();
            },300)
          }
        },
        handleIconShow () { // 打开表情
          if(this.isPic === true) {
            this.isPic = false
          }
          this.isShow = !this.isShow;
          this.$refs.textMsg.blur();
        },
        handleIcon (type) { // 从子组件获取表情
          this.textVal += type
        },
       
      
        // 以下是环信
        // 这儿是环信的账号和密码登录   
      loginWebIM(pass) {     
          this.num ++;
          var _self = this;
          var options = { 
              apiUrl: WebIM.config.apiURL,   
              user: _self.userId,               
              pwd: pass,                       
              appKey: WebIM.config.appkey, 
              success: function (token) { 
                console.log('登录成功')
              },
              error: function (msg) {
                if (_self.num >= 5) {
                   _self.loginWebIM();
                } else {
                  _self.$toast({
                        message: '账户登录失败, 请退出重新进入登录',
                        position: 'middle',
                        duration: 3000
                    });
                }
                console.log('登录失败')
              }, 
          };
            this.$imConn.open(options);  // 登录
            this.$imConn.listen({
                 onOpened: function (message) {
                   _self.onlines = false;
                  console.log('用户已上线')
                },
                onClosed: function (message) {
                  _self.onlines = true;
                  console.log('用户已下线')
                },
                onTextMessage: function (message) { // 接收文本信息 
                    message.type = 'txt';
                    var ts1 = setTimeout(() => {
                        _self.getHeadTitle()          // 每次接收消息，进行接口查看， 是否变更，如果发生变更就更新头部信息
                        clearTimeout(ts1)
                    }, 1000)
                    console.log(message)
                    if (message.ext && message.ext.messageTig) {
                      message.from = ''
                    }
                    if (message.ext && message.ext.type == 301) {     // 医生发起结束问诊
                      _self.handleDialog(_self.did, message.ext.ext); 
                      return;
                    }
                    // if (message.ext && message.ext.type == 302) {     // 医生发起退款
                    //   _self.getHeadTitle()                            // 接收消息更新头部信息
                    //   return;
                    // }
                    if (message.delay) {  // 用户不在线的消息，不用显示
                      return;
                    }
                   _self.onTextMsg(message);
                },
                onEmojiMessage: function (message) {            // 这儿接收到了表情
                    message.type = 'emoji';
                    console.log(message)
                    var ts2 = setTimeout(() => {
                        _self.getHeadTitle()          // 每次接收消息，进行接口查看， 是否变更，如果发生变更就更新头部信息
                        clearTimeout(ts2)
                    }, 1000)
                    if (message.delay) { // 用户不在线的消息，不用显示
                      return;
                    }
                    _self.onTextMsg(message);
                },
                onPictureMessage: function (message) {  // 这儿接收到了图片
                  console.log(message)
                  var ts3 = setTimeout(() => {
                        _self.getHeadTitle()          // 每次接收消息，进行接口查看， 是否变更，如果发生变更就更新头部信息
                        clearTimeout(ts3)
                    }, 1000)
                  message.type = 'img';
                  if (message.delay) {  // 用户不在线的消息，不用显示
                    return;
                  }
                  _self.onTextMsg(message);
                },
                onAudioMessage: function ( message ) {      //收到音频消息
                  var ts4 = setTimeout(() => {
                        _self.getHeadTitle()          // 每次接收消息，进行接口查看， 是否变更，如果发生变更就更新头部信息
                        clearTimeout(ts4)
                    }, 1000)
                  console.log(message)
                  if (message.delay) {  // 用户不在线的消息，不用显示
                    return;
                  }
                  message.type = 'audio';
                  _self.onTextMsg(message);
                },   
                onFileMessage: function ( message ) {         //收到文件消息
                    console.log(message)
                },    
                onPresence: function ( message ) {        // 加入聊调室后，这儿会被执行
                  // console.log('这儿是监听聊天室')
                  _self.handlePresence(message);
                },
                onOnline: function () {},                     //本机网络连接成功
                onOffline: function () { alert('网络掉线') },  //本机网络掉线
                onError: function (err) { 
                  console.log(err)
                  if (err.type == 8) {
                    _self.$router.go(-1)
                  }
                    },  // 错误信息
                onCmdMessage: function ( message ) {},      //收到命令消息
                onLocationMessage: function ( message ) {},   //收到位置消息
            });
      },
      handleReply () { // 发送文本消息
        var sendText = this.textVal;
        var _self = this;
        // 将请求框置空
        // console.log(sendText.match(/^\s+$/g))     // 阻止空格和换行提交
        if (!sendText || sendText.match(/^\s+$/g)) {
            console.log('zuzhi')
            this.$toast({
                message: '请输入内容',
                position: 'middle',
                duration: 1500
            });
            return;
        } 
            console.log('jiao')
        if (this.onlines) {
              this.$toast({
                  message: '你未在线，请退出重新进入',
                  position: 'middle',
                  duration: 3000
              });
              return;
        }
        if (this.isbuyMsg) {  // 当前为付费问诊，您需要购买医生的问诊服务才可向医生咨询
            this.getBuyDay()  // 弹起提示支付框
            return;
        }
        if (this.isShow === true) {
          this.isShow = false
        }
         _self.$http.post('/mobile/wxchat/index', { uid: _self.uid, did: _self.did, type: 1, con:sendText, number: ''  }).then(res => { // 发送文本消息
              console.log(res)
               if (res.code == 1) {
                  _self.$toast({
                      message: '发送成功',
                      position: 'middle',
                      duration: 1500
                  });
              _self.textVal = '';
              var id = _self.$imConn.getUniqueId();    // 生成本地消息id
              var msg = new WebIM.message('txt', id); // 创建文本消息
              var option = {
                form: _self.userId,
                msg: sendText, // 这儿是发送的消息内容
                to: _self.docId,  // 接收消息对象(聊天室id) this.roomId
                roomType: false,
                chatType: 'chat',
            // 这儿的ext是自定义属性，安卓端可以根据这个属性获取信息（与安卓商量着来）
              ext: {
                yykChatId: _self.userId,
                yykIcon: _self.userPic?_self.userPic: '',
                yykName:  _self.userName,
              },
            success: function (id, serverMsgId) {
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
              msg.body.msg = renderTxt(msg.body.msg);
              var info = msg.body;
              _self.onTextMsg(info);
           
          },
          fail: function () {
            alert('信息发送失败');
          }
        };
            msg.set(option);
            msg.body.chatType = 'singleChat';
            _self.$imConn.send(msg.body);
            
          } else if (res.code == 5) {
            if (_self.isCode ==1 || _self.isCode == 3 ) {
              var d = setTimeout(() => {
                if (_self.daoBox) {
                  clearInterval(_self.daoBox); 
                }
                clearTimeout(d)
              }, 1000)
            }
            if (_self.isCode ==2 || _self.isCode == 4) {
              var tim2 = setTimeout(() => {
                if (_self.timeBox) {
                  clearInterval(_self.timeBox); 
                }
                _self.viewTime = '';
                clearTimeout(tim2)
              }, 1000)
            }
            _self.getHeadTitle()  // 接收消息更新信息
            _self.getBuyDay()
          } else {
            _self.$toast({
                message: res.msg,
                position: 'middle',
                duration: 3000
            });
          }
        }).catch(err => { console.log(err)})
    },

      onTextMsg (message) { // 把文本消息缓存
        var _self = this;
          _self.scrollToBottom();
          var timer = new Date().getTime();
          message.startTiem = timer;
          _self.msgContent.push(message);
          var userInfo = _self.$storage.get('chatRoomInfo_'+this.did),
              userMsg = [];
          if (userInfo) {
            userInfo.push(message);
            _self.$storage.set('chatRoomInfo_'+this.did, userInfo);
          } else {
              userMsg.push(message);
              _self.$storage.set('chatRoomInfo_'+this.did, userMsg);
          }
      },
    
      // 2、单聊发送图片消息
      sendPrivateImg: function (filePic) {
          var _self = this, files = filePic.files[0];
          this.shows = true;
          this.isPic = false;
          this.scrollToBottom();
          var base64Img = '';
          var reader = new FileReader();
          reader.onload = (e) => {
              base64Img = e.target.result;
          };
          reader.readAsDataURL(filePic.files[0]);
         
          var conn = this.$imConn;
          var id = conn.getUniqueId();                   // 生成本地消息id
          var msg = new WebIM.message('img', id);        // 创建图片消息
          var file = WebIM.utils.getFileUrl(filePic.input);      // 将文件转化为二进制文件
          var allowType = {
              'jpg': true,
              'png': true,
              'jpeg': true,
          };
          if (file.filetype.toLowerCase() in allowType) {
              var formdata = new FormData();
              formdata.append('uid', _self.uid)
              formdata.append('did', _self.did)
              formdata.append('type', 2)
              formdata.append('file', files)
              // formdata.append('number', '')
              _self.$http.formdata('/mobile/wxchat/index', formdata).then(res => {
                  if (res.code == 1) {
                     _self.$toast({
                        message: '发送成功',
                        position: 'middle',
                        duration: 1500
                    });
                  var option = {
                    apiUrl: WebIM.config.apiURL,
                    file: file,
                    to: _self.docId,                       // 接收图片对象
                    roomType: false,
                    ext: {
                      yykChatId: _self.userId,
                      yykIcon: _self.userPic?_self.userPic: '',
                      yykName:  _self.userName,
                    },
                    onFileUploadError: function (msg) {      // 图片上传失败
                        _self.shows = false;
                        // _self.$indicator.close();
                        console.log(msg)
                      //   _self.$toast({
                      //     message: '上传失败，请重新上传',
                      //     position: 'middle',
                      //     duration: 2000
                      // });
                    },
                    onFileUploadComplete: function (msg) {   // 图片上传成功
                        _self.shows = false;
                        // _self.$indicator.close();
                        msg.type = 'img';
                        msg.to = _self.docId;
                        msg.imgname = file;
                        msg.imgUrl = base64Img;
                        _self.onTextMsg(msg);
                    },
                    success: function (id) { },// 消息发送成功
                    flashUpload: WebIM.flashUpload
                  };
                  msg.set(option);
                  conn.send(msg.body);
                } else if (res.code == 5) {
                  if (_self.isCode ==1 || _self.isCode == 3 ) {
                    var d2 = setTimeout(() => {
                      if (_self.daoBox) {
                        clearInterval(_self.daoBox); 
                      }
                      clearTimeout(d2)
                    }, 1000)
                  }
                  if (_self.isCode == 2 || _self.isCode == 4) {
                    var tim3 = setTimeout(() => {
                      if (_self.timeBox) {
                        clearInterval(_self.timeBox); 
                      }
                      _self.viewTime = '';
                      clearTimeout(tim3)
                    }, 1000)
                  }
                  _self.getHeadTitle()  // 接收消息更新头部信息
                  _self.shows = false;
                  _self.getBuyDay()
                } else {
                  _self.shows = false;
                  _self.$toast({
                      message: res.msg,
                      position: 'middle',
                      duration: 2000
                  });
                }
            }).catch(err => {
                _self.shows = false;
                _self.$toast({
                    message: '服务错误',
                    position: 'middle',
                    duration: 2000
                });
            })
              
          } else {
              _self.shows = false;
             _self.$toast({
                  message: '请上传图片，jpg、png、jpeg格式',
                  position: 'middle',
                  duration: 2000
              });
            _self.$indicator.close();
          }
      },
      scrollToBottom() {  // 滚动到底
          this.TimeFun = setTimeout(()=>{
            //滚动条长度
            var currentDistance=this.$refs.xwBody.scrollHeight-this.$refs.xwBody.clientHeight;
            //当前滚动条距离顶部的距离
            var currentScroll_y = this.$refs.xwBody.scrollTop;
            if(currentDistance>0 && currentDistance>currentScroll_y){
                currentScroll_y=Math.ceil((currentDistance-currentScroll_y)/10)+currentScroll_y;
                currentScroll_y=currentScroll_y>currentDistance ? currentDistance: currentScroll_y;
                //微信和qq浏览器不支持 scrollTo？
                //this.$refs.xwBody.scrollTo(0,currentScroll_y);
                this.$refs.xwBody.scrollTop = currentScroll_y;
                this.scrollToBottom();
            }
        },13);
      },

     
      // 历史记录处理
      docAmrPlayAmr (url) { // 医生音频播放
              if (!url) {
                return;
              }
              var self = this;
              if (self.docAudioIds == url) {
                self.docAudioIds ='';
              }
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
        onRefresh () {
          setTimeout(() => {
            this.$toast('无更多数据');
            this.isLoading = false;
          }, 500);
        },
        chatHistory () {  // 聊天历史记录
          var self = this;
          console.log(this.uid,this.did)
          this.$http.post('/mobile/Wxchat/chat_pu', { uid:this.uid, did:this.did }).then(res => {
            console.log(res)
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
                this.$nextTick (() => { // 进入聊天，初始化
                    var msg = this.$refs.xwBody;
                    if (msg) {  // childrenMsg
                      msg.scrollTop = msg.scrollHeight;
                      this.scrollToBottom();
                    }
                })
            } else {
              self.historyList = []
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
      zhengTimer (time) { // 问诊中时间，倒计时 24 小时
          var self = this;
            if (!time) {
              return;
            }
            function ot (v) {
                if (v < 10) {
                    v = '0'+v
                }
                return v
            }
            var now = new Date().getTime();  
            var end = new Date(time*1000+1000*60*60*24);
            var date = Math.floor((end - now)/1000);
            console.log(date)
            if (Number(date) > 86400) {
              date = 86399
            }
            if (self.timeBox) {
              clearInterval(self.timeBox); 
            }
            this.timeBox = setInterval(subs, 1000);
            function subs(){
                if (date>1) {
                    date = date - 1;
                    var s = Math.floor(date % 60);     
                    var m= Math.floor((date / 60) % 60); 
                    var h = Math.floor(date/60/60%24);
                    self.viewTime = ot(h)+':'+ot(m)+':'+ot(s)
                } else{
                    //这里可以添加倒计时结束后需要执行的事件
                    self.userMsg = '';
                    self.isbuyMsg = true;
                    self.isUserMsg = true;  // 页面展示，问诊结束
                    self.getBuyDay()
                    clearInterval(self.timeBox);
                }
            };
        },
        timerOrder: function(fw) {   // 待回复 30分钟倒计时
            if (!fw) {
                return;
            }
            var self = this;
            var now= new Date().getTime();  
            var end= new Date(fw*1000+30*60*1000); 
            var result=Math.floor((end-now)/1000);
            if (Number(result) > 1800) {
              result = 1799
            }
            if (self.daoBox) {
              clearInterval(self.daoBox); 
            }
            self.daoBox =setInterval(sub,1000); //定时器 调度对象
            function sub(){
                if (result>1) {
                    result = result - 1;
                    var second = Math.floor(result % 60);     
                    var minite = Math.floor((result / 60) % 60); 
                    second = second < 10 ? '0'+second : second;
                    minite = minite < 10 ? '0'+minite : minite;
                    self.daoTime = minite + ':' + second
                } else{
                    //这里可以添加倒计时结束后需要执行的事件
                    clearInterval(self.daoBox); 
                    self.daoMsg = false;
                    self.isbuyMsg = true; 
                    self.initDialogMsg()        // 结束调取接口状态
                }
            };
        },
      // hxMsgUserInfo (n) { // 模板推送
      //     var self = this;
      //     self.isbuyMsg = true;
      //     var txts = '';
      //     if (n == 1) {
      //       txts = '—— 超过30min未回复，系统自动退诊 ——'
      //     } else if (n == 2) {
      //       txts = '—— 付费问诊已结束 ——'
      //     } else {
      //       txts = ''
      //     }
      //     var id = self.$imConn.getUniqueId();    // 生成本地消息id
      //     var msg = new WebIM.message('txt', id); // 创建文本消息
      //     var option = {
      //       form: self.userId,
      //       msg: '', // 这儿是发送的消息内容
      //       to: self.docId,  // 接收消息对象(聊天室id) this.roomId
      //       roomType: false,
      //       chatType: 'chat',
      //       // 这儿的ext是自定义属性，安卓端可以根据这个属性获取信息（与安卓商量着来）
      //       ext: {
      //         messageTig: txts,
      //         yykChatId: self.userId,
      //         yykIcon: self.userPic?_self.userPic: '',
      //         yykName:  self.userName,
      //       },
      //       success: function (id, serverMsgId) {
      //         console.log(msg.body)
      //         msg.body.to = '';       // 去掉自己推送的头像判断条件
      //         self.onTextMsg(msg.body);
      //       },
      //       fail: function () {
      //         alert('信息发送失败');
      //       }
      //     };
      //     msg.set(option);
      //     msg.body.chatType = 'singleChat';
      //     this.$imConn.send(msg.body);
      // }
      getHeadTitle () { // 获取对话框信息, 及时更新头部信息
          /**
           *  0=>’缺少参数
              1=>图文问诊未回复
              2=>图文问诊问诊中
              3=>阅片服务未回复
              4=>阅片服务问诊中
              7=>免费问诊
              8=>付费问诊->已用尽->患者需支付金额再次问诊
              9=>付费问诊->有免费天数
              10=>付费问诊->有免费条数
              11=>付费问诊->有免费条数 天数
              12=>付费问诊->未设置免费次数
              110=>暂无信息展示
           */
          var self = this;
          var obj = {did: this.did, uid: this.uid};
          this.$http.post('/mobile/wxchat/user_title', obj).then(res => {
            if (res.code && self.isCode == res.code) {
                // 如果存在并且相等就不需要改变，反之就进行改变
              return;
            }
            if (self.timeBox) {
              clearInterval(self.timeBox); 
            }
            if (self.daoBox) {
              clearInterval(self.daoBox); 
            }
            self.isCode = res.code;
            console.log(res)
            if (res.code == 1) {  // 图文问诊
              this.userMsg = '';
              this.isbuyMsg = false;
              self.timerOrder(res.inquiry_time)
              self.daoMsg = true
            } else if (res.code == 2) {
              this.zhengTimer(res.inquiry_time);
              this.userMsg = '付费问诊中';
              this.isbuyMsg = false;
              self.daoMsg = false;
            } else if (res.code == 3) { // 付费问诊
              this.userMsg = '';
              this.isbuyMsg = false;
              self.timerOrder(res.inquiry_time)
              self.daoMsg = true
            } else if (res.code == 4) {
              self.daoMsg = false;
              this.isbuyMsg = false;
              this.zhengTimer(res.inquiry_time);
              this.userMsg = '阅片服务中';
            } else if (res.code == 7) {
              self.daoMsg = false;
              this.isbuyMsg = false;
              this.userMsg = '当前为免费问诊，咨询医生的问题数量无限制';
            } else if (res.code == 8) { 
              this.userMsg = '';
              self.daoMsg = false;
              this.isbuyMsg = true;
              // self.isUserMsg = true;  // 页面展示，问诊结束
              this.getBuyDay()
            } else if (res.code == 9) {
              self.viewTime = '';
              self.daoMsg = false;
              this.userMsg = '当前为付费问诊，您有'+res.sky+'天免费时间可向医生发送消息';
            } else if (res.code == 10) {
              self.userUpInfo = res.num;
              self.daoMsg = false;
              self.viewTime = ''
              this.userMsg = '当前为付费问诊，您可免费向医生发送'+res.num+'条消息';
            } else if (res.code == 11) {
              self.userUpInfo = res.num;
              self.daoMsg = false;
              self.viewTime = '';
              this.userMsg = '当前为付费问诊，您可在'+res.sky+'天内向医生发送'+res.num+'条消息';
            } else if (res.code == 12) {
              this.userMsg = '';
              self.daoMsg = false;
              this.isbuyMsg = true;
              this.getBuyDay()
            } else {
              self.daoMsg = false;
              this.isbuyMsg = false;
              this.userMsg = '';
            }
          }).catch(err => {
              self.$toast({
                  message: '服务器错误，无法服务',
                  position: 'middle',
                  duration: 3000
              });
          })
        },
  },
  beforeDestroy () {
      if (this.timeBox) {
        clearInterval(this.timeBox);
      }
      var storage = this.$storage.del('chatRoomInfo_'+this.did)
      if (storage) {
        this.$storage.del('chatRoomInfo_'+this.did)
      }
      if (this.TimeFun) {
        clearTimeout(this.TimeFun);
      }
      if (this.daoBox) {
        clearInterval(this.daoBox); 
      }
      
  },
  destroyed () {
    this.$imConn.close();
    this.$indicator.close();
  },
  
  filters: {
      chatTime (time) {
        if (!time) {
            return;
        }
          var date = new Date(time);
          var now = new Date();
          var dateNumFun = (num) => num < 10 ? '0' + num : num 
            var Y = date.getFullYear(),
               M = dateNumFun(date.getMonth() + 1),
               D = dateNumFun(date.getDate()),
               h = dateNumFun(date.getHours()),
               m = dateNumFun(date.getMinutes());
          return h+':'+m
      }
  }
}
</script>

<style lang="scss">
@function rem($px) {
  @return $px / 100 + rem;
}
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
          
</style>

<style lang='scss' scoped>
@function rem($px) {
  @return $px / 100 + rem;
}
.bounce-enter-active {
  animation: bounce-in .3s;
}
.bounce-leave-active {
  animation: bounce-in .3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.user-msg-title {
  width: 100%;
  text-align: center;
  font-size: rem(24);
  color: #808080;
  margin-top: rem(20);
}
.index {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    .chat-head-msg {
        width: 100%;
        padding: rem(25) rem(33);
        background: #FFF5F2;
        color: #FF9A83;
        font-size: rem(24);
        line-height:rem(47);
    }
    .content_box {
        width: 100%;
        background: #F5F5F7;
        overflow-y: scroll;
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
        .content {
          width: 100%;
          padding: rem(24);
          
          
        
        .ImgLoading {
              width: 100%;
              margin-top: rem(30); 
              margin-bottom: rem(30);
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
                      background-color: #fff;
                      color: #fff;
                    }
                    .msg:after {
                      content: '';
                      border-width: rem(10);
                      border-style: solid;
                      border-color: #fff transparent transparent transparent;
                      position: absolute;
                      right: rem(-18);
                      top: rem(10);
                      transform: rotate(-90deg);
                    }
                }
            }

            .dayEnd {
              width: 100%;
              margin-top: rem(50);
              text-align: center;
              color: #808080;
              font-size: rem(24);
            }
        }
    }
    .footer {
        width: 100%;
        min-height: rem(100);
        background-color: #F0F0F2;
        ul {
          padding: 0 rem(30);
          li {
            .audio-icon {
                display: inline-block;
                width: rem(60);
                height: rem(60);
                background: url('../../common/images/icon/icon_yyjp@2x.png') no-repeat;
                background-size: cover;
                margin-right: rem(15);
                margin-top: rem(10);
            }
            .jianpan-icon {
                display: inline-block;
                width: rem(60);
                height: rem(60);
                background: url('../../common/images/icon/icon_xiaojp@2x.png') no-repeat;
                background-size: cover;
                margin-right: rem(15);
                margin-top: rem(10);
            }
          }
          .audioInput {
              margin-top: rem(20);
              padding: 0 rem(30);
              height: rem(60);
              >button {
                width: 100%;
                border:0;
                height: rem(50);
                line-height: rem(50);
                text-align: center;
                background-color: #fff;
              }
              .btnactive {
                background-color: #DEDEE0;
              }
          }
          .contentTxt {
              margin-top: rem(15);
              textarea {
                padding: rem(10) rem(20) 0;
                font-size: rem(30);
                height: rem(68);
                line-height: rem(36);
                max-height: rem(100);
                color: #3c3c3c;
                background-color: #fff;
                resize: none;
                -webkit-border-radius: rem(8);
                border-radius: rem(8);
                border: 1px solid #ddd;
                -webkit-appearance: none;
              }
              .tb-icon {
                  display: inline-block;
                  width: rem(60);
                  height: rem(60);
                  margin: rem(6) rem(20);
                  background: url('../../common/images/icon/icon_xxlian@2x.png') no-repeat;
                  background-size: cover;
              }
          }
          .btn {
            margin-top: rem(10);
              button {
                height: rem(60);
                font-size: rem(28);
                background-color: #3196FF;
                color: #fff;
              }
              .btn-utils {
                img {
                  width: rem(60);
                  display: block;
                }
              }
            }
        }
    }



    .mask{
          width: 43%;
          background: rgba(0,0,0,0.1);
          padding: 1rem 0 1rem 0;
          position: fixed;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          font-size: rem(28);
          img{
                display: block;
                width:40%;
                margin: auto;
            }
          p{
              margin-top: rem(20);
              text-align: center;
              font-size: rem(28);
              color: rgba(0,0,0,0.5);
          }
    }
          
}
.model-shade {
      position: fixed;
      left: 0;
      top: 0;
      background: #000;
      width: 100%;
      height: 100%;
      > img {
        max-width: 100%;
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
