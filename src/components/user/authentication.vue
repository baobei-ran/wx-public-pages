
<template>
<!-- 提交认证 -->
    <div class="login dis_f flex_c">
        <div class="section_box flex1">
            <div>
                <div class="section">
                    <div class="msgs">
                        <p class="txt">
                            请先绑定手机号，添加问诊人，成功后即可使用云医康平台服务！
                        </p>
                        <ul class="dis_f flex_i">
                            <li><img src="../../common/img/icon_bdsjh.png" alt="" />
                                <p>绑定手机号</p>
                            </li>
                            <li class="jian"><img src="../../common/img/icon_jt.png" alt="" /></li>
                            <li><img src="../../common/img/icon_tjjzrl.png" alt="">
                                <p>添加问诊人</p>
                            </li>
                        </ul>
                    </div>
                </div>
                    <div class="user">
                        <input style='background:#fff;color: #333;' type="text" value='本人' v-model='relation' maxlength="11" disabled >
                        <label class="label" for="">问诊人关系</label>
                    </div>
                    <div class="user">
                        <label for="">姓名</label>
                        <input type="text" v-model='userName'  maxlength="6" placeholder="请输入本人真实姓名">
                    </div>
                    <div class="user">
                        <label for="">身份证号</label>
                        <input type="text" v-model='IDcard' maxlength="18" placeholder="一经填写无法更改，请谨慎填写">
                    </div>
                    <div class="btn" :style="{opacity:(isBtn ? '0.6' : '1')}" >
                        <mt-button size="large" @click.native="handleClick" type="primary">下一步</mt-button>
                    </div>
            </div>    
        </div>
        <p class="footer" v-show="hidShow">点击查看 <span @click="out('/agreement')">《云医康注册使用协议》</span></p>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui'
import { MessageBox } from 'mint-ui';
export default {
        data () {
            return {
                relation: '本人',           // 关系
                userName: '',           // 姓名
                IDcard: '',             // 身份证
                isBtn: true,             // 按钮颜色控制
                docmHeight: document.documentElement.clientHeight, // 默认屏幕高度
                showHeight: document.documentElement.clientHeight, // 实时屏幕高度
                hidShow: true, // 显示或者隐藏footer
            }
        },
        updated() {
            if (this.userName && this.IDcard) {
                this.isBtn = false
            } else {
                this.isBtn = true
            }
            
        },
        mounted () {
            var vm = this
            window.onresize = function () {
            return (function () {
                vm.showHeight = document.body.clientHeight
                window.scrollTo(0, scroll);
            })()
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
            handleClick () {    // 提交
            console.log(this.relation)
                var self = this;
                var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;   // 正则身份证
                if (!this.relation) {
                    Toast({
                        message: '请完善信息！',
                        duration: 2000
                    });
                    return false;
                } 
                if (!this.userName) {
                    Toast({
                        message: '请输入正确姓名！',
                        duration: 2000
                    });
                    return false;
                }
                if (!idcardReg.test(this.IDcard)) {
                    Toast({
                        message: '请输入正确的身份证！',
                        duration: 2000
                    });
                    return false;
                } 
                Indicator.open({
                    text: '提交中...',
                    spinnerType: 'fading-circle',
                });
                var uid = this.$cookie.get('userLogins')
                var obj = { uid:uid, name: this.userName, idcard: this.IDcard, did: this.$route.query.did?this.$route.query.did: '' }
                this.$http.post('/mobile/wxauth/add_patient', obj).then(res => {
                    console.log(res)
                    Indicator.close();  // 关闭加载框
                    if (res.code == 1) {
                        self.$router.replace('/usermsg')    // 跳转认证成功页
                    } else {
                        Toast({
                            message: res.msg,
                            duration: 2000
                        });
                    }
                })
            },
            
            
        }
}
</script>

<style lang='scss' scoped>
@function rem($px) {
  @return $px / 50 + rem;
}
.login {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    .section_box {
        overflow: auto;
    }
    .section {
        background-color: #fff;

        .msgs {
            width: 100%;
            padding: rem(6) rem(15);
            p.txt {
                padding: rem(13) rem(12);
                background:rgba(74,156,243,0.15);
                color: #4A9CF3;
                font-size: rem(12);
                line-height: rem(18);
            }
            ul {
                width: 100%;
                height: rem(100);
                padding: rem(17) rem(20) 0;
                li {
                   width: 33%;
                   text-align: center;
                   font-size: rem(12);
                    img {
                        width: rem(35);
                        height: rem(35);
                    }
                    p {
                        margin-top: rem(10);
                        color: #5AABFF;
                    }
                }
                .jian {
                    margin-top: rem(-20);
                    img {
                        width: rem(52);
                        height: rem(9);
                    }
                }
            }
        }
    }
    .user {
        width: rem(333);
        margin: 0 auto rem(16) ;
        height: rem(46);
        display: -webkit-flex;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #E4E9F4;
        font-size: rem(14);
        position: relative;
        > select {
            display: block;
            position: absolute;
            top: 0;
            right: rem(0);
            height: 100%;
            float: right;
            outline: none;
            border:0;
            background-color: #fff;
            color: #333;
            // appearance: none;
            // -moz-appearance: none;
            // -webkit-appearance: none;
            text-align: center;
        }
        label {
            color: #808080;
            position: absolute;
            left: rem(17);
        }
        input {
            color: #333;
            height: 95%;
            width: 99%;
            border:0;
            text-align: right;
            padding-right: rem(16);
            font-size: rem(14);
        }
        
        input::-moz-placeholder {
            font-size: rem(14);
            color: #C7C7C7;
            line-height: rem(20);
            text-align: right;
        }

        input:-ms-input-placeholder {
            font-size: rem(14);
            color: #C7C7C7;
            line-height: rem(20);
            text-align: right;
        }

        input::-webkit-input-placeholder {
            font-size: rem(14);
            color: #C7C7C7;
            line-height: rem(20);
            text-align: right;
        }
    }
    
    .btn {
        margin-top: rem(46);
        text-align: center;
        padding: 0 rem(56);
        button {
            border-radius: rem(21);
            font-size:rem(14);
            font-weight:400;
            color: #fff;
            background-color:#6194F7;
        }
    }
    .footer {
        width: 100%;
        text-align: center;
        color: #666;
        font-size: rem(11);
        margin-bottom: rem(20);
        span {
            color: #3196FF;
        }
    }
}
</style>
