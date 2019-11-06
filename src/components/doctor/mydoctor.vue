<template>
    <!-- 我的医生 -->
    <div class="doctor dis_f flex-v">
        <div class="section flex1">
            <div>
                <div class="kong" v-show='Status'>
                    <img src="../../common/img/pic_zwys.png" alt="" />
                    <p>你当前暂未添加医生，<span @click='handleClick'>立即找医生</span></p>
                </div>
                <div v-if='datalist.length'>
                    <div class="list">
                        <div class="commons await" v-for='(val, i) in datalist' :key='i'>
                            <!-- <h4>{{ val.hospital_name }}</h4> -->
                            <div class="con-doc">
                                <dl class="dis_f flex-vc" @click='Clickdetail(val.did)' >
                                    <dt>
                                        <div>
                                            <img v-lazy="$http.baseURL+val.picture" :key="val.picture" alt="" />
                                        </div>
                                    </dt>
                                    <dd>
                                        <p>
                                            <span>{{ val.true_name }}</span> |
                                            <span>{{ val.gname }}</span> | <span>{{ val.department_name }}</span>
                                            <b v-if='i == 0'>最新关注</b>
                                        </p>
                                        <p>{{ val.hospital_name }}</p>
                                    </dd>
                                </dl>
                            </div>
                            <div class="doc-tag">
                                <ul>
                                    <li v-for='item in val.business'>
                                        <span class="bg-orange" v-if='item == 6'>可开处方</span>
                                        <span class="bg-blue" v-if='item == 15'>可免费咨询</span>
                                        <span class="bg-blue" v-if="item == 1">可预约门诊</span>
                                        <span class="bg-blue" v-if='item == 14'>可阅片</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="icon-btn">
                                <ul class="dis_f dis_sb">
                                    <li @click='handerOnce(val.did)'><img src="../../common/icon/icon_ljzx@2x.png" alt="" /><p>立即咨询</p></li>
                                    <li @click='handerImage(val)'><img src="../../common/icon/icon_ypzx@2x.png" alt="" /><p>阅片服务</p></li>
                                    <li @click='Clickdetail(val.did)' v-if='val.is_offyy'><img src="../../common/icon/icon_yymz@2x.png" alt="" /><p>预约门诊</p></li>
                                    <li v-if='!val.is_offyy'><img src="../../common/icon/icon_yymz_h@2x.png" alt="" /><p>预约门诊</p></li>
                                    <li @click="handerDetail(val.did, val.status)"><img src="../../common/icon/icon_zxjl@2x.png" alt="" /><p>咨询记录</p></li>
                                </ul>
                            </div>
                            <!-- <div class="ckBtn">
                                <span class="orange" v-if='val.status == 9' ><mt-button @click.native="handerOnce(val.did)" >阅片服务中</mt-button></span>
                                <span class="blue" v-if='!val.status'><mt-button @click.native="handerOnce(val.did)" >立即咨询</mt-button></span>
                                <span class="orange" v-if='val.status == 3'><mt-button @click.native="handerOnce(val.did)" >付费问诊中</mt-button></span>
                                <span><mt-button @click.native="handerDetail(val.did, val.status)">咨询记录</mt-button></span>
                            </div> -->
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <mt-button type="primary" v-if='!datalist.length' size="large" @click.native="handleClick">立即找医生</mt-button>
            <mt-button type="primary" v-if='datalist.length' size="large" @click.native="handleClick2">找其他医生</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            datalist: [],
            Status: false,  // 无数据显示
            uid: '',
            page: 1,
            limit: 15,
        }
    },
    beforeCreate () {
        var userId =  this.$route.query.uid;
        if (userId) {   //  检测是否认证
            var self = this;
            this.$http.post('/mobile/wxauth/is_auth', { uid: userId}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    if (res.auth == 3) {
                        self.$router.replace('/phone?uid='+userId)
                        return;
                    } 
                    if (res.auth == 2 ) {
                        self.$router.replace('/authentication')
                    }
                }
            })
        }
        this.$indicator.open({
            text: '',
            spinnerType: 'fading-circle'
        });
    },
    activated () {
        var userId =  this.$route.query.uid || this.$cookie.get('userLogins');
        if (userId) {
            this.uid = userId
            var urldata = this.$route.query;
            this.$cookie.set('userLogins', userId)
        }
        this.initdata();
        if (this.$isIos()) {
            var urls = this.$storage.get('chatRoom');
            if (!urls) {
                var homeUrl = window.location.href;
                this.$storage.set('chatRoom', homeUrl)
            }
            
        }
    },
    destroyed () {
        this.$indicator.close();
    },
    methods: {
        initdata () {
            var self = this;
            var obj = {uid:this.uid, page: this.page, limit: this.limit}
            this.$http.post('/mobile/wxdoccenter/my_doctors', obj).then(res => {
                console.log(res)
                self.$indicator.close();
                if (res.code == 1) {
                    var data = res.data, arr = [];
                    for (var i=0; i< data.length; i++) {
                        if (data[i].did) {
                            arr.push(data[i])
                        }
                        if (data[i].business) {
                            var is_yy = false
                            var tag = data[i].business.split(',');
                            tag = tag.filter(v => {
                                return v !== ''
                            })
                            tag.sort((a,b) => {
                                return a - b
                            })
                            tag.map(v => {
                                if (v == 1) {
                                    is_yy = true
                                }
                            })
                            data[i].is_offyy = is_yy;
                            data[i].business = tag
                        }
                    }
                    self.datalist = arr;
                    if (self.datalist.length <= 0) {
                        self.Status = true;
                    } else {
                        self.Status = false;
                    }
                } else {
                    self.Status = true;
                    self.datalist = []
                }
            })
        },
        handerImage(v) { // 阅片服务
            this.$router.push('/searchImage?did='+v.did+'&status=1&money='+v.ask_money)
        },
        handleClick() {         // 立即找医生
            this.out('searchdoctor')
        },
        handleClick2() {    // 找其他医生
            this.out('/searchdoctor')
        },
        Clickdetail (id) {       // 进入医生详情
            this.$router.push({ path: '/doctordetail', query: { id:id}})
        },
        handerOnce (id) {  // 立即咨询 和 付费问诊中、阅片服务中 都进入聊天室
            this.$indicator.open({
                text: '',
                spinnerType: 'fading-circle'
            });
            this.$router.push('/chatroom?did='+id+'&uid='+this.uid)
            // var self = this, 
            //     obj = { uid: this.uid, did: id };
            // self.$http.post('/mobile/wxauth/consult', obj).then(res => {
            //     console.log(res)
            //     if (res.code == 1) {
            //         self.$messagebox.confirm('<p style="color: #333;">你已成功选择该医生，返回公众号首页，即可向医生咨询问题</P>', {showCancelButton: false, confirmButtonText: '确定'}).then(action => {
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
        // handerLoding () { // 咨询中
        //     this.$messagebox.confirm('<p style="color:#333;">返回公众号首页，即可继续向医生咨询问题</p>', {showCancelButton: false, confirmButtonText: '确定'}).then(action => {
        //        WeixinJSBridge.call('closeWindow'); 
        //     });
        // },
        handerDetail (id, n) {  // 咨询记录
            this.$indicator.open({
                text: '',
                spinnerType: 'fading-circle'
            });
            this.$router.push({path:'/docrecord', query: { did: id, uid: this.uid,  status: n}})
            // this.$router.push({path: '/userPayHistoryInfo', query: { did: id, uid: this.uid, status: n} })
        },
    },
    beforeDestroy () {
        this.$indicator.close();
    },
    destroyed () {
        this.$indicator.close();
    }
}
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
    background: #F4F4F4;
    font-size: rem(14);
    
    .section {
        width: 100%;
        font-size: rem(14);
        overflow-y: scroll;
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
        padding-bottom: rem(5);
        .kong {
            text-align: center;
            padding: rem(81) 0;
            img {
                width: rem(125);
                display: block;
                margin: 0 auto;
            }
            >p {
                text-align: center;
                color: #808080;
                margin-top: rem(26);
                >span {
                    color: #129DFA;
                }
            }
        }
        .list {
            width: 100%;
            font-size: rem(12);
            padding: rem(7.5) rem(15);
            margin-top: rem(7.5);
               .commons {
                    width: 100%;
                    margin-bottom: rem(12);  
                    background-color: #fff;
                    -webkit-border-radius:rem(5);
                    border-radius:rem(10);
                    > h4 {
                        width: 100%;
                        height: rem(40);
                        line-height: rem(40);
                        color: #808080;
                        font-size: rem(13);
                        background-color: #fff;
                        padding: 0 rem(15); 
                    
                    }
                .con-doc {
                    padding: 0 rem(5);
                    > dl {
                        width: 100%;
                        height: rem(72);
                        padding: 0 rem(15); 
                        
                        dt {
                            margin-top: rem(5);
                            div {
                                width: rem(54);
                                height: rem(54);
                                -webkit-border-radius: 100%;
                                border-radius: 100%;
                                overflow: hidden;
                                position: relative;
                                object-fit: cover;
                                >img[lazy=loaded] {
                                    
                                    width: rem(54);
                                    height: rem(54);
                                    display: block;
                                    // max-width: rem(54);
                                    // max-height: rem(54);
                                    -webkit-object-fit: cover; 
                                    object-fit: cover; 
                                    -webkit-border-radius: 100%;
                                    border-radius: 100%;
                                }
                                > img[lazy=loading] {
                                    position: absolute;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    top: 0;
                                    width: 0.4rem;
                                    margin: auto;
                                    background: url("../../common/images/lazy.gif") no-repeat;
                                    background-size: cover;
                                }
                            }
                            
                        }
                        dd {
                            padding-left: rem(15);
                            color: #333;
                            font-size: rem(14);
                            padding-top: rem(10);
                            > p {
                                line-height: rem(20);
                                b {
                                    font-size: rem(10);
                                    margin-left: rem(6);
                                    border: 1px solid #129DFA;
                                    padding: rem(2) rem(4);
                                    line-height: rem(24);
                                    background: #129DFA;;
                                    border-radius: rem(2);
                                    color: #FFF;
                                    vertical-align: bottom;
                                }
                                span {
                                    color: #808080;
                                }
                                span:first-child {
                                    color: #333;
                                    font-size: rem(16);
                                }
                            }
                            p:last-child {
                                margin-top: rem(10);
                                color: #333;
                                font-size: rem(12);
                            }
                        }
                    }
                }
                .doc-tag {
                    width: 100%;
                    padding: 0 rem(15);
                    margin-top: rem(4);
                    ul {
                        width: 100%;
                        padding: 0 0 rem(12) rem(65);
                        border-bottom: 1px dashed #E6E6E6;
                        li {
                            display: inline-block;
                            span {
                                display: block;
                                padding:rem(4.4) rem(2.4) rem(3);
                                margin: rem(3);
                                border-radius: rem(3);
                                font-size: rem(12);
                            }
                            .bg-blue {
                                background: #EBF5FF;
                                color: #4A9CF4;
                            }
                            .bg-orange {
                                color: #FFBC00;
                                background: #FFF8E3;
                            }
                        }
                    }
                }
                .icon-btn {
                    width: 100%;
                    padding: rem(15);
                    ul {
                        overflow: hidden;
                        li {
                            float: left;
                            width: 25%;
                            img {
                                display: block;
                                margin: 0 auto;
                                width: rem(30);
                            }
                            p {
                                text-align: center;
                                font-size: rem(12);
                                color: #333;
                                margin-top: rem(7.5);
                            }
                        }
                    }
                }
                    .ckBtn {
                        width: 100%;
                        height: rem(49);
                        line-height: rem(49);
                        text-align: right;
                        background-color: #fff;
                        padding: 0 rem(15); 
                        > span {
                            button {
                                width: rem(72);
                                height: rem(23);
                                line-height: rem(23);
                                color: #808080;
                                font-size: rem(11);
                                background-color: #fff;
                                border: 1px solid #808080;
                                padding: 0; 
                                text-align: center;
                                -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                            }
                        }
                        
                        button {
                            margin-left: rem(15);
                        }
                        .blue {
                            button {
                                color: #469AF4;
                                border:1px solid #469AF4;
                            }
                        }
                        .orange {
                            button {
                                color: #F09F88;
                                border:1px solid #F09F88;
                            }
                        }
                    }


                }
            
        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        button {
            height: rem(49);
            font-size: rem(17);
        }
    }
}
</style>
