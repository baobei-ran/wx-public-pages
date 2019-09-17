<template>
    <!-- 预约记录详情 -->
    <div class="subscribeDetail">
        <div class="section">
            <div class="section_box">
                <div class="section_head" v-if='yudetail.registration_stat == 1'>
                    <h3><img src="../../common/img/icon_djz.png" alt="">待就诊</h3>
                    <div class="cancelBtn"><mt-button @click.native="cancelClick">取消预约</mt-button></div>
                </div>
                <div class="section_head2" v-if='yudetail.registration_stat == 2'>
                    <h3><img src="../../common/img/icon_yjz.png" alt="">已就诊</h3>
                </div>
                <div class="section_head2" v-if='yudetail.registration_stat == 4'>
                    <h3><img src="../../common/img/icon_yqx.png" alt="">已取消</h3>
                    <span v-text='yudetail.registration_status == 3?"已退款": yudetail.registration_status == 4? "退款失败": yudetail.registration_status == 5? "退款中":""'></span>
                </div>
                <div class="section_con">
                    <ul>
                        <li>
                            <span>就诊人员</span>
                            <span>{{ yudetail.real_name }}</span>
                        </li>
                        <li>
                            <span>医生信息</span>
                            <span>{{ yudetail.true_name }}</span>
                        </li>
                        <li>
                            <span>就诊地址</span>
                            <span>{{ yudetail.hospital_name }}</span>
                        </li>
                        <li>
                            <span>就诊科室</span>
                            <span>{{ yudetail.department_name }}</span>
                        </li>
                        <li>
                            <span>预约时间</span>
                            <span>{{ yudetail.registration_time | Times }} {{ times }}</span>
                        </li>
                        <li>
                            <span>挂号类型</span>
                            <span v-text='yudetail.type == 1 ? "普通门诊": yudetail.type == 2? "专家门诊": ""'></span>
                        </li>
                        <li>
                            <span>费用金额</span>
                            <span>{{ yudetail.registration_amount }}元</span>
                        </li>
                        <li>
                            <span>病情描述</span>
                            <span v-text='yudetail.disease?yudetail.disease:"暂无填写"'></span>
                        </li>
                        <li>
                            <span>预约单号</span>
                            <span>{{ yudetail.registration_number }}</span>
                        </li>
                        <li>
                            <span>付款时间</span>
                            <span>{{ yudetail.pay_time | filterTime }}</span>
                        </li>
                    </ul>
                </div>
                
                <div class="refundTime" v-if='yudetail.registration_stat == 4'>
                    <ul>
                        <li>
                            <span>取消时间</span>
                            <span>{{ yudetail.refund_time | filterTime }}</span>
                        </li>
                        <li>
                            <span>取消原因</span>
                            <span>{{ yudetail.refund_remark }}</span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        
    </div>
</template>

<script>
export default {
    name: 'subscribeDetail',
    data () {
        return {
            yudetail: {},
            TimeInterval: ['上午 8:00-12:00', '下午 13:00-18:00', '晚上 18:00-24:00'], 
            times: '',
            rid: '',
            time: '',
            orderTime: '',  // 存放定时器
        }
    },
    mounted () {
        this.initdata() 
    },
    methods: {
        initdata () {
            var self = this;
                this.rid = this.$route.query.rid;
                var obj = { rid: this.rid };
            self.$http.post('/mobile/Wxregistration/registration_detail', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.yudetail = res.data;
                    self.times = self.TimeInterval[(res.data.registration_timeslot - 1)];
                } else {

                }
            })
        },
        cancelClick: function () {  // 取消预约
            this.$router.push({path: '/cancelSubscribe', query: { rid: this.rid }})
        },
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.subscribeDetail {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    background-color: #f4f4f4;
    font-size: rem(14);
    .section {
        width: 100%;
        .section_box {
            width: 100%;
            .section_head {
                width: 100%;
                height: rem(67);
                padding: 0 rem(13);
                background-color: #FFF;
                line-height: rem(67);
                overflow: hidden;
               > h3 {
                    float: left;
                    font-size: rem(16);
                    color: #F09F88;
                    img {
                        width: rem(38);
                        height: rem(38);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        vertical-align: middle;
                        margin-right: rem(5);
                    }
                }
                .cancelBtn {
                    float: right;
                   > button {
                        height: rem(25);
                        line-height: rem(25);
                        font-size: rem(11);
                        color: #808080;
                        background-color: #FFF;
                        border: 1px solid #808080;
                    }
                }
            }
            .section_head2 {
                width: 100%;
                height: rem(67);
                padding: 0 rem(13);
                background-color: #FFF;
                line-height: rem(67);
                overflow: hidden;
               > h3 {
                    font-size: rem(16);
                    color: #469AF4;
                    float: left;
                    img {
                        width: rem(38);
                        height: rem(38);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        vertical-align: middle;
                        margin-right: rem(5);
                    }
                }
                >span {
                    float: right;
                    font-size: rem(12);
                    color: #808080;
                }
            }
            
            .section_con {
                margin-top: rem(12);
                padding:0 rem(15);
                background-color: #fff;
                ul {
                    width: 100%;
                    padding: rem(20) 0;
                    li {
                        margin-top: rem(18);
                        font-size: rem(14);
                        display: -webkit-box; 
                        display: -moz-box; 
                        display: -webkit-flex; 
                        display: -moz-flex; 
                        display: -ms-flexbox;
                        display: flex;
                        overflow: hidden;
                        span {
                            display: block;
                            float: left;
                            line-height: rem(18);
                        }
                        span:first-child {
                           
                            color: #808080;
                            margin-right: rem(14);
                        }
                        span:last-child {
                            width: 75%;
                            color: #212121;
                        }
                    }
                    li:first-child {
                        margin-top: 0;
                    }
                }
            }
            .refundTime {
                margin-top: rem(12);
                background-color: #FFF;
                ul {
                    width: 100%;
                    padding: rem(20) rem(15);
                    li {
                        margin-top: rem(15);
                        font-size: rem(14);
                        display: -webkit-box; 
                        display: -moz-box; 
                        display: -webkit-flex; 
                        display: -moz-flex; 
                        display: -ms-flexbox;
                        display: flex;
                        overflow: hidden;
                        span {
                            display: block;
                            float: left;
                            line-height: rem(18);
                        }
                        span:first-child {
                           
                            color: #808080;
                            margin-right: rem(14);
                        }
                        span:last-child {
                            width: 75%;
                            color: #212121;
                        }
                    }
                    li:first-child {
                        margin-top: 0;
                    }
                }
            }
        }
    }
   
}

</style>
