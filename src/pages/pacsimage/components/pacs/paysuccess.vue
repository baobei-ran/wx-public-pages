<template>
    <div class="paysuccess">
        <div class="paysuccess-content">
            <img src="../../../../common/img/icon_zfcgyes.png" alt="" />
            <h2>影像支付成功</h2>
            <p>点此关注<a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU5NTk0MDg0Mg==&scene=124#wechat_redirect"><全景云医康></a>公众号，查看数字影像</p>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.paysuccess {
    width: 100%;
    font-size: rem(28);
    &-content {
        margin-top: rem(190); 
        width: 100%;
        text-align: center;
        img {
            display: block;
            width: rem(110);
            height: rem(110);
            margin: 0 auto;
        }
        h2 {
            margin-top: rem(37);
            font-size: rem(32);
            color: #333333;
            font-weight:500;
        }
        p {
            margin-top: rem(122);
            font-size: rem(28);
            color: #808080;
            > a {
                color: #505EDE;
            }
        }
    }
}
</style>