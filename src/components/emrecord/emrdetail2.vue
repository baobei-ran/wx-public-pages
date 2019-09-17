<template>
    <!-- 医生添加的详情 -->
    <div class="emrecorddetail">
        <div class="emrecorddetail-box" v-show='isView'>
            <div class="header br-rs">
                <div class="emr-title"><span>创建时间：{{ userinfo.addtime | moment }}</span></div>
                <div class="emr-usermsg dis_f">
                    <h2>{{ userinfo.name }}</h2>
                    <b>|</b>
                    <span v-text='userinfo.sex == 1? "男":"女"'></span>
                    <b>|</b>
                    <span>{{ userinfo.age }}岁</span>
                </div>
            </div>
            <div class="user-msg br-rs">
                <ul>
                    <li>
                        <h2>主诉</h2>
                        <p v-html='userinfo.main'></p>
                    </li>
                    <li v-show="userinfo.dis">
                        <h2>现病史</h2>
                        <p v-html="userinfo.dis"></p>
                    </li>
                    <li v-show="userinfo.past">
                        <h2>既往病史</h2>
                        <p v-html="userinfo.past"></p>
                    </li>
                </ul>
            </div>
            <div class="user-msg br-rs" v-show="userinfo.text">
                <h1>其他健康指标</h1>
                <div class="user-text" v-html="userinfo.text"></div>
            </div>
            <div class="user-msg br-rs">
                <ul>
                    <li>
                        <h2>诊断</h2>
                        <p v-html="userinfo.result"></p>
                    </li>
                    <li v-show="userinfo.doc_cure || userinfo.again_text">
                        <h2>医嘱小结</h2>
                        <p><span>复诊时间</span><span>{{ userinfo.again_text }}</span></p>
                        <p v-show="userinfo.doc_cure" v-html='userinfo.doc_cure'></p>
                    </li>
                    <li id='drug-pic' v-if="picdata.length">
                        <img v-for='(val,i) in picdata' :key='i' @click="clickScalePic(i)" :src="$http.baseURL+val" alt="" />
                    </li>
                </ul>
            </div>
            <div class="footer user-msg br-rs">
                <ul>
                    <li><span>医生</span><span>{{ userinfo.doc }}</span></li>
                    <li><span>医院</span><span>{{ userinfo.hos }}</span></li>
                </ul>
            </div>
        </div>
        <div class="emr-empty" v-show='isEmpty'>
            无数据
        </div>
        <transition name="bounce">
            <div class="model-shade" v-show='isModel'>
                <model-pic ref="childs" @modelShade='modelShade' />
            </div>
        </transition>
    </div>
</template>

<script>
import ModelPic from './modelpic'
export default {
    components: {
        'model-pic': ModelPic
    },
    data () {
        return {
            isModel: false,
            picdata: [],
            userinfo: {},
            isView: false,
            isEmpty: false
        }
    },
    beforeCreate() {
        this.$indicator.open({
                text: '',
                spinnerType: 'fading-circle'
            });
    },
    beforeDestroy () {
        this.$indicator.close();
    },
    mounted () {
       this.initdata()
    },
    methods: {
        initdata () {
            var self = this;
            var { id } = this.$route.query
            this.$http.post('/mobile/Doch5/list_case_look', { id: id, type: 2 }).then(res => {
                console.log(res)
                self.$indicator.close();
                
                if (res.code == 1) {
                    self.isView = true;
                    self.userinfo = res.data;
                    function replaceBr (data) {
                        if (data) {
                            data = data.replace(/\n/g, '<br />')
                        }
                        return data;
                    }
                    self.userinfo.main = replaceBr(self.userinfo.main);
                    self.userinfo.dis = replaceBr(self.userinfo.dis);
                    self.userinfo.past = replaceBr(self.userinfo.past);
                    self.userinfo.text = replaceBr(self.userinfo.text);
                    self.userinfo.result = replaceBr(self.userinfo.result);
                    self.userinfo.doc_cure = replaceBr(self.userinfo.doc_cure);
                    if (self.userinfo.pic) {
                        self.picdata = self.userinfo.pic.split(',')
                    }
                } else {
                    self.isEmpty = true
                }
            }).catch(err => console.log(err))
        },
        modelShade (data) {
            this.isModel = data
        },
        clickScalePic(i) {
            this.$refs.childs.modelScalePic(this.picdata, i);
            this.isModel = true
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px/100+rem;
}
.bounce-enter-active {
  animation: bounce-in .3s;
}
.bounce-leave-active {
  animation: bounce-in .3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.br-rs {
    -webkit-border-radius:rem(10);
    border-radius: rem(10);
    background-color: #fff;
}
.emrecorddetail {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    font-size: rem(28);
    background-color: #F4F4F4;
    .emrecorddetail-box {
        width: 100%;
        padding: 0 rem(30);
        margin-bottom: rem(20);
        .header {
            width: 100%;
            margin-top: rem(21);
            background: #fff;
            padding-bottom: rem(25);
            .emr-title {
                font-size: rem(23);
                height: rem(40);
                line-height: rem(40);
                color: #469AF4;
                > span {
                    background-color: #E3F0FD;
                    border-radius: 5px 0 10px 0;
                    padding: rem(8) rem(22);
                    vertical-align: middle;
                }
            }
            .emr-usermsg {
                width: 100%;
                margin-top: rem(30);
                font-size: rem(24);
                padding: 0 rem(30);
                color: #808080;
                h2 {
                    font-size: rem(28);
                    color: #212121;
                    font-weight: 500;
                }
                >b {
                    margin: 0 rem(16);
                }
            }
        }
        .user-msg {
            width: 100%;
            margin-top: rem(20);
            background-color: #fff;
            padding: rem(29);
            >h1 {
                font-size: rem(26);
                color: #333;
                font-weight: 600;
                margin-bottom: rem(20);
            }
            .user-text {
                color: #808080;
                line-height: rem(40);
                font-size: rem(24);
            }
            ul {
                width: 100%;
                li {
                    padding: rem(13) 0;
                    font-size: rem(24);
                    h2 {
                        font-size: rem(26);
                        color: #333;
                        font-weight: 600;
                    }
                    p {
                        color: #808080;
                        line-height:rem(36);
                        margin-top: rem(22);
                    }
                    span {
                        display: inline-block;
                        line-height: rem(36);
                        color: #808080;
                    }
                    span:first-child {
                        width: 25%;
                        vertical-align: top;
                    }
                    span:last-child {
                        width: 74%;
                        img {
                            width: rem(88);
                            height: rem(88);
                            margin-right: rem(23);
                        }
                    }
                    img {
                        width: rem(88);
                        height: rem(88);
                        margin-right: rem(20);
                    }
                    img:last-child {
                        margin: 0;
                    }
                }
                li:last-child {
                    padding-bottom: 0;
                }
            }
        }
       .footer {
          span:last-child {
              color: #333;
          }
       }
    }

    .model-shade {
        position: fixed;
        left: 0;
        top: 0;
        background: #000;
        width: 100%;
        height: 100%;
    }
    .emr-empty {
        text-align: center;
        margin-top: 30%;
    }
}


</style>

