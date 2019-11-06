
<template>
    <div class="imgDetails dis_f flex_d">
        <div class="section_box flex1" ref='canvasBox'>
            <div class="section dis_f flex_i" ref='htmlBox'> 
                <div v-show='isView' class="img_box"  >
                    <div class="html2canvas-box" ref='insetElement'>
                     <div class='html_content' ref='html' id='html'>
                        <div class="canvas_head">
                            <ul class="dis_f dis_sa">
                                <li>处方编号：<span>{{ canvasdata.number }}</span></li>
                                <li>处方生成时间：<span>{{ canvasdata.start_time | filterTime }}</span></li>
                                <li>处方有效时间：<span>{{ canvasdata.undue_time | filterTime }}</span></li>
                            </ul>
                        </div>
                        <h2>云医康互联网药店电子处方</h2>
                        <div class="canvas_user">
                            <ul>
                                <li>姓名：<span>{{ canvasdata.name }}</span></li>
                                <li>性别：
                                    <span v-show='canvasdata.sex == 1'>男</span>
                                    <span v-show='canvasdata.sex == 2'>女</span>
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
                            <ol class="user-result">
                                <li><span>诊断结果：</span><span>{{ canvasdata.result }}</span></li>
                            </ol>
                        </div>
                        <div class="canvas_drug">
                            <p>Rp:</p>
                            <ol v-for='(val,i) in durg'>
                                <li> 
                                    <p>{{val.name}} <b v-show="val.gg">({{val.gg}})</b></p>
                                    <span>*{{ val.num }}</span>
                                </li>
                                <li>用法：<b>{{ val.usage }}</b></li>
                            </ol>
                            <div class="tshi" id='seal'>
                                <img ref='chapter' src="" alt="" />
                            </div>
                        </div>
                        <div class="msg">
                            （以下空白，手写无效）
                        </div>
                        <div class="check">
                            <ul>
                                <li><span>处方医师：</span><img ref='doctorImg' src="" alt="" /></li>
                            </ul>
                        </div>
                    </div> 
                    </div>
                </div>
                <div v-if='cfMsg' class="inexistence">
                    <img src="../../common/img/pic_zwcf.png" alt="" />
                    <p >处方不存在</p>
                </div>
            </div>
        </div>
        <transition name='fade'>
            <div v-show="is_loading" class="footer dis_f dis_j flex_i">
                <div class="footer-box dis_f dis_j flex_i">
                    <div>
                        <mt-spinner type="snake"></mt-spinner>
                        <p>加载中。。。</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data () {
        return {
            canvasdata:{},
            durg: [],
            imgUrl: '',
            isView: false,
            cfMsg: false,
            is_loading: true,
        }
    },
    mounted () {
        this.initdata();
    },
    methods: {
        initdata () {
            var self = this;
            this.$http.post('/mobile/doch5/user_recipe_detail', this.$route.query ).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.canvasdata = res.data
                    self.durg = res.drug
                    if(self.canvasdata.signpic) {
                        self.$refs.doctorImg.src = self.$http.baseURL+self.canvasdata.signpic
                    }
                    if (self.canvasdata.seal) {
                        self.$refs.chapter.src = self.$http.baseURL+self.canvasdata.seal
                    }
                    self.isView = true;
                    self.$nextTick(() => {
                        var tt = setTimeout(function () {
                            self.canvasImg();
                            clearTimeout(tt)
                        },300)
                    })
                } else {
                    self.is_loading = false;
                    self.cfMsg = true;
                    self.$refs.canvasBox.style['background-color'] = '#000';
                    self.$toast({
                        message: '该处方不存在',
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(err => {
                self.cfMsg = true;
                self.is_loading = false;
                self.$toast({
                    message: '服务器错误，无法查看处方',
                    position: 'middle',
                    duration: 2500
                });
            })
        },
         canvasImg () {
            var _this = this;
            var shareContent = _this.$refs.html;
            var shareContent = document.getElementById('html');
            var width = shareContent.offsetWidth ; //获取dom 宽度
            var height = shareContent.offsetHeight; //获取dom 高度
            var scale = window.devicePixelRatio * 1;//获取设备的显示参数
            var canvas = document.createElement("canvas"); //创建一个canvas节点
            canvas.width = width * scale; //定义canvas 宽度 * 缩放
            canvas.height = height * scale; //定义canvas高度 *缩放
            canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
            var opts = {
                background:null,
                scale: scale?scale:1, // 添加的scale 参数
                canvas: canvas, //自定义 canvas
                logging: true, //日志开关，便于查看html2canvas的内部执行流程
                width: width, //dom 原始宽度
                height: height,
                // useCORS: true, // 【重要】开启跨域配置
                // allowTaint: true,//允许跨域图片
                // taintTest: true,//是否在渲染前测试图片
            };
            html2canvas(shareContent, opts).then(function (canvas) {
                var urls = canvas.toDataURL("image/jpeg", 0.7);
                // var urls = canvas.toDataURL("image/png");
                var t = setTimeout(() => {
                    _this.isView = false;
                    _this.$refs.htmlBox.innerHTML = '<img src="'+urls+'" style="width: 100%;background-color: #FFF;" alt="" />';
                    _this.is_loading = false;
                    clearTimeout(t)
                }, 0)
            })
        },
    },
    beforeDestroy () {
        this.$indicator.close();
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.imgDetails {
    width: 100%;
    height: 100%;
    font-size: 16px;
    .section_box {
        min-height: 100%;
        overflow: auto;
        background-color: #000;
    }
    .section {
        width: 100%;
        padding: rem(10) 0;
        font-size: rem(14);
        height: 100%;
        > img {
            width: 100%;
        }
        .inexistence {
            width: 100%;
            text-align: center;
            font-size: 16px;
            color: #808080;
            background: #fff;
            padding: rem(20) 0;
            >img {
                width: rem(120);
                margin-bottom: rem(30);
            }
        }
        .img_box {
            width: 100%;
            height: 100%;
            .html2canvas-box {
                width: 100%;
            .html_content {
                background: #fff;
                width: 200%;
                // zoom: 1;
                font-size: rem(14);
                padding: rem(20) rem(20);
                -webkit-transform-origin-x: 0;
                -webkit-transform: scale(1);   /*定义元素被缩放*/
                transform: scale(1);
                .canvas_head {
                    width: 100%;
                    >ul {
                        width: 100%;
                        overflow: hidden;
                        li {
                            width: 33%;
                            float: left;
                            font-size: rem(12);
                            line-height: rem(30);
                            letter-spacing: rem(0.5);
                        }
                    }
                }
                h2 {
                    font-size: rem(20);
                    padding: 20px;
                    text-align: center;
                    font-weight: 550;
                    letter-spacing: rem(2);
                    background-color: #FFFFFF;
                }
                .canvas_user {
                    width: 100%;
                    border-bottom:1px dashed #ccc;
                    padding: 10px 0;
                    ul {
                        width: 100%;
                        letter-spacing: rem(1);
                        overflow: hidden;
                        li {
                            width: 33%;
                            float: left;
                            height: 30px;
                            line-height: 30px;
                            font-size: rem(14);
                            letter-spacing: rem(1);
                        }
                    }
                    .user-result {
                        width: 100%;
                        li {
                            span {
                                display: inline-block;
                                line-height: rem(24);
                            }
                            span:first-child {
                                width: rem(80);
                            }
                            span:last-child {
                                width: 80%;
                                vertical-align: top;
                            }
                        }
                    }
                }
                .canvas_drug {
                    width: 100%;
                    padding: 20px 0;
                    position: relative;
                    >p {
                        font-weight: 550;
                        font-size: rem(14);
                    }
                    >ol {
                        margin-top: 10px;
                        font-size: rem(11);
                        li {
                            line-height: rem(30);
                            font-size: rem(15);
                            p {
                                display: inline-block;
                            }
                            span {
                                display: inline-block;
                                margin-left: rem(14);
                            }
                        }
                        li:last-child {
                            width: 94%;
                        }
                    }
                    .tshi {
                        position: absolute;
                        right: rem(30);
                        bottom: rem(10);
                        font-size: rem(10);
                        width: rem(100);
                        height: rem(100);
                        img {
                            width: rem(100);
                            height: rem(100);
                            border-radius: 50%;
                        }
                    }
                }
                .msg {
                    text-align: center;
                    font-size: 14px;
                    line-height: 20px;
                    padding-bottom: 20px;    
                    letter-spacing: rem(1);
                }
                .check {
                    width: 100%;
                    font-size: rem(12);
                    height: 80px;
                    margin-bottom: 20px;
                > ul {
                        width: 100%;
                        li {
                            width: 50%;
                            font-size: rem(14);
                            > img {
                                max-width: 100px;
                                max-height: 70px;
                                display: inline-block;
                                margin-left: 10px;
                                vertical-align: middle;
                            }
                        }
                    }
                }
              }
            }
        }
    }
    
    .footer {
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left: 0;
        background: #000;
        z-index: 10000;
        .footer-box {
            width: 100%;
            height: 50%;
            background: #fff;
        }
        >div {
            text-align: center;
            p {
                margin-top: rem(20);
                font-size: rem(15);
                color:#808080;
            }
        }
    }
}
</style>
