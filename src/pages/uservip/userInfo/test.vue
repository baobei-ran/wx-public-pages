<template>
    <div class="test dis_f flex_c">
        <div class="section flex1">
            <div class="section-box">
                <van-button type="info" @click="showPopup">立即获取</van-button>
            </div>
            <viewer >
                <img style="width: 100%" src="http://hb.meizankj.com/static/upload/201909161568611810277.png" >
            </viewer>
            <div id='zoomPic' >
                <img class="imgs" src="http://hb.meizankj.com/static/upload/201909161568611810277.png" alt="" />
            </div>
            <section class="imgzoom_pack">
                <div class="imgzoom_x">X</div>
                <div class="imgzoom_img"><img src=""/></div>
            </section>
            <div>
                <img style="width: 100%" :src="url" preview="" preview-text="" />
            </div>
        </div>
        <van-popup v-model="show" style="width: 80%;background-color:inherit;" :close-on-click-overlay='false'>
            <div class="redPacket">
                <img class="redPacket" src="../../../common/img/tc_sxjl.png" alt="" />
                <div class="deng"></div>
                <div class="btn">
                    <van-button style="width: 74%;background: #FFD1A8;border:0;opacity:0.8;" @click='handlebtn' :loading='loading' type="danger" loading-text="提交中..." >{{!loading?'立即提交':''}}</van-button>
                </div>
            </div>
        </van-popup>
        <div class="footer">
            <ul>
                <li>
                    <van-button plain hairline type="danger" @click='handleHome'>个人首页</van-button>
                </li>
                <li>
                    <van-button plain hairline type="danger" @click='$router.push("/redPacketlist")'>获取红包</van-button>
                </li>
                <li>
                    <van-button plain hairline type="danger" @click='$router.push("/canvasdata?id=253")'>缩略图</van-button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import Zoom from '../../../utils/zoom.js'
export default {
    data () {
        return {
            show: false,
            loading: false,
            url: 'http://hb.meizankj.com/static/upload/201909161568611810277.png'
        }
    },
    mounted () {
       this.$nextTick(() => {
        Zoom.init({
            'elem': '#zoomPic'
        })
       })
    //    this.$previewRefresh()  // 图片预览vue-photo-preview插件问题：数据是异步获取回来的，会出现不管你怎么点击，都不会出现效果。这就需要在你成功获取数据回来之后，加上 this.$previewRefresh() ，刷新重置一下
    },
    methods: {
        showPopup() {
            this.show = true;
        },
        handlebtn () {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.show = false;
            }, 3000)
        },
        handleHome () {
            this.$router.push('/userhome')
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
            width: 100%;
            li {
                display: inline-block;
                margin: 0 rem(10);
            }
        }
    }
    
         #zoomPic {
            width: 100%;            
            > img {
                width: 100%;
            }
        }
        .imgzoom_pack{
            width:100%;
            height:100%;
            position:fixed;
            left:0;
            top:0;
            z-index: 1000;
            background:rgba(0,0,0,0.95);
            display:none;
            }
            .imgzoom_pack .imgzoom_x{
                color:#000;
                height:rem(60);
                width:rem(60);
                line-height:rem(60);
                background: #ffffff;
                text-align:center;
                position:absolute;
                right:rem(30);
                top:rem(30);
                border-radius: 50%;
                z-index:10;
                cursor:pointer;
            }
            .imgzoom_pack .imgzoom_img{
            width:100%;
            height:100%;
            position:absolute;
            left:0;
            top:0;
            overflow:hidden;
            }
            .imgzoom_pack .imgzoom_img img{
            width:100%;
            position:absolute;
            top:50%;
            }
    }


</style>