<template>

    <div class="empty">
        <img src="../../../common/img/pic_zwdd.png" alt="">
        <p>还没有相关订单信息呢，快<span @click='outShop'>去逛逛</span>吧！</p>
    </div>
</template>

<script>
export default {
    methods: {
        outShop () {    // 去逛逛按钮
            this.out('/doctorshoplist')
        },
    }
}
</script>

<style>
                /* 这只是一个公用组件 */
</style>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
 .empty {
        width: 100%;
        text-align: center;
        padding-top: rem(50);
        img {
            width:rem(120);
        }
        >p {
            color: #808080;
            font-size: rem(14);
            margin-top: rem(30);
            >span {
                color: #4A9CF3;
            }
        }
    }
</style>
