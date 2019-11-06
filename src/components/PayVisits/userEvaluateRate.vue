<template>
    <!-- 星级评价 -->
    <div class="userEvaluateRate dis_f flex_c">
        <div class="userEvaluateRate-content flex1">
            <ul>
                <li>请对此次门诊服务进行评价</li>
                <li>
                    <span v-show='false'><i class="Color-red">*</i>星级评价</span>
                    <span><v-rate size='25' @changeScore='changeScore' /></span>
                    <!-- <p>点击进行五星好评</p> -->
                </li>
                <li>
                    <p>评价内容：</p>
                    <textarea class="textareas" placeholder="请填写对此次问诊的评价" maxLength='200' v-model="userevaluate" ></textarea>
                </li>
            </ul>
        </div>
        <div class="userEvaluateRate-footer">
            <van-button @click="handleClickSave" :disabled='disabled' type="info">保存</van-button>
        </div>
    </div>
</template>
<script>
import Rate from '../moduleCommon/rate'
export default {
    components: {
        'v-rate': Rate
    },
    data () {
        return {
            userevaluate: '',
            score: 0,
            disabled: false,
            uid: this.$cookie.get('userLogins'),
        }
    },
    methods: {
        changeScore (number) {
            this.score = number * 2
        },
        handleClickSave () {
            var self = this;
            if (this.score <= 0) {
                self.$toast({
                    message: '请点击星星，进行评价',
                    position: 'middle',
                    duration: 2000
                });
                return;
            }
            this.disabled = true;
            var obj = { uid: this.uid, did: this.$route.query.did, score: this.score, content: this.userevaluate, number: this.$route.query.id, type: this.$route.query.type || 1 };
            self.$http.post('/mobile/WxSeeImage/user_evaluate', obj).then(res => {
                console.log(res)
                if (res.code == 200) {
                    self.$toast({
                        message: '评价完成',
                        position: 'middle',
                        duration: 2000
                    });
                    var ts = setTimeout(() => {
                        self.disabled = false
                        self.$router.go(-1);
                        clearTimeout(ts)
                    }, 500)
                } else {
                    self.disabled = false
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 3000
                    });
                }
            }).catch(err => {
                self.disabled = false;
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px/100+rem;
}
.Color-red {
    color: red;
}
.userEvaluateRate {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    color: #333;
    background-color: #F4F4F4;
    &-content {
        padding: rem(21) rem(30);
        >ul {
            width: 100%;
            background: #FFF;
            padding: rem(30);
            li {
                margin-top: rem(20);
                span {
                    display: inline-block;
                    line-height: rem(30);
                    vertical-align: middle;
                }
                span:first-child {
                    width: rem(160);
                }
                > p {
                    
                    margin-top: rem(20);
                    color: #808080;
                }
                textarea {
                    width: 100%;
                    border: 1px solid #F6F6F6;
                    height: rem(260);
                    line-height: rem(40);
                    outline: none;
                    margin-top: rem(29);
                    font-size: rem(28);
                    color: #333;
                    border-radius: 4px;
                    padding: rem(29);
                    background: #F6F6F6;
                }
            }
            li:first-child {
                color: #333;
                font-size: rem(28);
            }
            li:nth-child(2) {
                text-align: center;
                margin-top: rem(30);
            }
            li:last-child {
                margin-top: rem(40);
            }
        }
    }
    &-footer {
        width: 100%;
        height: rem(98);
        button {
            width: 100%;
            height: 100%;
            font-size: rem(32);
        }
    }
}
</style>