<template>
    <!-- 电子病历的无数据展示 -->
    <div class="dzblempty">
        <div class="ep-pic">
            <img src="../../../common/img/pic_zwys.png" alt="">
            <p>暂无就诊人</p>
        </div>
        <div class="dzbl-btn">
            <mt-button @click.native="handleClickadd">添加此类就诊人</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        handleClickadd () {
            this.out('/administration');
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.dzblempty {
    width: 100%;
    margin-top: rem(20);
    background-color: #fff;
    .ep-pic {
        text-align: center;
        padding-top: rem(118);
        img {
            width: rem(300);
            height: rem(300);
        }
        p {
            margin-top: rem(18);
            color: #333;
            font-size: rem(26);
        }
    }
    .dzbl-btn {
        text-align: center;
        margin-top: rem(100);
        padding-bottom: rem(161);
        button {
            padding: rem(20) rem(23);
            color: #469AF4;
            font-size: rem(28);
            border: 1px solid #469AF4;
            height: auto;
            background-color: #fff;
        }
    }
}
</style>

