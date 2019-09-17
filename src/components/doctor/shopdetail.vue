<template>
    <div class="detail bg_f">
        <!-- <div class="fiexd">
            <img class="backs" @click='Returns' src="../../common/img/icon_return.png" alt="">
            <div><img src="../../common/img/icon_tj.png" alt="">推荐</div>
        </div> -->
       <div class="content flex1">
            <div class="bg_f imgarr">
                <div class="swiper-container">
                    <ul class="swiper-wrapper">
                        <li class="swiper-slide" style="float:left;" v-for='(val,i) in pics' :key='i'>
                            <img class="v-pics" :src="$http.baseURL+val.img" alt="">
                        </li>
                    </ul>
                    <ol class="swiper-pagination"></ol>
                </div>
            </div>
            <div class="title bg_f">
                <span class="price" >￥<span style='font-size: .28rem;'>{{ datalist.price }}</span></span>
                <h4>{{ datalist.name }}</h4>
                <p><span>{{ datalist.sales_volume }}</span>人购买</p>
            </div>
            <section class="detail_con Mg-T bg_f" v-if='datalist.type == 1? true:false'>        <!--  1 药品 2 保健品 3 医疗器械 -->
                <ul>
                    <li class="color_blue"><span>商品类型：</span><span>{{ datalist.recipe }}</span></li>
                    <li><span>商品剂型：</span><span>{{ datalist.type2 }}</span></li>
                    <li><span>商品用法：</span><span>{{ datalist.usetype }}</span></li>
                </ul>
                <ul>
                    <li class="color_blue"><span>规格：</span><span>{{ datalist.specification }}</span></li>
                    <li><span>成分：</span><span>{{ datalist.type2 }}</span></li>
                    <li><span>性状：</span><span>{{ datalist.usetype }}</span></li>
                    <li><span>功能主治：</span><span>{{ datalist.attending_functions }}</span></li>
                    <li><span>用法用量：</span><span>{{ datalist.dose }}</span></li>
                    <li><span>生产厂家：</span><span>{{ datalist.enterprise }}</span></li>
                    <li><span>有效期：</span><span>{{ datalist.uselife }}</span></li>
                    <li><span>批准文号：</span><span>{{ datalist.code }}</span></li>
                    <li><span>注意事项：</span><span>{{ datalist.cautions }}</span></li>
                </ul>
            </section>
            <section class="detail_con bg_f" v-if='datalist.type == 2?true:false'>
                <ul>
                    <li><span>保健功能：</span><span>{{ datalist.health }}</span></li>
                    <li><span>商品剂型：</span><span>{{ datalist.type2 }}</span></li>
                    <li><span>商品用法：</span><span>{{ datalist.usetype }}</span></li>
                </ul>
                <ul>
                    <li><span>规格：</span><span>{{ datalist.specification }}</span></li>
                    <li><span>成分：</span><span>{{ datalist.type2 }}</span></li>
                    <li><span>性状：</span><span>{{ datalist.usetype }}</span></li>
                    <li><span>适宜人群：</span><span>{{ datalist.appropriate }}</span></li>
                    <li><span>用法用量：</span><span>{{ datalist.dose }}</span></li>
                    <li><span>生产厂家：</span><span>{{ datalist.enterprise }}</span></li>
                    <li><span>有效期：</span><span>{{ datalist.uselife }}</span></li>
                    <li><span>批准文号：</span><span>{{ datalist.code }}</span></li>
                    <li><span>注意事项：</span><span>{{ datalist.cautions }}</span></li>
                </ul>
            </section>
            <section class="detail_con bg_f" v-if='datalist.type == 3?true:false'>
                <ul>
                </ul>
                <ul>
                    <li><span>型号：</span><span>{{ datalist.model }}</span></li>
                    <li><span>生产企业：</span><span>{{ datalist.enterprise }}</span></li>
                    <li><span>适宜人群：</span><span>{{ datalist.appropriate }}</span></li>
                    <li><span>使用方法：</span><span>{{ datalist.usetype }}</span></li>
                    <li><span>注意事项：</span><span>{{ datalist.cautions }}</span></li>
                </ul>
            </section>
            <div class="cont_img">
                <img v-for='(val,i) in imgs' :key='i' :src="$http.baseURL+val.img" alt="">
            </div>
       </div>
        <div class="footer" v-show="footbtn">
                <mt-button class="btnback" type="default"  @click.native='Returns'>店铺首页</mt-button>
                <mt-button class="clickup" type="primary" @click.native="showModal">立即购买</mt-button>
        </div>
        <mt-popup style='width: 100%;'
            v-model="popupVisible"
            position="bottom">
            <div class="modals">
                <dl class="dl_detail dis_f">
                    <dt id='dt_img'>
                        <img :src="$http.baseURL+datalist.pic" alt="">
                    </dt>
                    <dd>
                        ￥{{ datalist.price }}
                    </dd>
                    <dd class="delss" @click='colseModal'><span>x</span></dd>
                </dl>
                <div class="gui" v-if='datalist.type == 3?false:true'>
                    <h3>规格</h3>
                    <ul class="dis_f">
                        <li :class="{'liactive':true }" @click='specification(datalist.specification)'>{{ datalist.specification }}</li> 
                    </ul>
                </div>
                <div class="num dis_f dis_sb">
                    <span>购买数量</span>
                    <div class="handle dis_f">
                        <span @click='subtractnumber'>-</span>
                        <span>{{ num }}</span>
                        <span @click='addnumber'>+</span>
                    </div>
                </div>
            <div class="foots">
                <mt-button class="clickup" type="primary" @click.native="cerateOrder">立即购买</mt-button>
            </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
export default {
    data () {
        return {
            datalist:{
                attending_functions: "",
                cautions: "",
                code: "",
                dose: "",
                enterprise: "",
                name: "",
                pic: "",
                price: "",
                recipe: 1,
                sales_volume: 0,
                specification: "",
                state: 1,
                type: '',
                type2: "",
                uselife: "",
                usetype: 1
            },
            num: 1,
            imgs: [],
            pics: [],
            popupVisible: false,
            gTxt: '',                   // 规格
            footbtn: true,
        }
    },
    mounted () {
        if (this.$route.query.type && this.$route.query.type == 1) {
            this.footbtn = false
        } else {
            this.footbtn = true
        }
        var _this = this;
        var id = this.$route.query.id
        console.log(this.$route)
        this.$http.post('/mobile/doch5/doc_goods_detail', { id: id}).then(res => {
            console.log(res)
            if (res.code == 1) {
                _this.$nextTick(() => {
                    _this.datalist = res.data
                    _this.datalist.usetype = res.data.usetype == 1? '内服': '外用'
                    _this.datalist.recipe = res.data.recipe == 0? '非处方':'处方'
                    _this.imgs = res.img
                    _this.pics = res.pic
                    _this.$nextTick(() => {
                        if (_this.pics.length > 1) {
                            var swipers = new Swiper ('.swiper-container', {
                                loop: true,
                                autoplay: true,
                                pagination: {
                                    el: '.swiper-pagination'
                                }, 
                                
                            }) 
                        }
                        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
                        if (ua.match(/MicroMessenger/i) == "micromessenger") {
                            _this.$nextTick(() => {
                                _this.funcReadImgInfo('.v-pics');
                            })
                        }
                     })
                })
            } else {

            }
        }).catch(err => { console.log(err)})
        
        
    },
    methods: {
        Returns () {
            this.$router.back()
        },
        cerateOrder () {     // 下单
            var self = this;
            // if (this.datalist.type !== 3 && this.gTxt == '') {
            //     self.$toast({
            //         message: '请选择规格',
            //         position: 'middle',
            //         duration: 3000
            //     });
            //         return false;
            // }
            this.$router.push({ path: '/doctororder', query: { id: this.$route.query.id, num: this.num }})
        },
        showModal () { // 开启 modal
            this.popupVisible = true
        },
        colseModal () { // 关闭 modal
            this.popupVisible = false
        },
        addnumber () { // 加
            this.num ++
        },
        subtractnumber () { // 减
            if (this.num == 1) {
                return;
            }
            this.num --
        },
        specification (n) {
            this.gTxt = n
        },
         /*调用微信预览图片的方法*/
        funcReadImgInfo: function (dom) {
            var imgs = [];
            // var imgObj = $(".imgs img");//这里改成相应的对象
            var imgObj = $(dom)
            for(var i=0; i<imgObj.length; i++) {
                imgs.push(imgObj.eq(i).attr('src'));
                imgObj.eq(i).click(function() {
                    console.log(this)
                    var nowImgurl = $(this).attr('src');
                        WeixinJSBridge.invoke("imagePreview",{
                    "urls":imgs,
                    "current":nowImgurl
                });
                });
            }
        },
    }
}
</script>


<style lang='scss'>
.imgarr {
.swiper-container {
    width:100%;
    .swiper-wrapper {
        
        .swiper-slide {
            
            > img {
                width: 100%;
            }
        }
    }
}
}
img {
    max-width: 100%!important;
}

</style>



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
                line-height: 20px;
                span:first-child {
                    color: #808080;
                    display: block;
                    width: 30%;
                }
                span:last-child {
                    display: block;
                    width: 70%;
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
    .cont_img {
        width: 100%;
        font-size: 0.28rem;
        padding-bottom: rem(5);
        img {
            display: block;
            width: 100%;
            height: auto;
        }
    }
    
}
    

    .footer {
        width:100%;
        height: rem(55);
        border-top: 1px solid #E0E0E0;
        padding: rem(7) rem(14);
        -webkit-display: flex;
        display: flex;
        font-size: rem(14);
        .btnback {
            width: 35%;
            color:#333;
            border:1px solid rgba(224, 224, 224, 1);
            font-size:rem(14);
            border:0;
            -webkit-box-shadow: 0 0 0 0;
            box-shadow:0 0 0 0;
        }
        .clickup {
            width: 65%;
            margin-left: rem(7);
            font-size: rem(14);
            background-color: #5189F6;
        }
    }

   
}

    .modals {
        width: $w;
        background-color: #FFF;
        position: relative;
        padding: rem(15) rem(15) rem(200) rem(15);
        .dl_detail {
            width: 100%;
            border-bottom: 1px solid #E6E6E6;
            padding-bottom: rem(15);
            position: relative;
            > #dt_img {
                width: rem(100);
                height: rem(100);
                border: 1px solid #E6E6E6;
                -webkit-border-radius: 4px;
                border-radius: 4px;
                > img {
                    width: rem(100);
                    height: rem(100);
                    -webkit-border-radius: 4px;
                    border-radius: 4px;
                    background-color: #EFEFEF;
                }
            }
            dd {
                margin-top: rem(80);
                margin-left: rem(13);
                color: #F09F88;
            }
            .delss {
                margin: 0;
                position: absolute;
                right: 0;
                top: 0;
                width: rem(30);
                height: rem(30);
                color: #808080;
                > span {
                    display: block;
                    width: rem(20);
                    height: rem(20);
                    line-height: rem(18);
                    text-align: center;
                    border: 1px solid #aaa;
                    -webkit-border-radius: 100%;
                    border-radius: 100%;
                }
            }
        }
        .gui {
            width: 100%;
            padding: rem(15) 0;
            border-bottom: 1px solid #E6E6E6;

            > h3 {
                margin-bottom: rem(15);
                color: #333;
                font-size: rem(14);
            }
            > ul {
                width: 100%;
                li {
                    width: rem(84);
                    height: rem(25);
                    text-align: center;
                    line-height: rem(25);
                    background-color: #EEEEEE;
                    font-size: rem(12);
                    color: #808080;
                    -webkit-border-radius:2px;
                    border-radius:2px;
                    margin-right: rem(10);
                    cursor: pointer;
                }
                .liactive {
                    color:#469AF4;
                    background-color: #ECF5FE;
                    border:1px solid #469AF4;
                }
            }
        }

        .num {
            width: 100%;
            padding: rem(15) 0;
            >span {
                margin-top: rem(5);
            }
            .handle {
                > span {
                    display: block;
                    width: rem(25);
                    height: rem(25);
                    text-align: center;
                    line-height: rem(27);
                    color: #808080;
                    margin-left: rem(4);
                    background-color: #EEEEEE;
                    -webkit-border-radius:2px;
                    border-radius:2px;
                }
                > span:nth-child(2) {
                    width: rem(35);
                }
            }
        }

        .foots {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: rem(49);
            >button {
                width: 100%;
                height: 100%;
                color: #fff;
                background-color: #5189F6;
                font-size: rem(17);
                -webkit-border-radius: 0;
                border-radius: 0;
            }
        }
    }
</style>
