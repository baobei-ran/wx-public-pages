<template>
    <!-- 取消预约 -->
    <div class="cancelSubscribe dis_f flex_c">
        <div class="section flex1">
            <div class="section_box">
                <dl class="doctor_title dis_f flex-vc">
                    <dt><img :src="$http.baseURL+cancel_info.picture" alt=""></dt>
                    <dd class="flex1">
                        <p>
                            <span>就诊医生：</span><span>{{ cancel_info.true_name }}</span>
                        </p>
                        <p class="dis_f">
                            <span>就诊时间：</span><span>{{ cancel_info.registration_time | Times }} <br/> {{ times }}</span>
                        </p>
                    </dd>
                </dl>
                <div class="cancel_reason">
                    <ul>
                        <li class="dis_f dis_sb">
                            <span>取消原因</span>
                            <span class="yuan" @click='getPopupVisible' v-show="!li_name">请选择 <i class="iconfont icon-iconfontjiantou2"></i></span>
                            <span class="yuan" @click='getPopupVisible' v-show='li_name' style='color:#333;'>{{ li_name }} <i class="iconfont icon-iconfontjiantou2"></i></span>
                        </li>
                        <li>
                            <span>退款金额</span>
                            <span>￥{{ cancel_info.registration_amount }}</span>
                        </li>
                        <li class="cancel_txt">
                            <span>取消说明</span>
                        </li>
                        <li class="cancel_txt cancel_txt2">
                            <textarea maxlength="200" v-model='txt_area' placeholder="请填写取消说明"></textarea>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer" v-show="hidshow">
            <mt-button @click.native="handleClick">提交</mt-button>
        </div>

        <mt-popup style="width: 100%;"
        v-model="popupVisible"
        position="bottom">
            <div class="h_title">
                取消原因
            </div>
            <ul class="ul_popup">
                <li v-for='val in popupVal' :class='{"active":val.id == li_i }' @click='li_cause(val)'>{{ val.name }}</li>
            </ul>
        </mt-popup>
    </div>
</template>

<script>
export default {
    name: 'cancelSubscribe',
    data () {
        return {
            docmHeight: "",  //默认屏幕高度
            showHeight: "",  //实时屏幕高度
            hidshow: true,  //显示或者隐藏footer
            popupVisible: false,
            popupVal: [{id:1, name: '病情好转无需就诊' }, { id: 2, name: '无法按照预约时间到诊'}, {  id: 3, name: '已选择其他方式就诊' }, { id: 4, name: "其他"}],
            li_i: 0,
            li_name: '',
            txt_area: '',
            cancel_info: {},       // 接口数据
            TimeInterval: ['上午 8:00-12:00', '下午 13:00-18:00', '晚上 18:00-24:00'], 
            times: ''
        }
    },
    mounted() {
        // window.onresize监听页面高度的变化
        var self = this;
        setTimeout(function () {
            self.docmHeight = document.documentElement.clientHeight
            self.showHeight = document.documentElement.clientHeight
            window.onresize = function() {
                return( function () {
                    self.showHeight = document.body.clientHeight;
                })()
            }
        }, 30)
        this.initdata()
    },
    watch: {
        showHeight:function() {
            if(this.docmHeight > this.showHeight){
                this.hidshow=false
            }else{
                this.hidshow=true
            }
        }
    },
    methods: {
        initdata: function () {
            var self = this;
            self.$http.post('/mobile/Wxregistration/registration_detail', this.$route.query).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.cancel_info = res.data
                    self.times = self.TimeInterval[(res.data.registration_timeslot - 1)]
                }
            })
        },
        handleClick: function () {     // 取消提交
            var self = this;
            if (this.li_name == '') {
                this.$toast({
                    message: '请选择取消原因',
                    position: 'middle',
                    duration: 2000
                });
                return false;
            }
            var obj = { rid: this.$route.query.rid, remark: this.li_name, describe: this.txt_area }
            this.$http.post('/mobile/Wxregistration/registration_cancel', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.$toast({
                        message: '取消成功！',
                        position: 'middle',
                        duration: 2000
                    });
                    var time = setTimeout(function () {
                         self.$router.replace({path: '/subscribeDetail', query: {rid: self.$route.query.rid}})
                         clearTimeout(time)
                    }, 1000)
                } else {
                    this.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
           
        },
        getPopupVisible: function () {
            this.popupVisible = true
        },
        li_cause: function (v) {
            this.li_i = v.id
            this.li_name = v.name
            var self = this;
            setTimeout(function () {
                self.popupVisible = false
            }, 50)
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.cancelSubscribe {
    width: 100%;
    height: 100%;
    font-size: rem(14);
    background-color: #f4f4f4;
    .section {
        width: 100%;
        .section_box {
            width: 100%;
            .doctor_title {
                width: 100%;
                height: rem(87);
                padding: 0 rem(15); 
                background-color: #fff;
                dt {
                    width: rem(54);
                    height: rem(54);
                    -webkit-border-radius: 100%;
                    border-radius: 100%;
                    >img {
                        width: rem(54);
                        height: rem(54);
                        max-height: rem(54);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                    }
                }
                dd {
                    padding-left: rem(12);
                    color: #333;
                    font-size: rem(14);
                    > p {
                        line-height: rem(19);
                    }
                    p:last-child {
                        margin-top: rem(5);
                        span {
                            display: block;
                        }
                        span:last-child {
                            width: 60%;
                        }
                    }
                }
            }
            .cancel_reason {
                width: 100%;
                background-color: #FFF;
                margin-top: rem(12);
                > ul {
                    width: 100%;
                    padding-left: rem(16);
                    li {
                        padding-right: rem(16);
                        width: 100%;
                        height: rem(49);
                        line-height: rem(49);
                        font-size: rem(14);
                        color: #808080;
                        border-bottom: 1px solid #E0E0E0;
                        .yuan {
                            padding-left: 10%;
                        }
                    }
                    .cancel_txt {
                        border:0;
                    }
                    .cancel_txt2 {
                        height: auto;
                        textarea {
                            background-color: #F9F9F9;
                            width: 100%;
                            height: rem(80);
                            resize: none;
                            outline: none;
                            border:0;
                            color: #333;
                            padding: rem(10);
                        }
                    }
                }
            }
        }

    }
    .footer {
        width: 100%;
        height:rem(49);
        button {
            width: 100%;
            height: 100%;
            background-color: #469AF4;
            color: #FFF;
            font-size: rem(16);
            -webkit-border-radius: 0;
            border-radius: 0;
        }
    }

    .h_title {
        height: rem(42);
        line-height: rem(42);
        font-size: rem(13);
        padding-left: rem(15);
        color: #333;
    }
    .ul_popup {
        width: 100%;
        padding: rem(10) 0;
        border-top: 1px solid #E6E6E6;
        li {
            width: 100%;
            height: rem(35);
            line-height: rem(35);
            color: #808080;
            font-size: rem(14);
            text-align: center;
            cursor: pointer;
        }
        li.active {
            color: #3196FF;
            background-color: rgba(70,154,244, .1);
        }
    }
}
</style>
