<template>
    <!-- 图片展示 活动页 -->
    <div class="activity">
        <ul>
            <li><img src="../../common/images/415_01.jpg" alt=""></li>
            <li><img src="../../common/images/415_02.jpg" alt=""></li>
            <li><img src="../../common/images/415_03.jpg" alt=""></li>
            <li><img src="../../common/images/415_04.jpg" alt=""></li>
            <li><img src="../../common/images/415_05.jpg" alt=""></li>
            <li><img src="../../common/images/415_06.jpg" alt=""></li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px/50+rem;
}
    .activity {
        width: 100%;
        overflow-y: scroll;
        font-size: rem(16);
        ul{
            li {
                width: 100%;
                margin: 0;
                padding: 0;
                img {
                    width: 100%;
                    margin-top: rem(-5);
                }
            }
        }
    }
</style>

