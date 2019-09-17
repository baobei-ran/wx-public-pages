<template>
    <div class="err404">
        <div class="section dis_f dis_j flex_i flex_c">
            <img src="../../common/img/pic_404.png" alt="">
            <p>网络连接失败，<span @click='refresh'>点击刷新</span></p>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {

    },
    methods: {
        refresh () {
            this.$router.back()
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.err404 {
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: rem(14);
    .section {
        width: 100%;
        height: 100%;
        img {
            width: rem(120);
        }
        p {
            margin-top: rem(20);
            color: #333;
            span {
                color: #3196FF;
            }
        }
    }
}
</style>

