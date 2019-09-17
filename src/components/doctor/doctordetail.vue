<template>
    <!-- 医生详情 -->
    <div class="doctor dis_f flex_d">
        <div v-wechat-title="datalist.true_name+'的工作室'"></div>
        <div class="section flex1">
            <div >
                <div class="list">
                    <ul>
                        <li>
                            <img ref='userImg' src="../../common/img/pic_wdys_ystx.png" alt=""/>
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
                        <li class="list_intro " :class='{"f_hide":show}'>
                            <div id="introduce">
                                <p :class="{'p':isTxt}">
                                    医生简介：{{ datalist.introduction }}
                                </p>
                            </div>
                            <div class="arrows" v-show='isTxt'>
                                <span v-show='show' @click='shows'><img src="../../common/img/icon_zk.png" alt="" /></span>
                                <span v-show='!show' @click='shows'><img src="../../common/img/icon_sq.png" alt="" /></span>
                            </div>
                        </li>
                    </ul>
                     <div class="server">
                         <h4>开通服务</h4>
                         <!-- <ul class="server_ul">
                             <li @click='doctordata'>
                                 <img src="../../common/img/icon_zxwz.png" alt=""/>
                                 <div>
                                     <h5>付费问诊  
                                         <span>￥ 50/次</span>
                                    </h5>
                                     <p>注：支付成功后可与医生实时沟通，24h小时有效</p>
                                 </div>
                                 <span class="server_right"><img src="../../common/img/icon_enter.png" alt=""/></span>
                             </li>
                         </ul> -->
                          <ul class="server_ul">
                             <li @click='imageTxtPay(datalist.text_cost)'>
                                 <img src="../../common/img/icon_zxwz.png" alt=""/>
                                 <div>
                                     <h5>图文问诊
                                        <span><b>￥</b>{{ datalist.text_cost }}/次</span>
                                    </h5>
                                     <p>支付成功后可与医生实时沟通，24h以内有效</p>
                                 </div>
                                 <span class="server_right"><img src="../../common/img/icon_enter.png" alt="" /></span>
                             </li>
                         </ul>
                          <ul class="server_ul">
                             <li @click='readingPay(datalist.image_cost)'>
                                 <span class="yp"></span>
                                 <div>
                                     <h5>阅片服务 
                                        <span><b>￥</b>{{ datalist.image_cost }}/次</span>
                                    </h5>
                                     <p>专家看影像，根据影像提供诊疗建议，默认时长24h</p>
                                 </div>
                                 <span class="server_right"><img src="../../common/img/icon_enter.png" alt="" /></span>
                             </li>
                         </ul>
                         <ul class="server_ul">
                             <li @click='handleClick'>
                                 <span class='bg-pic'></span>
                                 <div>
                                     <h5>他的店铺</h5>
                                     <p>商品甄选，名医直达</p>
                                 </div>
                                 <span class="server_right"><img src="../../common/img/icon_enter.png" alt="" /></span>
                             </li>
                         </ul>
                     </div>

                    <div class="doctor_Time">
                        <h1>预约医生门诊</h1>
                        <div class="doc_msgs" v-if='!code'>
                            <img src="../../common/img/pic_zwktxxmz.png" alt="" />
                            <p>该医生暂未开通线下门诊服务</p>
                        </div>
                        <div class="hebdomad_time" v-if='code'>
                            <div class="time_box">
                                <table cellpadding="0" cellspacing="0" border='0'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th v-for='(val, i) in TimeAll' :id='val.id'>
                                                {{ val.week }}
                                                {{ val.date }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr id='sw'>
                                            <td>上午</td>
                                            <td v-for='(val, i) in TimeAll' @click='tableClick($event, val)' 
                                                :data-id='val.id'
                                                :data-time="val.time"
                                                data-type="1"
                                                :data-week="val.week"
                                                :data-date="val.date"
                                            ></td>
                                        </tr>
                                        <tr id='xw'>
                                            <td>下午</td>
                                            <td v-for='(val, i) in TimeAll' @click='tableClick($event, val)'
                                            :data-id='val.id'
                                            :data-time="val.time"
                                            data-type="2"
                                            :data-week="val.week"
                                            :data-date="val.date"
                                            ></td>
                                        </tr>
                                        <tr id='ws'>
                                            <td>晚上</td>
                                            <td v-for='(val, i) in TimeAll' @click='tableClick($event, val)'
                                                :data-id='val.id'
                                                :data-time="val.time"
                                                data-type="3"
                                                :data-week="val.week"
                                                :data-date="val.date"
                                            ></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="time_frame">
                                <p>上午时段 8:00-12:00 / 下午时段 13:00-18:00</p>
                                <p>晚上时段 18:00-24:00</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="footer dis_f">
            <mt-button type="primary" :class="isClose ? 'button1' : 'dian'" size="large" @click.native="handleClick">他的店铺</mt-button>
            <mt-button type="primary" id='btnout' v-show="isClose" size="large" @click.native="handleClick4">关注医生</mt-button>
            <!-- <mt-button type="primary" v-show='!btnShow' id='btnout' size="large" @click.native="handleClick2">在线问诊</mt-button>
            <mt-button type="primary" v-show='btnShow' class="btnTime" size="large" @click.native="handleClick3">
                <span>继续问诊</span>
                <p>剩余时间：10:00:09</p>
            </mt-button> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'doctordetail',
    data () {
        return {
            datalist: {
                true_name: '医生'
            },
            show: true,                             // 显示医生简介
            btnShow: true,                          //  是否支付，来进行按钮切换操作
            lng: '',                                // 经度
            lat: '',                                // 纬度
            uid: this.$cookie.get('userLogins'),    // 用户id
            did: '',                                // 医生id
            isClose: true,
            index: this.$route.params.index,
            isTxt: false,                           // 控制箭头显示
            timeList: '',                           // 时间列表
            code: false,
            TimeAll: [],                            // 时间列表
            TimeInterval: ['上午 8:00-12:00', '下午 13:00-18:00', '晚上 18:00-24:00'], 
            docTimeMsg: [],                         // 医生排班
            docClose: [],                           // 医生停诊
            ting_Time: '',                          // 停诊时间
        }
    },
    beforeCreate () {
        this.$indicator.open({
            text: '',
            spinnerType: 'fading-circle'
        });
    },
    beforeDestroy () {
        this.$indicator.close();
    },
    mounted() {
        this.did = this.$route.query.id
        this.initdata()
    },
    watch: {
        "$route" : 'imageTxtPay'
    },
    updated () {
        var self = this;
        var Time = this.docTimeMsg
        var close = this.docClose
        // console.log(Time, close)
        // 可约 和 约满
        self.docYue(Time) // 可约展示
    
      //已停诊
    //   for (var k=0; k<this.TimeAll.length;k++) {
    //     for (var c=0; c<close.length; c++) {
    //         var d = new Date(close[c].close_days * 1000);
    //         var tMonth = d.getMonth();
    //         var tDate = d.getDate();
    //         tMonth = self.DoHandleMonth(tMonth + 1);
    //         tDate = self.DoHandleMonth(tDate);
    //         var id = tMonth + "-" + tDate;
    //         var index = $("#" + id).index();
    //         if (close[c].close_time == 1 && id == this.TimeAll[k].id) {
    //         //上午
    //         $("#sw>td").eq(index).addClass("tz");
    //         } else if (close[c].close_time == 2 && id == this.TimeAll[k].id) {
    //         //下午
    //         $("#xw>td").eq(index).addClass("tz");
    //         } else if (close[c].close_time == 3 && id == this.TimeAll[k].id) {
    //         //晚上
    //         $("#ws>td").eq(index).addClass("tz");
    //         }
    //     }
    //   }
      
     
        
      
    
    },
    methods: {
        docYue (Time) {   // 遍历医生可约的数据
            var self = this;
            var time_all = this.TimeAll;
            for (var i=0; i< time_all.length; i++) {
                for (var j=0; j<Time.length; j++) {
                    var d = new Date(Time[j].days * 1000);
                    var tMonth = d.getMonth();
                    var tDate = d.getDate();
                    tMonth = self.DoHandleMonth(tMonth + 1);
                    tDate = self.DoHandleMonth(tDate);
                    var id = tMonth + "-" + tDate;
                    var index = $("#" + id).index();
                    if (Time[j].time == 1 && time_all[i].id === id) {
                        if (Time[j].alreadynum == Time[j].num) {
                            $("#sw>td").eq(index).addClass("ym");
                        } else {
                             $("#sw>td").eq(index).addClass("ky");
                        }
                    }
                    else if (Time[j].time == 2 && id === time_all[i].id) {
                        if (Time[j].alreadynum == Time[j].num) {
                            $("#xw>td").eq(index).addClass("ym");
                        } else {
                             $("#xw>td").eq(index).addClass("ky");
                        }
                    } 
                   else if (Time[j].time == 3 && id === time_all[i].id) {
                        if (Time[j].alreadynum == Time[j].num) {
                            $("#ws>td").eq(index).addClass("ym");
                        } else {
                            $("#ws>td").eq(index).addClass("ky");
                        }
                    } 
                }
            }
        },
        initdata () { // 获取医生信息
            var self = this;
            this.$http.post('/mobile/wxdoccenter/doctor_detail', {did:this.did, uid: this.uid}).then(res => {
                console.log(res)
                self.$indicator.close();
                if (res.code == 1) {
                    self.datalist = res.data
                    if (self.datalist.picture) {
                        self.$refs.userImg.src = self.$http.baseURL + self.datalist.picture
                    }
                    if (res.data.relevance == 1) {
                        self.isClose = false
                    }
                    self.$nextTick(() => {
                        var p = document.getElementById('introduce').offsetHeight
                       
                        if (p > 84) {
                            self.isTxt = true
                        } else {
                            self.isTxt = false
                        }
                    })
                }
            })

            var selectAll = [], dayNum = 0;
            this.$http.post('/mobile/Wxregistration/doc_scheduling', { did:this.did, }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    if (res.data.business == 1) {
                        self.code = true
                    } else {
                        self.code = false
                    }
                    this.ting_Time = res.data.clost_time
                    this.docTimeMsg = res.data.msg
                    this.docClose = res.data.close
                    dayNum = 14;
                    var num = Number(new Date().getDay())
                    dayNum = dayNum - num
                    for (var i=0; i < dayNum; i++) {
                        (function (n) {
                            selectAll.push(self.getDates(n))
                        })(i)
                    }
                    // console.log(selectAll)
                    self.TimeAll = selectAll
                } else {
                    self.code = false
                }
            })
        },
        handleClick() {     // 进入医生店铺
            this.$router.push({ name: 'doctorshop', params: {id: this.did, index: this.index }})
        },
        handleClick2() {    // 在线问诊按钮
            console.log('haha222')
        },
        handleClick3 () {   // 已开通问诊，在有效的时间随时可以问诊
            
        },
        handleClick4 () {   // 关注按钮
            var obj = { did: this.did, uid: this.uid}
            this.$http.post('/mobile/wxdoccenter/relevance_doctor', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.$messagebox.confirm('<p style="color:#333;">你已成功关注了此医生，返回后点击我的医生，即可向医生咨询问题</p>', {showCancelButton: false, confirmButtonText: '确定'}).then(action => {
                        
                    });
                    this.isClose = false
                } else {
                    this.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
        },
        Return () {
            this.$router.back()
        },
        shows () {
            this.show = !this.show
        },
        doctordata () {     //  医生问诊
            this.$toast({
                message: '暂未开通医生问诊服务',
                position: 'middle',
                duration: 2000
            });
        },
        getDates (day) {
            var today = new Date();
            var weekdata = ['周日', '周一','周二', '周三', '周四', '周五', '周六'];
            var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            var tYear = today.getFullYear();
            var tMonth = today.getMonth();
            var tDate = today.getDate();
            tMonth = this.DoHandleMonth(tMonth + 1);
            tDate = this.DoHandleMonth(tDate);
                
            return {
                date: tMonth + "." + tDate,
                id: tMonth + "-" + tDate,
                time: parseInt(targetday_milliseconds / 1000),
                month: tMonth + "月" + tDate + '日',
                week: weekdata[today.getDay()]
            }
        },
        DoHandleMonth (num) {
            if (num < 10) {
                return '0' + num;
            } 
            return '' + num
        },
        tableClick (e, k) {   // 对可预约 点击
            var _this = e.target;
            var self = this;
            // if (this.ting_Time) {
            //     // var today = new Date((this.ting_Time.start_time)*1000);
            //     var today = new Date((1559664000)*1000);
            //     var tMonth = this.DoHandleMonth(today.getMonth() + 1);
            //     var tDate = this.DoHandleMonth(today.getDate());
            //     console.log(tMonth+'.'+tDate)
            //     var starts = tMonth+'.'+tDate
            //     // var today_end = new Date((this.ting_Time.end_time)*1000);
            //     var today_end = new Date((1559923200)*1000);
            //     var tMonth1 = this.DoHandleMonth(today_end.getMonth() + 1);
            //     var tDate1 = this.DoHandleMonth(today_end.getDate());
            //     var ends = tMonth1+'.'+tDate1
            //     console.log(tMonth1+'.'+tDate1)
            //     console.log(k)
            //     if(k.date >= starts && k.date <= ends) {
            //         this.$toast({
            //             message: '医生已设置停诊服务',
            //             position: 'middle',
            //             duration: 2000
            //         });
            //         return;
            //     }
            // }
            if (!hasClass(_this,'ky')) {
                return;
            }
            
            var num = _this.getAttribute('data-type');   // 获取 上 下 晚
            var day = _this.getAttribute('data-time');   // 获取 秒
            var type = this.TimeInterval[(num-1)];
            var date = _this.getAttribute('data-id')
            var price = 0, pz = '', pzName = '', rid = '';
            this.docTimeMsg.map(function (v,i) {
                var d = new Date(v.days * 1000);
                var tMonth = d.getMonth();
                var tDate = d.getDate();
                tMonth = self.DoHandleMonth(tMonth + 1);
                tDate = self.DoHandleMonth(tDate);
                var id = tMonth + "-" + tDate;
                if (v.time == num && id == date) {
                    price = v.money;
                    pz = v.type
                    rid = v.rid
                }
            })
            if (pz == 1) {
                pzName = '普通门诊'
            } else if (pz == 2) {
                pzName = '专家门诊'
            }
           
                this.$messagebox.confirm('<p style="color:#333;">'+k.month+' '+k.week+' '+type+'<br/>'+pzName+' '+price+'元</p>', '预约信息').then(action => {
                    self.$indicator.open({
                        text: '',
                        spinnerType: 'fading-circle'
                    });
                    var obj = { did: this.did, uid: this.uid, day: day, time: num }
                    console.log(obj)
                    this.$http.post('/mobile/Wxregistration/number_lock', obj).then(res => {
                        console.log(res)
                        self.$indicator.close();
                        if (res.code == 1) {
                            this.$router.push({ path: '/yuyuedoc', query: { did: self.did, day: day, time: num, order_code: res.order_code }})
                        } else if (res.code == 6) {
                            this.$toast({
                                message: res.msg,
                                position: 'middle',
                                duration: 2000
                            });
                        var t = setTimeout(() => {
                                this.$router.push({path: '/payDetails', query: { rid: res.rid }})
                                clearTimeout(t)
                            }, 1000)
                        } else {
                            this.$toast({
                                message: res.msg,
                                position: 'middle',
                                duration: 2000
                            });
                        }
                    })
                    
                }).catch(cancel => {})
        },
        imageTxtPay (money) {   // 图文问诊
            if (this.datalist.is_text_inquiry >= 1) {
                this.$indicator.open({
                    text: '',
                    spinnerType: 'fading-circle'
                });
                console.log('已开通')
                this.$router.push({ path: '/chatroom', query: { did: this.did, uid: this.uid } })
            } else {
                if (money > 0) {
                    // 购买支付
                    console.log('付费')
                    this.$router.push({ path: '/buyWebImInfo', query: { did: this.did, uid: this.uid } })
                } else {
                    this.$indicator.open({
                        text: '',
                        spinnerType: 'fading-circle'
                    });
                    console.log('免费')
                    this.$router.push({ path: '/chatroom', query: { did: this.did, uid: this.uid } })
                }
            }
        },  
        readingPay (money) { // 阅片问诊, 进入影像
            if (this.datalist.is_image_inquiry >= 1) {
                this.$indicator.open({
                    text: '',
                    spinnerType: 'fading-circle'
                });
                this.$router.push({ path: '/chatroom', query: { did: this.did, uid: this.uid } })
            } else {
                this.$router.push({ path: '/searchImage', query: { did: this.did, uid: this.uid, status: 1, money: money } })
            }
        }
    }
}

function hasClass( elements,cName ) {
    return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
};
    function addClass( elements,cName ) {
    if(!hasClass( elements,cName )){
        elements.className += " " + cName;
    };
};
function removeClass(elements,cName) {
    if(hasClass( elements,cName ) ){
        elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" )," " ); // replace方法是替换
    };
};

</script>

<style>

</style>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.doctor {
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    font-size: rem(14);
    
    .section {
        width: 100%;
        font-size: rem(14);
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .list {
            width: 100%;
            font-size: rem(12);
            >ul {
                padding: rem(12);
                width: 100%;
                background:rgba(255,255,255,1);
                border-radius:4px;
                li:first-child {
                    display: -webkit-flex;
                    display: flex;
                    >img {
                        display: block;
                        width: rem(49);
                        height: rem(49);
                        border-radius: 50%;
                    }
                    >dl {
                        -webkit-box-flex: 1;              
                        -moz-box-flex: 1;                 
                        -webkit-flex: 1;                    
                        -ms-flex: 1;  
                        flex: 1;
                        padding-left: rem(15);
                        dt {
                            line-height: rem(30);
                            span {
                                margin-right: rem(5);
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
                    padding-left: rem(20);
                    background: url('../../common/img/icon_scs.png') no-repeat left top;
                }
                .list_intro {
                   margin-top: rem(15);
                   color: #808080;
                   position: relative;
                   padding-bottom: rem(10);
                   background: #fff;
                   #introduce {
                       >p {
                            line-height: rem(20);
                            padding-left: rem(20);
                            background: url('../../common/img/icon_ysjj.png') no-repeat left top;
                        }
                   }
                   .arrows {
                       span {
                        width: 100%;
                        display: block;
                        position: absolute;
                        bottom: rem(-13);
                        left: 0;
                        text-align: center;
                        img {
                            width: rem(20);
                        }
                    }
                   }
                   
                }
                .f_hide {
                    .p{position: relative; line-height: rem(20); max-height: 80px;overflow: hidden;}
                    // .p::after{content: "..."; position: absolute; bottom: 0; right: 0; padding-left: rem(30);
                    //     background: -webkit-linear-gradient(left, transparent, #fff 50%);
                    //     background: -o-linear-gradient(right, transparent, #fff 50%);
                    //     background: -moz-linear-gradient(right, transparent, #fff 50%);
                    //     background: linear-gradient(to right, transparent, #fff 50%);
                    // }
                }

            }

        .server {
            width: 100%;
            border-radius:4px;
            margin-top: rem(10);
            background: #FFF;
            padding: 0 rem(12);
            h4 {
                padding: rem(15) rem(12);
                // border-bottom: 1px solid #E6E6E6;
                color: #333;
                font-size: rem(16);
                font-weight:500;
                }
                .server_ul {
                    width: 100%;
                    position: relative;
                    border-top: 1px solid #F0F0F0;
                    li {
                        -webkit-display: flex;
                        display: flex;
                        padding: rem(15) 0;
                        >img {
                            width: rem(40);
                            height: rem(40);
                        }
                        .yp {
                            display: inline-block;
                            width: rem(40);
                            height: rem(40);
                            background: url('../../common/img/icon_ysdp@2x.png') no-repeat;
                            background-size: cover;
                        }
                        .bg-pic {
                            display: inline-block;
                            width: rem(40);
                            height: rem(40);
                            background: url('../../common/img/icon_ysdp.png') no-repeat;
                            background-size: cover;
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
                                    font-size: rem(15);
                                    margin-left: rem(14);
                                    b {
                                        font-size: rem(12);
                                    }
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
                            right: 0;
                            top: 30%;
                            > img {
                                width: rem(35);
                                font-size: rem(9);
                            }
                        }
                    }
                }
            }

            .doctor_Time {
                width: 100%;
                background: #FFF;
                margin-top: rem(10);
                padding: rem(16) rem(12);
                > h1 {
                    font-size: rem(16);
                    font-weight: 500;
                    line-height: rem(20);
                    padding-bottom: rem(15);
                }
                .doc_msgs {
                    width: 100%;
                    text-align: center;
                    img {
                        height: rem(70);
                        height: rem(70);
                    }
                    p {
                        margin-top: rem(13);
                        text-align: center;
                        color: #808080;
                        font-size: rem(13);
                    }
                }

                .hebdomad_time {
                    width: 100%;
                    position: relative;
                    margin-bottom: rem(10);
                    .time_box {
                       overflow-x:scroll;
                        overflow-y: hidden;
                        -webkit-overflow-scrolling: touch;
                    table {
                        margin-left: rem(41);
                        border-collapse: collapse;
                        thead {
                            tr {
                                height: rem(36);
                                line-height: rem(18);
                                font-weight: 600;
                                
                                th {
                                    min-width: rem(41);
                                    min-height: rem(36);
                                    max-width: rem(41);
                                    max-height: rem(36);
                                    border: 1px solid #EBEBEB;
                                    font-weight: 600;
                                    color: #202020;
                                }
                                th:nth-child(2) {
                                    border-left: 0;
                                }
                            }
                            tr:first-child {
                                th:first-child {
                                    position: absolute;
                                    left: 0;
                                    top:0;
                                    background-color: #fff;
                                    border-bottom: 0;
                                }
                                
                            }
                        }
                        tbody {
                            tr {
                                text-align: center;
                                height: rem(36);
                                line-height: rem(36);
                                td {
                                    min-width: rem(41);
                                    min-height: rem(36);
                                    max-width: rem(41);
                                    max-height: rem(36);
                                    border: 1px solid #EBEBEB;
                                    color: #202020;
                                }

                                td.active {
                                    background: #469AF4;
                                }
                                td.ym {
                                    background: #CCC;
                                }
                                td.ky {
                                    background: #469AF4;
                                }
                                td.tz {
                                    background-color: orange;
                                }
                                td.ym::after {
                                   content: '约满';
                                    color: #FFF;
                                    font-size: rem(11);
                                }
                                td.active::after {
                                    content: '已约';
                                    color: #FFF;
                                    font-size: rem(11);
                                }
                                td.ky::after {
                                    content: '可约';
                                    color: #FFF;
                                    font-size: rem(11);
                                }
                                td.tz::after {
                                    content: '停诊';
                                    color: #FFF;
                                    font-size: rem(11);
                                }
                            }
                            tr:first-child {
                                td:first-child {
                                    position: absolute;
                                    left: 0;
                                    top:rem(37);
                                    background-color: #fff;
                                    border-bottom: 0;
                                }
                                td:nth-child(2) {
                                    border-left: 0;
                                }
                            }
                            tr:nth-child(2) {
                                td:first-child {
                                    position: absolute;
                                    left: 0;
                                    top:rem(73);
                                    background-color: #fff;
                                    border-bottom: 0;
                                }
                                td:nth-child(2) {
                                    border-left: 0;
                                }
                            }
                            tr:nth-child(3) {
                                td:first-child {
                                    position: absolute;
                                    left: 0;
                                    top:rem(109);
                                    background-color: #fff;
                                }
                                td:nth-child(2) {
                                    border-left: 0;
                                }
                            }
                        }
                    }
                    &::-webkit-scrollbar {
                        display: none;
                    }
                    -ms-overflow-style: none;
                    overflow: -moz-scrollbars-none;
                }

                    .time_frame {
                        margin-top: rem(10);
                        color: #808080;
                        font-size: rem(11);
                        p {
                            line-height: rem(17);
                        }
                    }
                }
            }
        }
    }
    .footer {
        width: 100%;
        display: -webkit-flex;
        display: flex;
        button {
            height: rem(49);
            font-size: rem(16);
            border-radius: 0;
        }
        
        .button1 {
            background:#F09F88 url(../../common/img/icon_dp.png) no-repeat rem(35);
            background-size: 12%;
        }
        .dian {
            background:#F09F88 url(../../common/img/icon_dp.png) no-repeat rem(120) center;
            background-size: 7%;
        }
        #btnout {
            background:#469AF4 url(../../common/img/icon_ljwz.png) no-repeat rem(35);
            background-size: 12%;
        }
        
        .btnTime {
            text-align: center;
            span {
                display: block;
                background: url(../../common/img/icon_jxwz.png) no-repeat rem(33);
                background-size: 12%;
                font-size: rem(16);
            }
            p {
                font-size: rem(11);
            }
        }
    }
}
</style>
