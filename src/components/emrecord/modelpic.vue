<template>
    <!-- 图片预览组件 -->
    <div class="modelpic dis_f flex-vc" @click='clickModelShade'>
        <div class="swiper-container">
            <div class="swiper-wrapper dis_f flex-vc">
                <div class="swiper-slide" v-for="(pic, i) in picdata" :key="i">
                    <img ref='imgs' :src="$http.baseURL+pic" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            picdata: [],
            swiper: '',
        }
    },
    methods: {
        clickModelShade () {
            this.$emit('modelShade', false);
        },
        modelScalePic (data, i) {
            this.picdata = data;
            var self = this;
            if (this.swiper) {
                this.swiper = ''
            }
            if (this.picdata.length > 1) {
                console.log(i)
                this.$nextTick(() => {
                    self.swiper = new Swiper('.swiper-container', {
                        initialSlide: i?i:0,
                        loop: false,
                        autoplay: false,
                        observer:true,              //修改swiper自己或子元素时，自动初始化swiper
	                    observeParents:true,        //修改swiper的父元素时，自动初始化swiper
                    })
                })
            }
        },
    }
}
</script>
<style lang="scss">
.modelpic  {
    height: 100%;
   >.swiper-container {
        width:100%;
        .swiper-wrapper {
            .swiper-slide {
                text-align: center;
                > img {
                   width: 100%;
                   max-height: 600px;
                    // height: auto;
                }
            }
        }
    }
}
</style>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.modelpic {
   width: 100%;
   height: 100%;
}
</style>
