<template>
    <!-- 影像选择弹框内容 -->
    <div class="popupMsg bg-f" @touchmove.prevent>
        <div class="head-title"><span>填写用户信息</span> <img class="F-r" @click='shadeHide' src="../../../common/img/icon_qx@2x.png" alt="" /></div>
        <div class="content-box">
            <ul>
                <li>
                    <span><i class="Color_red">*</i>与本人关系</span>
                    <div>
                        <span v-for="val in userInfo" :key='val.id' :class='val.id == tabInfo.id?"tabActive":""' @click='handleUser(val)'>{{val.name }}</span>
                    </div>
                </li>
                <li>
                    <span><i class="Color_red">*</i>姓名</span>
                    <input type="text" v-model='userName' placeholder="请输入真实姓名"/>
                </li>
                <li>
                    <span><i class="Color_red">*</i>身份证号码</span>
                    <input type="text" v-model='userCard' placeholder="请输入真实身份证号码"/>
                </li>
                <li class="user-msg">
                    <p>医院门诊号/病历号/检查号</p>
                    <input type="text" v-model='userNumber' placeholder=""/>
                    <b>查看医院的就诊卡、病历本或检查报告填写</b>
                </li>
            </ul>
        </div>
        <div class="footer">
            <mt-button @click.native="handleClickImage">查看数字影像</mt-button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            tabInfo: {
                id: 0,
                name: ''
            },
            userName: '',
            userCard: '',
            userNumber: '',
            userInfo: [{id:2,name: '父母' }, { id:4,name:'子女'}, { id:3, name:'配偶' }, { id:7, name: '兄弟姐妹'}, { id: 6, name: '其他'}],
        }
    },
    methods: {
        handleClickImage () {
            var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;   // 正则身份证
            if (!this.tabInfo.id) {
                this.$toast({
                    message: '请选择与本人的关系',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            if (!this.userName) {
                this.$toast({
                    message: '请输入姓名',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            if (!this.userCard) {
                this.$toast({
                    message: '请输入身份证号',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            if (!idcardReg.test(this.userCard)) {
                this.$toast({
                    message: '请输入正确身份证号',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            var obj = {
                tabInfo: this.tabInfo,
                userCard: this.userCard,
                userName: this.userName,
                userNumber: this.userNumber,
                isShow: false
            }
            this.$emit('handleUserImage', obj)
        },
        handleUser(v) {
            this.tabInfo = v
        },
        shadeHide () {
            this.$emit('shadehide', false);
        }
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px/100+rem;
}
.Color_red {
    color: #FF4F4F;
}
.popupMsg {
    width: 100%;
    font-size: rem(28);
    .head-title {
        width: 100%;
        padding: rem(20) rem(30);
        overflow: hidden;
        border-bottom: 1px solid #E6E6E6;
        > span {
            display: inline-block;
            line-height: rem(50);
        }
        img {
            width: rem(50);
        }
    }
    .content-box {
        width: 100%;
        padding: rem(30);
        margin-bottom: rem(150);
        ul {
            color: #333;
            li {
                margin-top: rem(40);
                > span {
                    display: inline-block;
                    width: rem(170);
                }
                input {
                    width: 70%;
                    height: rem(66);
                    border: 1px solid #CCC;
                    padding: 0 rem(30);
                    border-radius: 4px;
                }
                
            }
            li:first-child { 
                span {
                    padding-top: rem(10);
                }
                div {
                    display: inline-block;
                    overflow: hidden;
                    width: 70%;
                    word-wrap:break-word;
                    vertical-align: top;
                    >span {
                        display: inline-block;
                        font-size: rem(24);
                        padding: rem(14) rem(18);
                        border: 1px solid #F0F0F0;
                        background-color: #F0F0F0;
                        color: #808080;
                        margin-right: rem(30);
                        margin-bottom: rem(30);
                        -webkit-border-radius:rem(4);
                        border-radius:rem(4);
                    }
                    .tabActive {
                        border-color: #4A9CF3;
                        color:#4A9CF3;
                        background-color: #EDF5FE;
                    }
                }
            }
            .user-msg {
                >p {
                    margin-bottom: rem(20);
                    font-size: rem(28);
                }
                input {
                    margin-left: rem(170);
                    padding: 0 rem(30);
                }
                >b {
                    display: block;
                    font-size: rem(24);
                    margin-top: rem(20);
                    padding-left: rem(170);
                    color: #808080;
                }
            }
        }
    }
    .footer {
        width: 100%;
        text-align: center;
        margin-bottom: rem(40);
        button {
            width: rem(400);
            background-color: #4A9CF3;
            color: #fff;
            font-size: rem(28);
        }
    }
}
</style>