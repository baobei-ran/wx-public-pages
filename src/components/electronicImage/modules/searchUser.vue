<template>
    <!-- 查询影像选择弹框内容 -->
    <div class="popupMsg bg-f" @touchmove.prevent>
        <div class="head-title"><span>填写其他就诊信息</span> <img class="F-r" @click='shadeHide' src="../../../common/img/icon_qx@2x.png" alt="" /></div>
        <div class="content-box">
            <ul>
                <li>
                    <span><i class="Color_red">*</i>就诊人姓名</span>
                    <!-- <div class="inpt">{{ userCard.real_name }}</div> -->
                    <i class="icon-x"></i>
                    <select class="inpt" v-model="userCard" id='select-list'>
                        <option value="">请选择</option>
                        <option v-for="(val,i) in userInfo" :value="val"  :key='i'>{{val.real_name}}</option>
                    </select>
                </li>
                <!-- <li class="select-box">
                    <label class="check-else">查看其他就诊人影像</label>
                </li> -->
                <li class="user-msg">
                    <p><i class="Color_red">*</i>医院门诊号/病历号/检查号</p>
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
    props: ['real_name'],
    data () {
        return {
            userCard: '',
            userNumber: '',
            userInfo: [],
            uid: this.$cookie.get('userLogins'),
        }
    },
    watch: {
        real_name: function (val) {
            this.userNumber = ''
            this.userInfo.map(item => {
                if (item.real_name == val) {
                    this.userCard = item
                }
            })
        }
    },
    mounted () {
        this.initdata()
    },
    methods: {
        initdata () {
            var self = this;
            self.$http.post('/mobile/Wxpatient/index', { uid: this.uid }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.userInfo = res.data
                    if (res.data.length > 0) {
                        res.data.map(val => {
                            if (val.type == 1) {
                                self.userCard = val
                            } 
                        })
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        },
        handleClickImage () {
            if (!this.userCard.id_card) {
                this.$toast({
                    message: '请选择就诊人',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            if (!this.userNumber) {
                this.$toast({
                    message: '请输入医院就诊卡号/病历号/检查号/门诊号等',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            var obj = {
                id: this.userCard.id,
                userCard: this.userCard.id_card,
                userNumber: this.userNumber,
                isShow: false
            }

            this.$emit('handleExamineNumber', obj)
            this.userNumber = ''
        },
        shadeHide () {
            this.$emit('searchHide', false);
        },
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
        padding: rem(10) rem(30) rem(30);
        margin-bottom: rem(150);
        ul {
            color: #333;
            li {
                margin-top: rem(40);
                > span {
                    display: inline-block;
                    width: rem(170);
                    line-height: rem(66);
                }
                .inpt {
                    display: inline-block;
                    width: 68%;
                    height: rem(66);
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    vertical-align: middle;
                    line-height: rem(60);
                    padding: 0 rem(20);
                    outline: none;
                    text-indent: 2px;
                    background-color: transparent;
                    font-size: rem(28);
                    appearance:none;
                    -moz-appearance:none;
                    -webkit-appearance:none;
                }
                input {
                    width: 70%;
                    height: rem(66);
                    border: 1px solid #CCC;
                    padding: 0 rem(30);
                    border-radius: 4px;
                    line-height: rem(66);
                }
                
            }
            li:first-child {
                position: relative;
                .icon-x {
                    position: absolute;
                    right: rem(68);
                    top: rem(14);
                    width: rem(44);
                    height: rem(44);
                    display: block;
                    background: url('../../../common/icon/icon_zkxz@2x.png') no-repeat center right;
                    background-size: contain;
                }
            }
            // .select-box {
            //     position: relative;
            //     margin-top: rem(20);
            //     select {
            //        float: right;
            //        margin-right: rem(46);
            //        width: 50%;
            //        height: rem(50);
            //        border-radius: 4px;
            //        border: 1px solid #ccc;
            //        outline: none;
            //     //    appearance: none;
            //     //     -webkit-appearance: none;
            //     //     -moz-appearance: none;
            //         position: absolute;
            //         left: rem(170);
            //         opacity: 0;
            //         top: rem(-10);
            //     }
            //     .check-else {
            //         color: #4A9CF4;
            //         padding-left: rem(170);
            //         display: block;
            //         margin-top: rem(20);
            //         background: url('../../../common/icon/icon_enter@2x.png') no-repeat rem(425) rem(-2);
            //         background-size: contain;
            //     }
            // }
            .user-msg {
                >p {
                    margin-bottom: rem(20);
                    font-size: rem(28);
                }
                input {
                    margin-left: rem(170);
                    line-height: rem(40);
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