<template>
    <div class="detail bg_f">
        <!-- 推荐用药药品详情 -->
       <div class="content flex1">
            <div class="bg_f imgarr">
               <img :src="$http.baseURL+datalist.pic" alt="">
            </div>
            <div class="title bg_f">
                <span class="price" >￥<span style='font-size: .28rem;'>{{ datalist.money }}</span></span>
                <h4>{{ datalist.mc }}</h4>
                <p><span>{{ datalist.monthly }}</span>人购买</p>
            </div>
            <section class="detail_con Mg-T bg_f">       
                <ul>
                    <li class="color_blue"><span>商品类型：</span><span>{{ datalist.cfy }}</span></li>
                    <li><span>商品剂型：</span><span>{{ datalist.cf }}</span></li>
                    <li><span>商品用法：</span><span>{{ datalist.yfyl }}</span></li>
                </ul>
                <ul>
                    <li class="color_blue"><span>规格：</span><span>{{ datalist.gg }}</span></li>
                    <li><span>成分：</span><span>{{ datalist.cf }}</span></li>
                    <li><span>性状：</span><span>{{ datalist.xz }}</span></li>
                    <!-- <li><span>功能主治：</span><span>{{ datalist.attending_functions }}</span></li> -->
                    <li><span>用法用量：</span><span>{{ datalist.yfyl }}</span></li>
                    <li><span>生产厂家：</span><span>{{ datalist.cjdz }}</span></li>
                    <li><span>有效期：</span><span>{{ datalist.yxq }}</span></li>
                    <li><span>批准文号：</span><span>{{ datalist.pzwh }}</span></li>
                    <li><span>注意事项：</span><span>{{ datalist.zysx }}</span></li>
                </ul>
            </section>
           
           
       </div>
        
    </div>
</template>
<script>
export default {
    data () {
        return {
            datalist:{}
        }
    },
    mounted () {
       this.initdata()
    },
    methods: {
        initdata () {
            var _this = this;
            var id = this.$route.query.id
            this.$http.post('/mobile/wxorder/good_look', { id: id}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    _this.datalist = res.data
                } else {

                }
            }).catch(err => { console.log(err)})
        }
        
    }
}
</script>


<style lang='scss' scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
$color: #333;


.bg_f {
    background-color: #fff;
    >img {
        width: 100%;
    }
}
$w: 100%;
.detail {
    width: 100%;
    height: 100%;
    color: $color;
    background-color: #f4f4f4;
    position: relative;
    font-size: rem(16);
    display: -webkit-box; 
    display: -moz-box; 
    display: -webkit-flex; 
    display: -moz-flex; 
    display: -ms-flexbox; 
    display: flex;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    .fiexd {
        width: 100%;
        position: absolute;
        display: -webkit-box; 
        display: -moz-box; 
        display: -webkit-flex; 
        display: -moz-flex; 
        display: -ms-flexbox; 
        display: flex;
        z-index: 10;
        top: rem(23);
        left: 0;
        padding: 0 rem(11);
        justify-content: space-between;
        .backs {
            width: rem(29);
            height: rem(29);
        }
        >div {
            width: rem(61);
            height: rem(29);
            border-radius: rem(15);
            background-color: rgba(0,0,0,.3);
            font-size: rem(12);
            color: #fff;
            text-align: center;
            line-height: rem(29);
            >img {
                width:rem(25);
                vertical-align: middle;
            }
        }
    }

    .content {
        width: 100%;
        -webkit-flex:1;
        flex: 1;
        overflow-y:scroll;
        .imgarr {
            width:100%;
           img {
               width: 100%;
           }
        }
        .title {
        font-size: 0.28rem;
        padding: 0.21rem;
         .price {
            font-size: 0.22rem;
            color: #E9541F;
            font-weight: 550;
        }
        h4 {
            font-weight:500;
            color:#333;
            line-height:0.33rem;
            margin-top: 0.19rem;
        }
        p {
            margin-top: 0.38rem;
            color:#A9A9A9;
            font-size: 0.22rem;
            span {
                color: #A9A9A9;
            }
        }
    }
    .Mg-T {
        margin-top: rem(10);
    }
    .detail_con {
        font-size: 0.28rem;
        overflow: hidden;
        ul {
            font-weight: 400;
            li {
                padding: 0 0.23rem;
                width: 100%;
                margin: 0.2rem 0;
                display: -webkit-box; 
                display: -moz-box; 
                display: -webkit-flex; 
                display: -moz-flex; 
                display: -ms-flexbox; 
                display: flex;
                font-size: rem(13);
                span {
                    line-height: rem(24);
                }
                span:first-child {
                    color: #808080;
                    display: block;
                    width: rem(85);
                }
                span:last-child {
                    display: block;
                    width: 75%;
                    color: #333;
                }
            }
            .color_blue {
                padding: 0 0.2rem;
                border-left: 3px solid #5189F6;
            }
        }
        ul:first-child {
            border-bottom: 1px solid #E0E0E0;
        }
    }
}
}
</style>
