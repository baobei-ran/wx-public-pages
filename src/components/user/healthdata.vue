<template>
    <div class="healthdata">
        <div class="header">
            <img src="../../common/img/icon_return.png" alt="">
            <span>健康数据</span>
        </div>
        <main class="content">
            <div class="content_box">
                <div class="msg">
                    <p>此信息仅供主治医生查看，请认真填写</p>
                </div>
                <ul class="info">
                    <li>
                        <label for="">肝功能</label>
                        <input type="text" placeholder="默认为正常">
                    </li>
                    <li>
                        <label for="">肾功能</label>
                        <input type="text" placeholder="默认为正常">
                    </li>
                    <li>
                        <label for="">过敏史</label>
                        <input type="text" placeholder="默认为无">
                    </li>
                    <li>
                        <label for="">过往病例</label>
                        <input type="text" placeholder="默认为无">
                    </li>
                    <li>
                        <label for="">备孕情况</label>
                        <input type="text" placeholder="默认为未孕">
                    </li>
                </ul>
            </div>
        </main>
        <div class="footer">
            <mt-button size="large" @click='reback'>取消</mt-button>
            <mt-button size="large" type="primary" @click='initdata'>确定</mt-button>
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
            initdata () {   // 确定
                this.$router.push('/authenticationYes')
            },
            reback () { // 取消
                this.out('/authenticationYes')
            }
        }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 +rem;
}
.healthdata {
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display:flex;
    flex-direction: column;
    font-size: rem(16);
    .header {
        display: -webkit-flex;
        display: flex;
        height: rem(64);
        justify-content: center;
        color: #212121;
        position: relative;
        box-shadow:0px 1px 0px 0px rgba(224,224,224,1);
        padding-top: rem(0);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background: #fff;
        img {
            font-size: rem(30);
            position: absolute;
            left: rem(15);
            top: rem(28);
            line-height: 1;
            font-size: rem(19);
            width: rem(30);
        }
        span {
            padding-top: rem(35);
            font-weight:400;
            color: #212121;
        }
    }
    .content {
        -webkit-flex:1;
        flex: 1;
        width: 100%;
        overflow: auto;
        .content_box {
            width: 100%;
            font-size: rem(14);
            .msg {
                width: 100%;
                text-align: center;
                color: #F45959;
                font-size: rem(12);
                margin-top: rem(20);
            }
            .info {
                width: 100%;
                li {
                    margin-top: rem(20);
                    padding: 0 rem(15);
                    label {
                        display: block;
                        margin-bottom: rem(10);
                    }
                    input[type=text] {
                        width:100%;
                        height: rem(55);
                        background: #F6F6F6;
                        border:0;
                        outline: none;
                        padding: rem(10);
                    }
                }
            }
        }
    }
    .footer {
        display: -webkit-flex;
        display: flex;
        height: rem(49);
        button {
            border-radius:0;
            height: 100%;
            font-size: rem(17);
        }
        button:first-child {
            background-color:#EDF5FE;
            color:#4A9CF3;
        }
    }
}
</style>

