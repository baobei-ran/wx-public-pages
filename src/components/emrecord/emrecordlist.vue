<template>
    <!-- 电子病历列表 -->
    <div class="emrecord dis_f flex_c">
        <div class="header">
            <span>筛选就诊人</span>
            <span>|</span>
            <span @click="electmsg">患者{{userinfo}}</span>
        </div>
        <div class="content-box">
            <div class="contents">
                <!-- 完善1 -->
                <div class="emr-data emr-wperfection" v-for='(val, i) in datalist' :key='i+"_msg"' v-if='!val.stature && !val.weight'>
                    <div class="emr-usermsg dis_f">
                        <h2>{{val.real_name }}</h2>
                        <b>|</b>
                        <span v-text='val.sex == 1?"男":"女"'></span>
                        <b>|</b>
                        <span>{{ val.age }}</span>
                    </div>
                    <div class="empty-pic">
                        <img src="../../common/img/pic_swws.png" alt="">
                        <p>尚未完善病历及健康信息</p>
                    </div>
                    <div class="emr-btn">
                        <mt-button class="checkImage" @click.native="handleClickImage(val)">查看影像</mt-button>
                        <mt-button @click.native="handleClick(val)">完善资料</mt-button>
                    </div>
                </div>
                <!-- 完善2 -->
                <div class="emr-data" v-for='(val, i) in datalist' :key='i+"_case"' v-show="val.stature && val.weight">
                    <div @click='outUserdetail(val.patient_id)'>
                        <div class="user-pic">
                            <img v-show="val.type == 1" :src="$http.baseURL+val.pic" alt="">
                            <p v-show="val.type !== 1" class="dis_f dis_j flex_i">
                                <span>{{ val.type == 2?'父母':val.type == 3?'夫妻':val.type == 4?'子女':val.type == 5?'子女':val.type == 6?'其他':val.type == 7?'兄弟姐妹':null }}</span>
                            </p>
                        </div>
                        <div class="emr-usermsg dis_f">
                            <h2>{{val.real_name }}</h2>
                            <b>|</b>
                            <span v-text='val.sex == 1?"男":"女"'></span>
                            <b>|</b>
                            <span>{{ val.age }}</span>
                        </div>
                        <ul class="emr-msg">
                            <li><span>身高/体重</span><span>{{ val.stature }}cm/{{ val.weight }}kg</span></li>
                            <li><span>病情描述</span><span>{{ val.remark }}</span></li>
                            <li v-show="val.ago"><span>既往病史</span><span>{{ val.ago }}</span></li>
                        </ul>
                    </div>
                    <div class="emr-btn">
                        <mt-button class="checkImage" @click.native="handleClickImage(val)">查看影像</mt-button>
                        <mt-button @click.native="handleClick(val)">完善资料</mt-button>
                    </div>
                </div>
                <!-- 医生添加的病历 -->
                <div class="emr-datalist" v-for="(val, i) in caselist" :key='i'>
                    <h1>
                        <span></span>
                        <span>{{ val.addtime | filterTime }}</span>
                    </h1>
                    <div class="emr-datalist-box" @click='outdetail(val.id)'>
                        <div class="emr-title"><span>{{ val.doc }}医生添加的病历</span></div>
                        <div class="emr-data emr-data-content">
                            <p class="user-pic"><img :src="$http.baseURL+val.upic" alt="" /></p>
                            <div class="emr-usermsg dis_f">
                                <h2>{{ val.name }}</h2>
                                <b>|</b>
                                <span v-text='val.sex == 1?"男":"女"'></span>
                                <b>|</b>
                                <span>{{ val.age }}</span>
                            </div>
                            <ul class="emr-msg">
                                <li><span>患者主诉</span><span>{{ val.main }}</span></li>
                                <li><span>诊断结果</span><span>{{ val.result }}</span></li>
                                <li><span>医嘱小结</span><span>{{ val.doc_cure }}</span></li>
                            </ul>
                            <div class="emr-foot-pic dis_f dis_end">
                                <ul class="dis_f">
                                    <li v-for='(item, j) in val.pic' :key='j+"_pic"'><img :src="$http.baseURL+item" alt="" /></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 选择关系没有的提示去添加 -->
                <div v-show="isStatus2">
                    <empty />
                </div>
                <!-- 无医生添加的病历的提示 -->
                <div class="data-empty" v-show="isStatus">
                    <img src="../../common/img/pic_zwysfsbl.png" alt="">
                    <p>暂无医生添加病历</p>
                </div>
                
            </div>
        </div>

        <mt-popup style="width: 100%;"
            v-model="popupVisibles"
            position="bottom">
            <relation @usermsg='usermsg' />
        </mt-popup>

    </div>
</template>

<script>
import relation from './emrchildren/relation';  // 选择患者关系组件
import empty from './emrchildren/dzblempty'
export default {
    name: 'emrecordlist',
    components: {
        relation:relation,
        empty: empty
    },
    data () {
        return {
            popupVisibles: false,       // 选择关系人弹框
            isStatus: false,            // 医生的无数据源提示
            isStatus2: false,           // 患者的无数据
            userinfo: '本人',               // 选择的信息
            userType: 1,
            page: 1,
            limit: 10,
            uid: this.$cookie.get('userLogins'),
            datalist: [],
            caselist: []
        }
    },
    activated () {
        this.initdata()
    },
    methods: {
        initdata () {
            var self = this,
                obj = { uid: this.uid, type: this.userType, page: this.page, linit: this.limit  };
            self.$http.post('/mobile/Wxemr/index', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.datalist = res.data.contacts;
                    self.caselist = res.data.case;      // 医生的
                    if (self.caselist.length <= 0 && self.datalist.length > 0 ) {
                        self.isStatus = true
                    } else {
                        self.isStatus = false
                    }
                    if (self.datalist.length <= 0) {
                        self.isStatus2 = true;
                    } else {
                        self.isStatus2 = false;
                    }

                    if (self.caselist.length > 0) {
                        self.caselist.map(val => {
                            if (val.pic) {
                                val.pic = val.pic.split(',')
                            }
                        })
                    }

                }
            }).catch(err => { console.log(err) })
        },
        handleClick (v) {  // 完善资料
            var objs = { cid: v.patient_id }
            this.$router.push({path:'/addrecordsUserinfo', query: objs});
        },
        outUserdetail (id) { // 查看患者添加的详情
            this.$router.push({path:'/emrecorddetail', query: { id: id }}) 
        },
        outdetail (id) { // 查看医生添加的详情
            if (id) {
                this.$router.push({path:'/emrdetails', query: { id: id }})
            }
        },
        usermsg (v) {
            var self = this;
            this.userinfo = v.name
            var t = setTimeout(() => {
                self.popupVisibles = v.box
                clearTimeout(t)
            }, 100);
            if (this.userType !== v.id) {
                this.userType = v.id
                this.initdata()
            }
           
        },
        electmsg () {
            this.popupVisibles = true
        },
        handleClickImage (v) {  // 查看影像
            if (v.id_card) {
                this.out('/checkyingxiang?idcard='+v.id_card)
            } else {
                this.$toast({
                    message: '患者没有身份证号，无法查看影像',
                    position: 'middle',
                    duration: 3000
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50+rem;
}
.emrecord {
    width: 100%;
    font-size: rem(14);
    height: 100%;
    background-color: #F4F4F4;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .header {
        width: 100%;
        height: rem(45);
        line-height: rem(45);
        padding: 0 rem(15);
        background-color: #fff;
        span:first-child {
            color: #333;
        }
        span:nth-child(2) {
            color: #AAAAAA;
            padding: 0 rem(10);
        }
        span:last-child {
            color: #469AF4;
            padding-left: rem(17);
            background: url('../../common/img/icon_sx.png') no-repeat left center;
        }
    }
    .content-box {
        width: 100%;
        .contents {
            width: 100%;
            padding:0 rem(15);
            .emr-data {
                margin-top: rem(10);
                width: 100%;
                border-radius: rem(5);
                background-color: #fff;
                padding: rem(15);
                position: relative;
                .user-pic {
                    position: absolute;
                    top: rem(15);
                    right: rem(15);
                    img {
                        width: rem(44);
                        height: rem(44);
                        display: block;
                        border-radius: 100%;
                    }
                    >p {
                        width: rem(44);
                        height: rem(44);
                        min-width: rem(44);
                        text-align: center;
                        background-color: #5189F6;
                        color: #fff;
                        font-size: rem(12);
                        border: 1px solid #ccc;
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        > span {
                            padding: rem(4);
                            display: block;
                            text-align: center;
                        }
                    }
                }
                .emr-usermsg {
                    width: 100%;
                    font-size: rem(14);
                    h2 {
                        font-size: rem(16);
                        color: #212121;
                        font-weight: 600;
                    }
                    >b {
                        color: #E0E0E0;
                        margin: 0 rem(8);
                    }
                }
                .emr-msg {
                    margin-top: rem(15);
                    width: 100%;
                    >li {
                        padding: rem(2) 0;
                        overflow: hidden;
                        font-size: rem(12);
                        span {
                            display: inline-block;
                            line-height: rem(23);
                        }
                        span:first-child {
                            width: 20%;
                            vertical-align: top;
                            color:#808080;
                        }
                        span:last-child {
                            width: 78%;
                            color: #333;
                        }
                    }
                    > li:first-child {
                            span:last-child {
                                width: 62%;
                            }
                        }
                }
                .emr-btn {
                    text-align: right;
                    margin-top: rem(10);
                    .checkImage {
                        margin-right: rem(10);
                        border-color: #AAA;
                        color: #808080;
                    }
                    button {
                        padding: rem(7);
                        height: auto;
                        font-size: rem(12);
                        border:1px solid #469AF4;
                        color: #469AF4;
                        background-color: #fff;
                    }
                }
            }

            .emr-datalist {
                width: 100%;
                margin-top: rem(10);
                >h1 {
                    font-size: rem(14);
                    height: rem(30);
                    line-height: rem(30);
                    span:first-child {
                        display: inline-block;
                        width: rem(10);
                        height: rem(10);
                        background-color: #469AF4;
                        border-radius: 100%;
                        margin-right: rem(6);
                    }
                }
                .emr-datalist-box {
                    width: 100%;
                    background-color: #fff;
                    border-radius: 5px;
                    > .emr-title {
                        font-size: rem(11);
                        height: rem(22);
                        line-height: rem(20);
                        color: #fff;
                        > span {
                            background-color: #469AF4;
                            border-radius: 5px 0 10px 0;
                            padding: rem(4) rem(5);
                            vertical-align: middle;
                        }
                    }
                    .emr-data-content {
                        margin-top: rem(0);
                        .user-pic {
                            top: 0;
                        }
                    }
                    .emr-foot-pic {
                        width: 100%;
                        margin-top: rem(7);
                        ul {
                            width: 80%;
                            li {
                                margin-right: rem(7);
                                img {
                                    width: rem(39);
                                    height: rem(33);
                                }
                            }
                        }
                    }
                }
            }

            .emr-wperfection {
                .empty-pic {
                    width: 100%;
                    text-align: center;
                    img {
                        margin-top: rem(14);
                        width: rem(62);
                        height: rem(60);
                    }
                    p {
                        margin-top: rem(12);
                        color: #808080;
                        font-size: rem(12);
                    }
                }
            }

            .data-empty {
                width: 100%;
                background-color: #fff;
                margin-top: rem(10);
                padding-top: rem(60);
                padding-bottom: rem(70);
                text-align: center;
                img {
                    width: rem(150);
                    height: rem(150);
                }
                p {
                    margin-top: rem(9);
                    color: #333;
                    font-size: rem(13);
                }
            }
        }
    }
    
}
</style>

