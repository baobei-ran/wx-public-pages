<template>
    <!-- 支付成功 -->
    <div class="wxpaySucceed">
        <div class="image">
            <img src="../../common/img/icon_zfcg.png" alt="">
            <p>支付成功</p>
        </div>
        <div class="btn">
            <mt-button type="primary" @click.native='handerdoc2'>查看预约详情</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'wxpaySucceed',
    data () {
        return {
            rid: this.$route.query.rid
        }
    },
    methods: {
        handerdoc2 () { // 预约门诊中的详情
            this.$router.replace({ path: '/subscribeDetail', query: { rid: this.rid }})
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.wxpaySucceed {
    width: 100%;
    height: 100%;
    font-size: rem(14);
    .image {
        width: 100%;
        text-align: center;
        margin-top: rem(78);
        img {
            width: rem(50);
            color: #3196FF;
        }
        p {
            text-align: center;
            margin-top: rem(33);
            color: #666666;
        }
    }
    .btn {
        width: 100%;
        text-align: center;
        margin-top: rem(20);
        button {
            width: rem(130);
            height: rem(34);
            font-size: rem(14);
            background-color: #3196FF;
        }
    }
}
</style>

