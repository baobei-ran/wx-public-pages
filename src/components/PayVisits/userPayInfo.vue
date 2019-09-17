<template>
    <!-- 患者问诊信息 -->
    <div class="usePayInfo">
        <ul>
            <li class="dis_f dis_sb">
                <span>就诊人</span>
                <span>李二牛（本人）</span>
            </li>
            <li class="dis_f dis_sb">
                <span>最近一次医院就诊时间</span>
                <span>2018-08-21</span>
            </li>
            <li class="dis_f dis_sb">
                <span>就诊医院</span>
                <span>山东省立医院</span>
            </li>
            <li class="dis_f dis_sb">
                <span>就诊科室</span>
                <span>皮肤科</span>
            </li>
            <li class="dis_f dis_sb">
                <span>确认疾病</span>
                <span>感冒</span>
            </li>
        </ul>
        <div class="userMsg">
            <h2>病情描述</h2>
            <p>感冒发烧流鼻涕，感冒发烧流鼻涕，感冒发烧流鼻涕</p>
        </div>
        <div class="userMsg userPic">
            <h2>病情照片</h2>
            <p>患者上传的化验单、检查资料、报告单、处方单等</p>
            <div>
                <img v-for="(val,i) in 10" :style="i%4==3?'margin-right: 0;':''" src="../../common/img/pic_yptp.png" alt="" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'usePayInfo',
    data () {
        return {

        }
    },
    mounted () {

    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.usePayInfo {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    background-color: #F4F4F4;
    > ul {
        width: 100%;
        background-color: #fff;
        padding: rem(15) 0;
        li {
            width: 100%;
            padding: rem(15) rem(30);
            span {
                display: inline-block;
                color: #333;
            }
            span:first-child {
                color: #808080;
            }
        }
    }
    .userMsg {
        width: 100%;
        margin-top: rem(20);
        background-color: #fff;
        padding:rem(30);
        h2 {
            color: #333;
        }
        >p {
            color: #808080;
            margin-top: rem(29);
            font-size: rem(24);
            line-height: rem(40);
        }
    }
    .userPic {
        div {
            width: 100%;
            img {
                margin-top: rem(29);
                width: rem(150);
                height: rem(150);
                margin-right: rem(30);
            }
        }
    }
}
</style>