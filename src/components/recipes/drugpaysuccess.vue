<template>
    <!-- 药品支付成功 -->
    <div class="drugpaysuccess dis_f flex_c">
        <div class="contents flex1">
            <div class="contents-box">
                <div class="payMsg">
                    <img src="../../common/img/icon_zfcg@2x.png" alt="" />
                    <p>支付成功</p>
                </div>
                <div class="payMsg2" v-show='type == 2'>
                    <h2>门店自提码 <span>{{ code }}</span></h2>
                    <p>请在5日内前往药店取药，出示自提码，由药店核销后提供药品。</p>
                    <p>请妥善保管自提码，避免向他人泄露。</p>
                </div>
            </div>
        </div>
       <div class="footer">
           <mt-button @click.native="handleClickdetail">查看订单详情</mt-button>
       </div>
    </div>
</template>

<script>
export default {
    name: 'drugpaysuccess',
    data () {
        return {
            type: 1,   // 订单是药店还是 店铺  ： 1=>医生店铺商品，2=>药店商品(自提)
            code: '',  // 自提码
            number: '', // 订单
        }
    },
    mounted () {
        console.log(this.$route)
        this.type = this.$route.query.type
        this.code = this.$route.query.code
        this.number = this.$route.query.number
    },
    methods: {
        handleClickdetail () {
            console.log(this.type)
            if (this.type == 1) {
                this.$router.push({path:'/successOrder', query: { id: this.number }})  // 店铺订单详情
            } else {
                this.$router.push({path:'/orderdetails', query: { id: this.number }})  // 药店自提详情
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.drugpaysuccess {
    width: 100%;
    height: 100%;
    font-size: rem(14);
    background-color: #F9F9F9;
    .contents {
        width: 100%;
        overflow-y: scroll;
        .contents-box {
            .payMsg {
                background-color: #fff;
                width: 100%;
                text-align: center;
                padding-top: rem(33);
                padding-bottom: rem(31);
                img {
                    width: rem(60);
                }
                p {
                    color: #666;
                    margin-top: rem(13);
                }
            }
            .payMsg2 {
                width: 100%;
                background-color: #fff;
                margin-top: rem(10);
                padding: rem(15);
                h2 {
                    font-weight: 600;
                    padding: rem(5) 0;
                    line-height: rem(24);
                    span {
                        font-size: rem(24);
                        color: #3196FF;
                        margin-left: rem(15);
                    }
                }
                p {
                    line-height: rem(21);
                    font-size: rem(12);
                    color: #808080;
                }
            }
        }
    }
    .footer {
        height: rem(49);
        button {
            width: 100%;
            height: 100%;
            color: #fff;
            background-color: #469AF4;
            border-radius: 0;
            font-size: rem(16);
        }
    }
}
</style>

