<template>
    <div class="recipe dis_f flex_d">
        <!-- <div class="header dis_f flex-hc">
            <img @click='Return' src="../../common/img/icon_fh.png" alt="">
            <span>处方信息</span>
        </div> -->
        <div class="flex1 section_box">
            <div class="section">
                <div class="box">
                    <div class="msg" v-if='recipedata.status == 1'>
                       <img src="../../common/img/icon_cfykjs.png" alt="" /><span>处方开具成功</span>
                    </div>
                    <div class="msg oranges" v-if='recipedata.status == 2'>
                        <img src="../../common/img/icon_cfykjc.png" alt="" /><span>处方已过期</span>
                    </div>
                    <div class="img">
                        <div class="img_box">
                             <div class='html_content' id='htmls'>
                                    <div class="canvas_head">
                                        <ul class="dis_sa">
                                            <li>处方编号：<span>{{ canvasdata.number }}</span></li>
                                            <li>处方生成时间：<span>{{ canvasdata.start_time | filterTime }}</span></li>
                                            <li>处方有效时间：<span>{{ canvasdata.undue_time | filterTime }}</span></li>
                                        </ul>
                                    </div>
                                    <h2>云医康互联网医院电子处方</h2>
                                    <div class="canvas_user">
                                        <ul>
                                            <li>姓名：<span>{{ canvasdata.name }}</span></li>
                                            <li>性别：
                                                <span v-show='canvasdata.sex == 0'>男</span>
                                                <span v-show='canvasdata.sex == 1'>女</span>
                                            </li>
                                            <li>年龄：<span>{{ canvasdata.age }}</span></li>
                                        </ul>
                                        <ul>
                                            <li>肝功能：<span v-text='canvasdata.liver != "" ?canvasdata.liver: "正常" '></span></li>
                                            <li>肾功能：<span v-text='canvasdata.kidney != "" ?canvasdata.kidney: "正常" '></span></li>
                                            <li>备孕情况：<span v-text='canvasdata.yun != "" ?canvasdata.yun: "无" '></span></li>
                                        </ul>
                                        <ul>
                                            <li>过敏史：<span v-text='canvasdata.allergy != "" ?canvasdata.allergy: "无" '></span></li>
                                            <li>过往病史：<span v-text='canvasdata.ago != "" ?canvasdata.ago: "无" '></span></li>
                                        </ul>
                                        <ul>
                                            <li>诊断结果：<span>{{ canvasdata.result }}</span></li>
                                        </ul>
                                    </div>
                                    <div class="canvas_drug">
                                        <p>Rp:</p>
                                        <ol v-for='(val,i) in list'>
                                            <li>{{ val.company }} {{val.name}} <span>*{{ val.num }}</span></li>
                                            <li>用法：<b>{{ val.usage }}</b></li>
                                        </ol>
                                        <div class="tshi">
                                            <img :src="$http.baseURL+canvasdata.seal" alt="">
                                        </div>
                                    </div>
                                    <div class="msg">
                                        （以下空白，手写无效）
                                    </div>
                                    <div class="check">
                                        <ul>
                                            <li><span>处方医师：</span><img ref='doctorImg' :src="$http.baseURL+canvasdata.signpic" alt=""></li>
                                            <!-- <li><span>审核药师：</span><img src="../../common/img/img_dtzs.png" alt=""></li> -->
                                        </ul>
                                    </div>
                            </div>
                        </div>
                        <router-link class="danClick" :to="{ path: '/chufdetails', query : { id: this.$route.params.id }}">查看完整处方</router-link>
                    </div>
                    
                </div>
                <ul class="recipeMsg">
                    <li><span>处方单号：</span><span>{{ recipedata.number }}</span></li>
                    <li><span>开具时间：</span><span>{{ recipedata.start_time | filterTime }}</span></li>
                    <li><span>处方时效：</span><span>{{ recipedata.undue_time | filterTime }}</span></li>
                    <li><span>开具医生：</span><span>{{ recipedata.true_name }}</span></li>
                </ul>
                <div class="user">
                    <ul>
                        <li><span>患者信息：</span><span>{{ recipedata.name }}<b>|</b><span v-text='recipedata.sex == 1?"男":"女"'></span><b>|</b>{{ recipedata.age }}</span></li>
                        <!-- <li><p>患者主诉：</p><p ></p></li> -->
                        <li><span>诊断结果：</span><span>{{ recipedata.result }}</span></li>
                    </ul>
                </div>
                <div class="usage">
                    <div class="title">
                        处方中药品
                    </div>
                    <div class="usage_con">
                        <dl v-for="(val,i) in lists" :key='i'>
                            <dt>{{ val.name }}<b v-show="val.gg">({{val.gg}})</b> <span>x{{ val.num }}</span></dt>
                            <dd class="dis_f">
                                <p>用法用量：</p>
                                <p>{{ val.usage }}</p>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'recipeMsg',
    data () {
        return {
            recipedata: '',
            canvasdata: {},
            list: [],
            lists: []
        }
    },
    watch: {
        '$route': 'getdetails'
    },
    mounted() {
        console.log(this.$route.params)
        this.initdata()
    },
    methods: {
        initdata () {   // 处方详情
            var self = this,
                uid = this.$cookie.get('userLogins');
            var obj = { id: this.$route.params.id }
            this.$http.post('/mobile/doch5/user_recipe_detail', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.recipedata = res.data
                    self.lists = res.drug
                    self.canvasdata = res.data
                    self.list= res.drug
                }
            })
        },
        Return () {
            this.$router.back()
        },
       
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.recipe {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    background-color: #F9F9F9;
    .header {
        width: 100%;
        height: rem(40);
        color: #212121;
        position: relative;
        box-shadow:0px 1px 0px 0px rgba(224,224,224,1);
        padding-top: rem(0);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background-color: #fff;
        img {
            font-size: rem(30);
            position: absolute;
            left: rem(15);
            top: rem(12);
            line-height: 1;
            font-size: rem(19);
            width: rem(20);
        }
        span {
            padding-top: rem(15);
            font-weight:400;
            color: #212121;
        }
    }
    .section_box {
        overflow-y: scroll;
    }
    .section {
        width: 100%;
        .msg {
            width: 100%;
            height: rem(44);
            background-color: #E1F0FE;
            line-height: rem(44);
            padding-left: rem(16);
            color: #4A9CF3;
            font-size: rem(16);
            margin-bottom: rem(5);
            > img {
                width: rem(20);
                height: rem(20);
                vertical-align: middle;
                margin-right: rem(10);
            }
            span {
                vertical-align: middle;
            }
        }
        .oranges {
            color: #EC8158;
            background-color: #FDF2EE;
        }
        .box {
            width: 100%;
            background:rgba(255,255,255,1);
            border-radius:4px;
            .img {
                width: 100%;
                padding: rem(15);
                position: relative;
                .img_box {
                    width: 100%;
                    height: rem(150);
                    border: 1px solid #999;
                    overflow: hidden;
                      .html_content {
                        width: 200%;
                        height: 100%;
                        overflow: hidden;
                        font-size: rem(14);
                        padding: 0 rem(10);
                        zoom: 1;
                        z-index: -1;
                        -webkit-transform-origin-x: 0;    /*定义元素被置于x轴的何处*/
                        -webkit-transform: scale(0.5, 0.8);   /*定义元素被缩放*/
                        .canvas_head {
                            width: 100%;
                            >ul {
                                display: -webkit-box;      
                                display: -moz-box;       
                                display: -ms-flexbox;
                                display: -webkit-box;
                                display: flex;
                                li {
                                    
                                    font-size: rem(10);
                                    letter-spacing: rem(1);
                                }
                            }
                        }
                        h2 {
                            font-size: rem(18);
                            padding: rem(20);
                            text-align: center;
                            letter-spacing: rem(5);
                            font-weight: 600;
                        }
                        .canvas_user {
                            width: 100%;
                            border-bottom:1px dashed #ccc;
                            padding: rem(10) 0;
                            margin-top: rem(10);
                            ul {
                                          
                                display: -webkit-box;      
                                display: -moz-box;       
                                display: -ms-flexbox;
                                display: -webkit-box;
                                display: flex;
                                font-size: rem(10);
                                li {
                                    width: 33%;
                                    height: rem(30);
                                    line-height: rem(30);
                                    letter-spacing: rem(1.5);
                                }
                            }
                        }
                        .canvas_drug {
                            width: 100%;
                            padding: rem(20) 0;
                            position: relative;
                            >p {
                                font-weight: 550;
                                font-size: rem(12);
                            }
                            >ol {
                                margin-top: rem(20);
                                font-size: rem(7);
                                li {
                                    line-height: rem(30);
                                    span {
                                        margin-left: rem(14);
                                    }
                                }
                            }
                            .tshi {
                                position: absolute;
                                right: rem(30);
                                bottom: rem(10);
                                font-size: rem(5);
                                img {
                                    width: rem(100);
                                    height: rem(100);
                                    border-radius: 50%;
                                }
                            }
                        }
                        .msg {
                            text-align: center;
                            font-size: rem(7);
                            line-height: rem(14);
                            padding-bottom: rem(30);
                        }
                        .check {
                            margin-top: rem(30);
                            width: 100%;
                            font-size: rem(8);
                            overflow: hidden;
                        > ul {
                                            
                                display: -webkit-box;      
                                display: -moz-box;       
                                display: -ms-flexbox;
                                display: -webkit-flex;
                                display: flex;
                                li {
                                    width: 50%;
                                             
                                    display: -webkit-box;      
                                    display: -moz-box;       
                                    display: -ms-flexbox;
                                    display: -webkit-flex;
                                    display: flex;
                                    > img {
                                        max-width: rem(40);
                                        height: rem(25);
                                        display: block;
                                    }
                                }
                            }
                        }
                        
                    }
                }
                .danClick {
                    position: absolute;
                    bottom: rem(30);
                    left: 33%;
                    padding: rem(10) rem(16) rem(10) rem(24);
                    opacity: .4;
                    color: #fff;
                    display: block;
                    border-radius: rem(15);
                    font-size: rem(13);
                    background: #000 url('../../common/img/icon_ckcf.png')
                        no-repeat rem(5);
                    font-size: rem(14);
                    background-size:15%;
                    z-index: 1000;
                }
            }
           
        }
         .recipeMsg {
            width: 100%;
            margin-top: rem(10);
            padding: 0 rem(15) rem(15);
            background-color: #fff;
            li {
                width: 100%;
                font-size: rem(13);
                padding-top: rem(15);
                span:first-child {
                    color: #808080;
                }
                span:last-child {
                    color: #333;
                    padding-left: rem(15);
                }
            }
        }
        
        .user, .usage {
            width: 100%;
            background:rgba(255,255,255,1);
            border-radius:4px;
            padding: rem(15);
            margin-top: rem(10);
            ul {
                li {
                    display: -webkit-flex;
                    display: flex;
                    font-size: rem(13);
                    line-height: rem(26);
                    span:first-child {
                        color: #808080;
                        width: rem(65);
                    }
                    span:last-child {
                        color: #333;
                        padding-left: rem(15);
                        width: 80%;
                        > b {
                            font-weight: normal;
                            color: #E0E0E0;
                            padding: 0 rem(3);
                        }
                    }
                    p:first-child {
                        color: #808080;
                        width: 25%
                    }
                    p:last-child {
                        width: 74%;
                    }
                }
            }
        }
        .usage {
            width: 100%;
            font-size: rem(14);
            padding:0;
            margin-bottom: rem(10);
            .title {
                color: #333;
                font-weight:400;
                line-height: rem(17);
                padding: rem(15);
                border-bottom: 1px solid #E6E6E6;
            }
            .usage_con {
                padding: 0 rem(15);
                 dl:first-child {
                    border-top: 0!important;
                }
                dl {
                    padding:rem(15) 0;
                    border-top: 1px dashed #e6e6e6;
                    dt {
                        color: #333;
                        span {
                            float: right;
                        }
                    }
                    dd {
                        color: #808080;
                        line-height: rem(20);
                        margin-top: rem(10);
                        font-size: rem(12);
                        p:first-child {
                            width: 26%;
                            line-height: rem(24);
                        }
                        p:last-child {
                            width: 70%;
                            line-height: rem(24);
                        }
                    }
                }
            }
           
            
        }
    }
    
}
</style>