<template>
    <div class="recipe dis_f flex_d">
        <div class="flex1 section_box">
            <div class="section">
                <div class="box">
                    <div class="msg" v-if='recipedata.drug_autdit == 0'>
                       <img src="../../common/img/icon_dqh@2x.png" alt="" /><span>处方未审核</span>
                    </div>
                    <div class="msg" v-if='recipedata.drug_autdit == 1 && recipedata.status == 1'>
                       <img src="../../common/img/icon_cfykjs.png" alt="" /><span>药师审核通过</span>
                    </div>
                     <div class="msg oranges" v-if='recipedata.drug_autdit == 2'>
                        <img src="../../common/img/icon_shwtg@2x.png" alt="" /><span>药师审核未通过</span>
                    </div>
                    <div class="msg oranges" v-if='recipedata.drug_autdit == 1 && recipedata.status == 2'>
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
                                        <ul class="result">
                                            <li><span>诊断结果：</span><span>{{ canvasdata.result }}</span></li>
                                        </ul>
                                    </div>
                            </div>
                        </div>
                        <router-link class="danClick" :to="{ path: '/chufdetails', query : { id: this.$route.query.id }}">查看完整处方</router-link>
                    </div>
                    
                </div>
                <ul class="recipeMsg">
                    <li><span>处方单号：</span><span>{{ recipedata.number }}</span></li>
                    <li><span>开具时间：</span><span>{{ recipedata.start_time | filterTime }}</span></li>
                    <!-- <li><span>处方时效：</span><span>{{ recipedata.undue_time | filterTime }}</span></li> -->
                    <li><span>开具医生：</span><span>{{ recipedata.true_name }}</span></li>
                </ul>
                <div class="user">
                    <ul>
                        <li><span>患者信息：</span><span>{{ recipedata.name }}<b>|</b><span v-text='recipedata.sex == 1?"男":"女"'></span><b>|</b>{{ recipedata.age }}</span></li>
                        <li><span>患者主诉：</span><span>{{ recipedata.opinion }}</span></li>
                        <li><span>诊断结果：</span><span>{{ recipedata.result }}</span></li>
                        <!-- <li><span>处理意见：</span><span>{{ recipedata.result }}</span></li> -->
                    </ul>
                </div>
                <div class="usage">
                    <div class="title">
                        {{ recipedata.hname }}
                    </div>
                    <div class="usage_con">
                        <div class="drugs" v-for="(val,i) in lists" :key='i'>
                            <div class="dis_f">
                                <img :src="val.img?$http.baseURL+val.img:''" alt="" />
                                <dl class="flex1">
                                    <dt class="dis_f dis_sb"> 
                                        <p>{{ val.name }} <b v-show="val.gg">({{val.gg}})</b></p>
                                        <span>￥{{ val.money }}</span></dt>
                                    <dd >
                                        {{ val.company }}
                                        <span>x{{ val.num }}</span>
                                    </dd>
                                </dl>
                            </div>
                            <p class="usages dis_f">
                                <span>用法用量：</span>
                                <span>{{ val.usage }}</span>
                            </p>
                        </div>
                        
                    </div>
                    
                    
                </div>
                <ul class="audit-msg" v-show="recipedata.drug_autdit > 0">
                    <li><span>审核药师</span><span>{{ recipedata.yname }}
                        <!-- <img :src="$http.baseURL+recipedata.signpic" alt="" /> -->
                        </span>
                    </li>
                    <li><span>审核时间</span><span>{{ recipedata.drug_audit_time | filterTime}}</span></li>
                    <li v-show="recipedata.drug_audit_reason"><span>审核说明</span><span>{{ recipedata.drug_audit_reason }}</span></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'recipedrug',
    data () {
        return {
            recipedata: {},
            canvasdata: {},
            list: [],
            lists: []
        }
    },
    mounted() {
        this.initdata()
    },
    methods: {
        initdata () {   // 处方详情
            var self = this,
                uid = this.$cookie.get('userLogins');
            var obj = { id: this.$route.query.id }
            this.$http.post('/mobile/doch5/user_recipe_detail', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.recipedata = res.data
                    self.lists = res.drug
                    self.canvasdata = res.data
                    self.list= res.drug
                } else {
                    self.recipedata = {}
                    self.lists = []
                    self.canvasdata = {}
                    self.list= []
                }
            })
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
    font-size: rem(14);
    background-color: #F9F9F9;
    
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
                        -webkit-transform-origin-y: rem(30);
                        -webkit-transform-origin-x: 0;    /*定义元素被置于x轴的何处*/
                        -webkit-transform: scale(0.5, 0.7);   /*定义元素被缩放*/
                        .canvas_head {
                            width: 100%;
                            >ul { 
                                overflow: hidden;
                                li {
                                    float: left;
                                    width: 33%;
                                    line-height: 20px;
                                    font-size: rem(10);
                                    letter-spacing: rem(1);
                                }
                            }
                        }
                        h2 {
                            font-size: rem(20);
                            padding: rem(14) rem(20);
                            text-align: center;
                            letter-spacing: rem(5);
                            font-weight: 600;
                        }
                        .canvas_user {
                            width: 100%;
                            border-bottom:1px dashed #ccc;
                            padding: rem(10) 0;
                            ul {
                                display: -webkit-box;      
                                display: -moz-box;       
                                display: -ms-flexbox;
                                display: -webkit-box;
                                display: flex;
                                font-size: rem(14);
                                li {
                                    width: 33%;
                                    padding: rem(6) 0;
                                    letter-spacing: rem(1.5);
                                }
                            }
                            .result {
                                li {
                                    width: 100%;
                                    span {
                                        display: inline-block;
                                        line-height: rem(40);
                                    }
                                    span:last-child {
                                        width: 80%;
                                        vertical-align: top;
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
                    padding: rem(8) rem(16) rem(8) rem(24);
                    opacity: .4;
                    color: #fff;
                    display: block;
                    border-radius: rem(15);
                    font-size: rem(13);
                    background: #000 url('../../common/img/icon_ckcf.png') no-repeat rem(5) center;
                    font-size: rem(13);
                    background-size:13%;
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
                .drugs {
                    padding: rem(15) 0;
                    border-bottom: 1px solid #F0F2F6;
                    >div {
                        img {
                            width: rem(40);
                            height: rem(40);
                        }
                        dl {
                            padding-left: rem(10);
                            dt {
                                color: #333;
                                padding-top: rem(3);
                                font-size: rem(13);
                                >p {
                                    line-height: rem(20);
                                }
                                span {
                                    float: right;
                                }
                            }
                            dd {
                                color: #808080;
                                margin-top: rem(10);
                                font-size: rem(11);
                                span {
                                    float: right;
                                }
                            }
                        }
                    }
                   .usages {
                       width: 100%;
                       margin-top: rem(10);
                       color: #808080;
                       font-size: rem(11);
                       >span {
                           display: inline-block;
                            width: rem(65);
                            line-height: rem(24);
                        }
                        > span:last-child {
                            width: 80%;
                            line-height: rem(24);
                        }
                    }
                }
                
                
            }
           
            
        }
        .audit-msg {
            margin: rem(10) 0;
            background: #FFF;
            padding:rem(5) rem(15);
            li {
                line-height: rem(30);
                font-size: rem(12);
                span {
                    img {
                        width: 50px;
                        height: 30px;
                    }
                }
                span:first-child {
                    margin-right: rem(20);
                    color:#808080;
                }
            }
        }
    }
    
}
</style>