<template>
    <!-- <div class="ser_home">
        <ul class="red_packet" id="red_packet">
            <template v-for="(item, index) in liParams">
                <li :style="{ left: item.left, animationDuration: item.durTime, webkitAnimationDuration: item.durTime}" 
  :class="item.cls" :data-index="index" @webkitAnimationEnd="removeDom" @click='removeDom'>
                    <a href='javascript:;'>
                        <i :style="{ transform: item.transforms, webkitTransform: item.transforms}"></i>
                    </a>
                </li>
            </template>
        </ul>
    </div> -->
    <div class="iframes">
        <iframe :src='paths' frameborder="no" scrolling="no" allowtransparency="yes" ></iframe>
    </div>
</template>


<script>
export default {
    data () {
        return {
            liParams: [],
            timer: null,
            duration: 10000, // 定义时间
            paths: 'http://wechat.client.pacsonline.cn/index_yyk.html#/reportInfo/report?license=c57f12f695585bacb79de89030beedf8&exam_id=116bf91d37e95c60&study_id=116bf91d37c7e59d'
        }
    },
    mounted () {
        this.startRedPacket()
    },
    methods: {
        /**
         * 开启动画
         */
        startRedPacket() {
            let win = document.documentElement.clientWidth || document.body.clientWidth
            let left = parseInt(Math.random() * (win - 50) + 0);
            
            let rotate = (parseInt(Math.random() * (45 - (-45)) - 45)) + "deg";  // 旋转角度
            let scales = (Math.random() * (12 - 8 + 1) + 8) * 0.1;  // 图片尺寸
            let durTime = (Math.random() * (2.5 - 1.2 + 1) + 1.2) + 's'; // 时间  1.2和1.2这个数值保持一样
            // console.log(durTime)
            this.liParams.push({left: left+'px', cls: 'move_1', transforms: 'rotate('+ rotate +') scale('+ scales +')', durTime: durTime})


            setTimeout( () =>  {   // 多少时间结束
                clearTimeout(this.timer)
                return;
            }, this.duration)
            this.timer = setTimeout( () => {
                this.startRedPacket()
            },100)   
        },
        /**
         * 回收dom节点
         */
        removeDom (e) {
            let target = e.currentTarget;
            console.log(target)
            document.querySelector('#red_packet').removeChild(target)
        }
    },
    beforeDestroy () {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }
}
</script>

<style scoped lang="scss">
.iframes {
    width: 100%;
    height: 100%;
    min-height: 99%;
    overflow: hidden;
    iframe {
        width: 100%;
        height: 100%;
        border: 0;
    }
}
.ser_home {
    width: 100%;
    height: 100%;
    background: url('../../../common/img/hby.png') no-repeat;
    background-size: cover;
}
.red_packet {
    display: block;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    i {
        width: 60px;
        // height: 69px;
        height: 70px;
        display: block;
        background: url('../../../common/img/petal9.png') no-repeat;
        background-size: contain;
    }
    li {
        position: absolute;
        animation: all 3s linear;
        top:-100px;
        z-index: 10;
        &.move_1 {
            -webkit-animation: aim_move 5s linear 1 forwards;
            animation: aim_move 5s linear 1 forwards;
        }
    }
    a {
        display: block;
    }
}


@keyframes aim_move {
      0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
      }
      100% {
        -webkit-transform: translateY(120vh);
        transform: translateY(120vh);
      }
    }


</style>