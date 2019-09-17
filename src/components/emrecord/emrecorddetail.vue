<template>
    <!-- 患者添加的详情 -->
    <div class="emrecorddetail">
        <div class="emrecorddetail-box" v-show='isView'>
            <div class="header br-rs">
                <div class="emr-title"><span>创建时间：{{ userinfo.case_atime | moment }}</span></div>
                <div class="emr-usermsg dis_f">
                    <h2>{{ userinfo.real_name }}</h2>
                    <b>|</b>
                    <span v-text='userinfo.sex == 1?"男":"女"'></span>
                    <b>|</b>
                    <span>{{userinfo.age}}</span>
                </div>
                <p><span>身高/体重</span><span>{{ userinfo.stature }}cm/{{ userinfo.weight }}kg</span></p>
            </div>
            <div class="user-msg br-rs">
                <ul>
                    <li v-show="userinfo.yun"><span>备孕情况</span><span>{{ userinfo.yun }}</span></li>
                    <li v-show="userinfo.cigarette" class="dis_f"><span>吸烟情况</span>
                        <span>{{ userinfo.cigarette == 1?'从不吸烟': userinfo.cigarette == 2? '已戒烟': userinfo.cigarette == 3?'吸烟':'' }}
                            <b v-show='userinfo.cigarette == 3'>/日平均吸烟量{{ userinfo.cigarette_day }}支/开始吸烟年龄{{ userinfo.cigarette_age }}岁</b>
                            </span></li>
                    <li v-show="userinfo.liquor"><span>饮酒情况</span><span>{{ userinfo.liquor == 1? "从不饮酒": userinfo.liquor == 2? '偶尔饮酒': userinfo.liquor == 3? '经常饮酒':'' }}
                        <b v-if='userinfo.liquor == 2 || userinfo.liquor == 3' >/日平均饮酒量{{ userinfo.liquor_day }}两/开始饮酒年龄{{ userinfo.liquor_age }}岁</b></span></li>
                    <li v-show="userinfo.ago"><span>既往病史</span><span >{{ userinfo.ago }}</span></li>
                    <li v-show="userinfo.allergy"><span>药物过敏史</span><span>{{ userinfo.allergy }}</span></li>
                    <li><span>病情描述</span><span>{{ userinfo.remark }}</span></li>
                </ul>
            </div>
            <div class="user-msg br-rs">
                <ul>
                    <li v-show="userinfo.cure_time"><span>就诊时间</span><span>{{ userinfo.cure_time | moment }}</span></li>
                    <li v-show="userinfo.cure_hos"><span>就诊医院</span><span>{{ userinfo.cure_hos }}</span></li>
                    <li v-show="userinfo.cure_dep"><span>就诊科室</span><span>{{ userinfo.cure_dep }}</span></li>
                    <li v-show="userinfo.cure_doc"><span>就诊医生</span><span>{{ userinfo.cure_doc }}</span></li>
                    <li v-show="userinfo.cure_result"><span>诊断结果</span><span>{{ userinfo.cure_result }}</span></li>
                    <li v-show="picdata.length"><span>医嘱图</span><span id='advice'>
                            <img v-for='(val,i) in picdata' @click='clickScalePic(i)' :key='i' :src="$http.baseURL+val" alt="" />
                        </span></li>
                    <li v-show="picdata2.length"><span>处方图片</span><span id='recipe'><img v-for='(val,i) in picdata2' @click='clickScalePic2(i)' :key='i+"_2"' :src="$http.baseURL+val" alt="" /></span></li>
                    <li v-show="picdata3.length"><span>检验单图片</span><span id='checkout'><img v-for='(val,i) in picdata3' @click='clickScalePic3(i)' :key='i+"_3"' :src="$http.baseURL+val" alt="" /></span></li>
                </ul>
            </div>
            <!--物流跟踪-->
            <div class="seedata br-rs" v-show="userdata.length">
                <div class="track-list">
                    <ul>
                        <li class="li-progress" v-for='(val,j) in userdata' :key='j+"_msg"' >
                            <i class="node-icon"></i>
                            <div><span>{{ val.addtime | moment }}</span><span class="blue" v-show="val.type == 1">电子处方</span><span v-show="val.type == 2" class="orange">预约门诊</span></div>
                            <p><span class="txt">医生</span><span class="time">{{ val.doc }}</span></p>
                            <p><span class="txt">医院</span><span class="time">{{ val.hos }}</span></p>
                        </li>
                    </ul>
                </div>
            </div>
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
            picdata2: [],
            picdata3: [],
            userdata: '',
            userinfo: '',
            isView: false,
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
        var { id } = this.$route.query;
        var self = this;
        this.$http.post('/mobile/Doch5/list_case_look', { id: id, type: 1 }).then(res => {
            console.log(res)
            self.$indicator.close();
            self.isView = true
            if (res.code == 1) {
                self.userdata = res.data;
                self.userinfo = res.info;
                if (self.userinfo.doc_record_pic) {
                    var pic1 = self.userinfo.doc_record_pic.split(',');
                    pic1.map(val => {
                       if (val) {
                            self.picdata.push(val)
                       }
                    })
                    
                }
                if (self.userinfo.recipe_pic) {
                    var pic2 = self.userinfo.recipe_pic.split(',');
                    pic2.map(val => {
                        if (val) {
                            self.picdata2.push(val)
                        }
                    })
                }
                if (self.userinfo.test_pic) {
                    var pic3 = self.userinfo.test_pic.split(',');
                    pic3.map(val => {
                        if (val) {
                            self.picdata3.push(val)
                        }
                    })
                }
            }
        }).catch(err => console.log(err))
    },
    methods: {
        modelShade (data) {
            this.isModel = data
        },
        clickScalePic(i) {
            this.$refs.childs.modelScalePic(this.picdata, i);
            this.isModel = true
        },
        clickScalePic2(i) {
            this.$refs.childs.modelScalePic(this.picdata2, i);
            this.isModel = true
        },
        clickScalePic3(i) {
            this.$refs.childs.modelScalePic(this.picdata3, i);
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
}
.emrecorddetail {
    width: 100%;
    height: 100%;           
    overflow-y: scroll;
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
                    padding: rem(8) rem(10);
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
            >p {
                margin-top: rem(30);
                padding: 0 rem(30);
                font-size: rem(24);
                color: #333;
                span:first-child {
                    color: #808080;
                    margin-right: rem(30);
                }
            }
        }
        .user-msg {
            width: 100%;
            margin-top: rem(20);
            background-color: #fff;
            padding: 0 rem(29);
            ul {
                width: 100%;
                li {
                    padding: rem(13) 0;
                    font-size: rem(24);
                    span {
                        display: inline-block;
                        line-height: rem(36);
                    }
                    span:first-child {
                        width: 24%;
                        color: #808080;
                        vertical-align: top;
                    }
                    span:last-child {
                        width: 76%;
                        color: #333;
                        img {
                            width: rem(88);
                            height: rem(88);
                            margin-right: rem(20);
                        }
                        img:last-child {
                            margin: 0;
                        }
                    }
                }
            }
        }
        .seedata {
            background-color: #fff;
            margin-top: rem(20);
            padding: rem(30);
            .track-list {
                width: 100%;
                ul {
                    .li-progress {
                        border-left: 1px solid #ddd;
                        i {
                            border-left: 1px solid #ddd;
                        }
                    }
                    li {    
                        padding-left: rem(30);
                        font-size: rem(24);
                        position: relative;
                        padding-bottom: rem(36);
                        i {
                            position: absolute;
                            display: block;
                            width: rem(14);
                            height: rem(14);
                            top: 0;
                            left: 0;
                        }   
                        i::after {
                            content: '';
                            top: rem(5);
                            position: absolute;
                            display: block;
                            width: rem(14);
                            height: rem(14);
                            top: rem(5);
                            left: rem(-7);
                            background-color: #469AF4;
                            -webkit-border-radius: 100%;
                            border-radius: 100%;
                        }
                        > div {
                            padding-bottom: rem(10);
                            vertical-align: top;
                            span {
                                display: inline-block;
                                color: #808080;
                            }
                            .blue {
                                padding: rem(6) rem(12);
                                background-color: #469AF4;
                                -webkit-border-radius: rem(16);
                                border-radius: rem(16);
                                color: #fff;
                                font-size: rem(20);
                                margin-left: rem(20);
                            }
                            .orange {
                                padding: rem(6) rem(12);
                                -webkit-border-radius: rem(16);
                                border-radius: rem(16);
                                color: #fff;
                                font-size: rem(20);
                                margin-left: rem(20);
                                background-color: #F09F88;
                            }
                        }
                        p {
                            margin-top: rem(23);
                            color: #808080;
                            span:last-child {
                                color: #333;
                                margin-left: rem(20);
                            }   
                        }
                    }
                    li:first-child {
                        i {
                            border-color: #fff;
                            left: rem(-2);
                        }
                    }
                    li:last-child {
                        border:0;
                    }
                }
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
}


</style>

