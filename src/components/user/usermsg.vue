<template>
    <div class="usermsg">
        <div class="info">
            <img src="../../common/img/icon-rz.png" alt="">
            <p>信息认证完成，返回公众号 <br />
                点击“我的医生”即可与医生在线沟通</p>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.usermsg {
    width: 100%;
    height: 100%;
    .info {
        padding-top: rem(85);
        text-align: center;
        img {
            width: rem(73);
        }
        p {
            color: #666;
            font-size: rem(16);
            line-height: rem(26);
        }
    }
}
</style>

