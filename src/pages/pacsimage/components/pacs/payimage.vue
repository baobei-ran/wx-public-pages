<template>
    <div class="payimage">
        <div class="payimage-content">
            <h2>北京同仁医院亦庄分院 <br /> 电子影像 </h2>
            <p>￥<span>20.00</span></p>
            <div>
                <van-button style='background-color:#505EDE;border-color:#505EDE;' @click='handlePay' type="info">支付数字影像</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'payimage',
    data () {
        return {
            
        }
    },
    methods: {
        handlePay () {
            this.$toast('支付');
            setTimeout(() => {
                this.$toast.clear();
                this.$router.push('/paysuccess')
            }, 1000)
        }
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.payimage {
    width: 100%;
    font-size: rem(28);
    &-content {
        margin-top: rem(159);
        text-align: center;
        h2 {
            color: #333;
            font-size: rem(34);
            line-height: rem(48);
        }
        p {
            font-size: rem(34);
            margin-top: rem(59);
            color: #333;
            font-weight: 500;
            span {
                font-size: rem(60);
            }
        }
        >div {
            margin-top: rem(99);
            text-align: center;
        }
    }
}
</style>