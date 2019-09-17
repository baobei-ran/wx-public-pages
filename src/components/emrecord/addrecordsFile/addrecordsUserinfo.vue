<template>
    <!-- 添加病历 -- 健康信息 -->
    <div class="addrecordsUserinfo dis_f flex_c" v-show='isView'>
        <div class="content-box flex1">
            <div class="contents">
                <div class="contents-header dis_f dis_sb bg-white">
                    <div class="dis_f contents-header-left">
                        <h2>{{ userinfo.name }}</h2>
                        <b>|</b>
                        <span v-text='userinfo.sex == 1?"男":"女"'></span>
                        <b>|</b>
                        <span>{{ userinfo.age }}</span>
                    </div>
                    <div class="contents-header-right">{{ userinfo.userinfo }}</div>
                </div>
                <div class="contents-progress bg-white">
                    <ul class="dis_f">
                        <li class="li-active"></li>
                        <li class="ul-right"></li>
                    </ul>
                    <ol class="dis_f">
                        <li>健康信息</li>
                        <li>诊疗信息</li>
                    </ol>
                </div>
                <div class="user-info bg-white">
                    <div><span><b class="color-red">*</b>身高（cm）</span><input v-model="userdata.stature" type="number" placeholder="请填写身高"></div>
                    <div><span><b class="color-red">*</b>体重（kg）</span><input v-model="userdata.weight" type="number" placeholder="请填写体重"></div>
                    <div><span>备孕情况</span><textarea v-model="userdata.yun" placeholder="请填写备孕情况、无备孕、备孕中或已怀孕"></textarea></div>
                </div>
                <div class="user-info-msg">
                    <ul class="bg-white">
                        <li>
                            <span>吸烟情况</span>
                            <p>
                                <span :class="{'span-blue':status == 1}" @click='clickStatus(1)'>从不吸烟</span>
                                <span :class="{'span-blue':status == 2}" @click='clickStatus(2)'>已戒烟</span>
                                <span :class="{'span-blue':status == 3}" @click='clickStatus(3)'>吸烟</span>
                            </p>
                        </li>
                        <transition name="bounce">
                            <div v-show="status == 3">
                                <p><span>日平均吸烟量（支）</span><input type="number" v-model="userdata.cigarette_day" placeholder="请填写每日平均吸烟量" /></p>
                                <p><span>开始吸烟年龄</span><input type="number" v-model="userdata.cigarette_age" placeholder="请填写开始吸烟年龄" /></p>
                            </div>
                        </transition>
                    </ul>
                    <ul class="bg-white">
                        <li>
                            <span>饮酒情况</span>
                            <p>
                                <span :class="{'span-blue':status2 == 1}" @click='clickStatus2(1)'>从不</span>
                                <span :class="{'span-blue':status2 == 2}" @click='clickStatus2(2)'>偶尔</span>
                                <span :class="{'span-blue':status2 == 3}" @click='clickStatus2(3)'>经常</span>
                            </p>
                        </li>
                        <transition name="bounce">
                            <div v-show="status2 == 2 || status2 == 3 ">
                                <p><span>日平均饮酒量（两）</span><input v-model="userdata.liquor_day" type="number" placeholder="请填写每日平均饮酒量" /></p>
                                <p><span>开始饮酒年龄</span><input v-model="userdata.liquor_age" type="number" placeholder="请填写开始饮酒年龄" /></p>
                            </div>
                        </transition>
                    </ul>
                    <div class="bg-white"><span>既往病史</span><textarea v-model="userdata.ago" placeholder="可填写遗传病史、家族病史及过往疾病信息"></textarea></div>
                    <div class="bg-white"><span>药物过敏史</span><textarea v-model="userdata.allergy" placeholder="可填写药物过敏情况，如头孢类抗生素过敏、阿司匹林过敏等"></textarea></div>
                    <div class="bg-white"><span><b class="color-red">*</b>病情描述</span><textarea v-model="userdata.remark" placeholder="请描述病情，不少于5个字"></textarea></div>
                </div>
            </div>
        </div>
        <div class="footer" v-show="hidShow">
            <mt-button :disabled='disabled' @click.native="handleClickNext">下一步</mt-button>
        </div>
        
    </div>
</template>

<script>
export default {
    data () {
        return {
            status: 1,
            status2: 1,
            hidShow: true,
            docmHeight: document.documentElement.clientHeight, // 默认屏幕高度
            showHeight: document.documentElement.clientHeight, // 实时屏幕高度
            userinfo: {},               // 选择的信息
            popupVisibles: false,
            userdata: {
                stature: '',            // 身高
                weight: '',             // 体重
                yun: '',                // 备孕
                cigarette: 1,
                cigarette_day: '',
                cigarette_age: '',
                liquor: 1,
                liquor_day: '',
                liquor_age: '',
                ago: '',
                allergy: '',
                remark: '',
                typeList: [],       // 就诊人关系列表
            },
            disabled: false,
            isView: false,
        }
    },
    beforeCreate() {
        this.$indicator.open({
                text: '',
                spinnerType: 'fading-circle'
            });
    },
    beforeDestroy () {
        this.$indicator.close();
    },
    mounted () {
        window.onresize = () => {
            return (() => {
                this.showHeight = document.body.clientHeight
            })()
        }
        var self = this;
        self.$http.post('/mobile/doch5/patient_type', null).then(res => {
            if (res.code == 1) {
                self.typeList = res.data;
                this.getUserInfo()
            }
        }).catch(err => { console.log(err) })
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
        }
            
        
    },
    watch: {
        showHeight: function () {
            if (this.docmHeight > this.showHeight) {
                this.hidShow = false
            } else {
                this.hidShow = true
            }
        },
    },
    methods: {
        getUserInfo () {  // 获取信息
            var self = this;
            self.$http.post('/mobile/Wxemr/health_information', { cid:this.$route.query.cid  }).then(res => {
                console.log(res)
                self.$indicator.close();
                self.isView = true;
                if (res.code == 1) {
                    console.log(res.data.cigarette)
                    self.userinfo = {
                        cid: self.$route.query.cid,
                        name: res.data.real_name,
                        sex: res.data.sex,
                        age: res.data.age,
                    }
                    self.typeList.map(val => {
                        if (val.id == res.data.type) {
                            self.userinfo.userinfo = val.name
                        }
                    })
                    self.userdata = {
                        stature: res.data.stature? res.data.stature : '' ,
                        weight: res.data.weight?res.data.weight: '',
                        yun: res.data.yun,               
                        cigarette: res.data.cigarette,
                        cigarette_day: res.data.cigarette_day,
                        cigarette_age: res.data.cigarette_age,
                        liquor: res.data.liquor,
                        liquor_day: res.data.liquor_day,
                        liquor_age: res.data.liquor_age,
                        ago: res.data.ago,
                        allergy: res.data.allergy,
                        remark: res.data.remark
                    }
                    this.status = res.data.cigarette;
                    this.status2 = res.data.liquor;
                }
            }).catch(err => console.log(err))
        }, 
        handleClickNext () { // 提交
            var self = this;
            if (!this.userdata.stature) {
                this.$toast({
                    message: '请输入身高',
                    position: 'middle',
                    duration: 2000
                })
                return;
            }
            if (!this.userdata.weight) {
                this.$toast({
                    message: '请输入体重',
                    position: 'middle',
                    duration: 2000
                })
                return;
            }
            if (this.userdata.cigarette == 3 && this.userdata.cigarette_day <= 0) {
                this.$toast({
                    message: '请输入日平均吸烟量',
                    position: 'middle',
                    duration: 2000
                })
                return;
            }
            if (this.userdata.cigarette == 3 && this.userdata.cigarette_age <= 0) {
                this.$toast({
                    message: '请输入开始吸烟年龄',
                    position: 'middle',
                    duration: 2000
                })
                return;
            }
            if (this.userdata.liquor == 2 && this.userdata.liquor_day <=0 || this.userdata.liquor == 3 && this.userdata.liquor_day <=0) {
                this.$toast({
                    message: '请输入日平均饮酒量',
                    position: 'middle',
                    duration: 2000
                })
                return;
            }
            if (this.userdata.liquor == 2 && this.userdata.liquor_age <=0 || this.userdata.liquor == 3 && this.userdata.liquor_age <=0) {
                this.$toast({
                    message: '请输入开始饮酒年龄',
                    position: 'middle',
                    duration: 2000
                })
                return;
            }
            if (!this.userdata.remark || this.userdata.remark.length < 5) {
                this.$toast({
                    message: '请输入病情描述，不少于5个字',
                    position: 'middle',
                    duration: 2000
                })
                return;
            }

            
            this.userdata.cid = this.userinfo.cid;
            this.disabled = true;
            this.$indicator.open({
                text: '提交中...',
                spinnerType: 'fading-circle'
            });
            console.log(this.userdata)
            self.$http.post('/mobile/Wxemr/add_health', this.userdata).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.$router.replace({path: '/addrecordsUserClinic', query: self.userinfo })
                } else {
                    self.disabled = false;
                    self.$indicator.close();
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    })
                }
            }).catch(err => {console.log(err); self.disabled = false;})
            
        },
        clickStatus(number) { // 吸烟
            this.status = number;
            this.userdata.cigarette = number
        },
        clickStatus2(number) {  // 饮酒
            this.status2 = number;
            this.userdata.liquor = number
        },
    },
    beforeDestroy () {
        this.$indicator.close();
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.bounce-enter-active {
  animation: bounce-in .2s;
}
.bounce-leave-active {
  animation: bounce-in .2s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.color-red {
    color: #F93E3E;
}
.addrecordsUserinfo {
    width: 100%;
    height: 100%;
    min-height: 100%;
    font-size: rem(28);
    background-color: #F4F4F4;
    .content-box {
        width: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .contents {
            width: 100%;
            margin-bottom: rem(20);
            .contents-header {
                width: 100%;
                padding: 0 rem(30);
                height: rem(98);
                line-height: rem(98);
                &-left {
                    color: #333;
                    b {
                        margin: 0 rem(10);
                        color: #aaa;
                        vertical-align: middle;
                    }
                }
                &-right {
                    width: 50%;
                    text-align: right;
                    color: #808080;
                }
            }
            .contents-progress {
                width: 100%;
                height: rem(140);
                margin-top: rem(20);
                ul {
                    width: 100%;
                    padding-top: rem(38);
                    position: relative;
                    li {
                        display: inline-block;
                        width: 50%;
                        height: 2px;
                        background-color: #ddd;
                    }
                    li::after {
                        position: absolute;
                        left: 25%;
                        margin-top: rem(-8);
                        content: '';
                        display: block;
                        width: rem(20);
                        height: rem(20);
                        background-color: #ddd;
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                    }
                    .ul-right::after {
                        left: 75%;
                    }
                    .li-active {
                        background-color: #469AF4;
                    }
                    .li-active::after {
                        width: rem(42);
                        height: rem(42);
                        margin-top: rem(-20);
                        -webkit-transform: translateX(-50%);
                        transform: translateX(-50%);
                        background: url('../../../common/img/icon_xz.png') no-repeat;
                        background-size: cover;
                    }
                }
                ol {
                    margin-top: rem(30);
                    li {
                        width: 50%;
                        color: #333;
                        font-weight:600;
                        text-align: center;
                    }
                    li:last-child {
                        color: #808080;
                    }

                }
            }
            .user-info {
                margin-top: rem(20);
                padding: 0 rem(30);
                div {
                    height: rem(98);
                    line-height: rem(98);
                    border-bottom: 1px solid #E6E6E6;
                    color: #333;
                    span {
                        display: inline-block;
                        width: 25%;
                    }
                    input {
                        height: rem(40);
                        line-height: rem(40);
                        border:0;
                        font-size: rem(28);
                    }
                }
                div:last-child {
                    height: auto;
                    border: 0;
                    span {
                        display: block;
                    }
                    textarea {
                        width: 100%;
                        height: rem(120);
                        line-height: rem(40);
                        padding: rem(20);
                        background-color: #f9f9f9;
                        border-color: #f9f9f9;
                        resize: none;
                        outline:none;
                        border: 0;
                        font-size: rem(28);
                    }
                }
            }
            .user-info-msg {
                width: 100%;
                ul {
                    padding: 0 rem(30);
                    margin-top: rem(20);
                    li {
                        color: #333;
                        height: rem(98);
                        line-height: rem(98);
                        p {
                            display: inline-block;
                            margin-left: rem(20);
                            >span {
                                font-size: rem(24);
                                color: #808080;
                                border:1px solid #AAAAAA;
                                padding: rem(10) rem(13) rem(5);
                                -webkit-border-radius:rem(8);
                                border-radius:rem(8);
                                margin-left: rem(30);
                            }
                            .span-blue {
                                border-color: #469AF4;
                                color: #469AF4;
                            }
                        }
                    }
                    >div {
                        p {
                            height: rem(98);
                            line-height: rem(98);
                            color: #333;
                            span {
                                display: inline-block;
                                width: 40%;
                            }
                            input {
                                padding: rem(10) 0;
                                border:0;
                                font-size: rem(28);
                            }
                        }
                        p:first-child {
                            border-bottom: 1px solid #E6E6E6;
                        }
                    }
                }
                >div {
                    width: 100%;
                    margin-top: rem(20);
                    border: 0;
                    padding: 0 rem(30) rem(30);
                    span {
                        display: block;
                        height: rem(98);
                        line-height: rem(98);
                    }
                    textarea {
                        width: 100%;
                        height: rem(120);
                        line-height: rem(40);
                        padding: rem(20);
                        background-color: #f9f9f9;
                        border-color: #f9f9f9;
                        resize: none;
                        color:#333;
                        border: 0;
                        font-size: rem(28);
                        &::-moz-placeholder {
                            line-height: rem(40);
                        }
                        &::placeholder {
                            line-height: rem(40);
                        }
                    }
                }
            }
        }
    }
    .footer {
        width: 100%;
        height: rem(98);
        button {
            width: 100%;
            height: rem(98);
            background-color: #469AF4;
            color: #fff;
            font-size: rem(32);
            -webkit-border-radius: 0;
            border-radius: 0;
        }
    }
}
</style>

