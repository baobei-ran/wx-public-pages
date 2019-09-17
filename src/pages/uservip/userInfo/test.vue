<template>
    <div class="test dis_f flex_c">
        <div class="section flex1">
            <div class="section-box">
                <van-button type="info" @click="showPopup">立即获取</van-button>
            </div>
        </div>
        <div class="footer">
            <ul>
                <li>
                    <router-link exact to='/userhome'>个人首页</router-link>
                </li>
                <li>
                    <router-link exact to='/redPacketlist'>获取</router-link>
                </li>
            </ul>
        </div>
        <van-popup v-model="show" style="width: 80%;background-color:inherit;" :close-on-click-overlay='false'>
            <div class="redPacket">
                <img class="redPacket" src="../../../common/img/tc_sxjl.png" alt="" />
                <div class="deng"></div>
                <div class="btn">
                    <van-button style="width: 74%;background: #FFD1A8;border:0;opacity:0;" @click='handlebtn' :loading='loading' type="danger" loading-text="提交中..." >{{!loading?'立即提交':''}}</van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    data () {
        return {
            show: false,
            loading: false
        }
    },
    methods: {
        showPopup() {
            this.show = true;
        },
        handlebtn () {
            // this.loading = true;
            // setTimeout(() => {
                this.loading = false;
                this.show = false;
            // }, 3000)
        }
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px /100+rem;
}
.test {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    padding: rem(30);
    .section {
        width: 100%;
        &-box {
            text-align: center;
        }
    }
    .redPacket {
        width: 100%;
        position: relative;
        overflow: hidden;
        img {
            width: 100%;
            // -webkit-box-shadow: 0 0 20px orange;
            // border: 1px solid #f00;
            
        }
        .deng {
            width: 80%;
            height: 10%;
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            box-shadow:0px 10px 10px orange inset;
            // box-shadow:-10px 0px 10px orange inset,   /*右边阴影*/ 
            //         0px -10px 10px orange inset,  /*下边阴影*/ 
            //         10px 0px 10px orange inset,  /*左边阴影*/ 
            //         0px 10px 10px orange inset; /*上边阴影*/
        }
       .btn {
           width: 100%;
           position: absolute;
           bottom: 30px;
           text-align: center;
           
       }
    }
    .footer {
        width: 100%;
        ul {
            overflow: hidden;
            li {
                float: left;
                margin: 0 rem(10);
            }
        }
    }
}
a {
    color: blue;
}
</style>