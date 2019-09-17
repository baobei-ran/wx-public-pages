<template>
    <!-- 药师审核页面 -->
    <div class="recipeAudit dis_f flex_c">
        <div class="section flex1">
            <div class="section_box">
                <div class="recipe_haed">
                    <div class="recipe_title" :style="recipeMsg.drug_autdit == 2 || recipeMsg.status == 2?border:''">
                        <div class="my_audit" v-if='recipeMsg.drug_autdit !== 2 && recipeMsg.status ==1' v-text="recipeMsg.drug_autdit == 0 && recipeMsg.status == 1?'等待药师审核':recipeMsg.drug_autdit == 1 && recipeMsg.status == 1 ?'药师审核已通过':''">等待药师审核</div>
                        <div class="my_audit_orange" v-if="recipeMsg.drug_autdit == 0 && recipeMsg.status == 2">等待药师审核，处方已过期</div>
                        <div class="my_audit_orange" v-if='recipeMsg.drug_autdit == 2 && recipeMsg.status == 1'>药师审核拒绝</div>
                        <div class="my_audit_orange" v-if="recipeMsg.drug_autdit == 1 && recipeMsg.status == 2">处方已过期</div>
                        <div class="my_audit_orange" v-if="recipeMsg.drug_autdit == 2 && recipeMsg.status == 2">药师审核拒绝，处方已过期</div>
                        <ul>
                            <li>
                                <span>时间</span>
                                <span>{{ recipeMsg.start_time | filterTime }}</span>
                            </li>
                            <li>
                                <span>医生</span>
                                <span>{{ recipeMsg.true_name }}</span>
                            </li>
                            <li>
                                <span>患者</span>
                                <span>{{ recipeMsg.name }}</span>
                            </li>
                            <li>
                                <span>诊断结果</span>
                                <span>{{ recipeMsg.result }}</span>
                            </li>
                            <!-- <li>
                                <span>医生建议</span>
                                <span></span>
                            </li> -->
                            <li class="fr">
                                <span v-show='recipeMsg.drug_autdit == 0 && recipeMsg.status == 1 || recipeMsg.drug_autdit == 1 && recipeMsg.status == 1' @click='lookoverdetail' class="btn">查看详情</span>
                                <span v-show=' recipeMsg.drug_autdit == 0 && recipeMsg.status == 2 || recipeMsg.drug_autdit == 2 || recipeMsg.drug_autdit == 1 && recipeMsg.status == 2' @click='lookoverdetail' class="btn_orange">查看详情</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="recipe_yao">
                    <h2>处方中的药品</h2>
                    <div class="recipe-content">
                        <h3>{{ recipeMsg.hname }}</h3>
                        <ul v-for='(val, i) in recipedrug' :key='i' @click='updrugdetail(val.id)'>
                            <li class="dis_f">
                                <img :src="$http.baseURL+val.img" alt="" />
                                <dl class="flex1">
                                    <dt class="dis_f dis_sb">
                                        <p>{{ val.name }} <b v-show="val.gg">({{ val.gg }})</b></p>
                                        <span class="F-r">￥{{ val.money }}</span>
                                    </dt>
                                    <dd>
                                        <b>{{ val.company }}</b> 
                                        <span class="F-r">x{{ val.num }}</span>
                                    </dd>
                                </dl>
                            </li>
                            <li><span>用法用量：{{ val.usage }}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="recipeMsg.drug_autdit !== 2" :class="recipeMsg.drug_autdit == 1 && recipeMsg.status == 1 && recipeMsg.type == 0 ?'blue': recipeMsg.drug_autdit == 0 && recipeMsg.status == 1 && recipeMsg.type == 0 ? 'blue' :''" class="footer">
            <mt-button @click.native="handleClickBuy" :disabled='disabled' >{{ btnTxt }}</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'recipeAudit',
    data () {
        return {
            recipedrug: [],
            border: 'border: 1px solid #F09F88',
            recipeMsg: {},
            id: this.$route.query.id,
            disabled: true,             // 按钮状态
            btnTxt: '购买处方中的药品',
        }
    },
    beforeCreate () {
        if (this.$route.query.type && this.$route.query.type == 2) {
            this.$router.replace({name: 'recipeMsg', params: { id: this.$route.query.id }})
        }
    },
    mounted () {
        this.initdata()
    },
    beforeDestroy () {

    },
    methods: {
        initdata () {
            var self = this;
            this.$http.post('/mobile/doch5/user_recipe_detail', {id: this.id}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.disabled = false
                    self.recipeMsg = res.data;
                    if (self.recipeMsg.drug_autdit == 0 && self.recipeMsg.status == 1 && self.recipeMsg.type == 0) {
                        self.btnTxt = '预约购买处方中的药品'
                    } else if (self.recipeMsg.type == 1) {
                        self.btnTxt = '已购买处方中的药品'
                    } else {
                        self.btnTxt = '购买处方中的药品'
                    }
                    self.recipedrug = res.drug
                    if (this.recipeMsg.drug_autdit == 1 && res.data.status == 2) {
                        self.pastdue()
                    }
                }
            })
        },
        handleClickBuy () { // 去购买
            // if (this.recipeMsg.drug_autdit == 0 && this.recipeMsg.status == 1) {  // 未审核不能去购买
            //     this.$toast({
            //         message: '药师审核通过后，即可购买药品',
            //         position: 'middle',
            //         duration: 3000
            //     });
            //     return ;
            // }
            if (this.recipeMsg.drug_autdit == 0 && this.recipeMsg.status == 2) {  // 未审核过期
                this.$toast({
                    message: '处方已过期，请重新咨询医生，开具处方',
                    position: 'middle',
                    duration: 3000
                });
                return ;
            }
            if (this.recipeMsg.drug_autdit == 2) {  // 审核未通过
                this.$toast({
                    message: '药师审核未通过，请重新咨询医生，开具处方',
                    position: 'middle',
                    duration: 3000
                });
                return ;
            }
            if (this.recipeMsg.type == 1) {
                this.$toast({
                    message: '你已购买了药品，不可再次购买',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }
            if (this.recipeMsg.drug_autdit == 1 && this.recipeMsg.status == 2) {
                return;
            }
            this.$router.push({path: '/recipeorder', query: {id: this.id, hid: this.recipeMsg.hid} })            
        },
        pastdue () {
            this.$messagebox.confirm('<p style="color:#333;">处方已过期<br />请重新咨询医生，开具处方</p>', {showCancelButton: false, confirmButtonText: '好的'}).then(action => {
                console.log('过期提示')
            });
        },
        lookoverdetail () {
            this.$router.push({path: '/recipedrug', query:  {id: this.id}})
        },
        updrugdetail (id) {
            console.log(id)
            this.$router.push('/drugdetail?id='+id)
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 +rem;
}
.recipeAudit {
    width: 100%;
    height: 100%;
    background-color: #F9F9F9;
    font-size: rem(14);
    .section {
        width: 100%;
        overflow-y: scroll;
        .section_box {
            .recipe_haed {
                width: 100%;
                padding: rem(15);
                background-color: #FFF;
            .recipe_title {
                width: 100%;
                border:1px solid #469AF4;
                -webkit-border-radius: 2px;
                border-radius: 2px;
                .my_audit {
                    width: 100%;
                    height: rem(35);
                    padding-left: rem(15);
                    background-color: #EEF7FF;
                    color: #469AF4;
                    line-height: rem(35);
                }
                .my_audit_orange {
                    width: 100%;
                    height: rem(35);
                    padding-left: rem(15);
                    background-color: #FFF7F6;
                    color: #F09F88;
                    line-height: rem(35);
                }
                > ul {
                    width: 100%;
                    padding-top: rem(10);
                    li {
                        font-size: rem(12);
                        padding: rem(2) 0;
                        span{
                            display: inline-block;
                            line-height: rem(20);
                            vertical-align: top;
                        }
                        >span:first-child {
                            width: 25%;
                            text-align: right;
                            padding-right: rem(16);
                            color: #808080;
                        }
                        >span:last-child {
                            width: 65%;
                            color: #333;
                        }
                    }
                    .fr {
                        margin: rem(12) rem(15);
                        text-align: right;
                        height: rem(30);
                        .btn {
                            display: inline;
                            padding: rem(6) rem(7);
                            border: 1px solid #469AF4;
                            color:#469AF4;
                            -webkit-border-radius: 2px;
                            border-radius: 2px;
                        }
                        .btn_orange {
                            display: inline;
                            padding: rem(6) rem(7);
                            border: 1px solid #F09F88;
                            color:#F09F88;
                            -webkit-border-radius: 2px;
                            border-radius: 2px;
                        }
                    }
                }
            }
            }
            .recipe_yao {
                width: 100%;
                margin-top: rem(10);
                background-color: #FFF;
                > h2 {
                    font-size: rem(14);
                    color: #333;
                    height: rem(44);
                    line-height: rem(44);
                    padding: 0 rem(15);
                    font-weight: 600;
                }
                .recipe-content {
                    padding: rem(15) rem(15) 0;
                    color: #333;
                    > h3 {
                        font-size: rem(13);
                    }
                    > ul {
                        width: 100%;
                        padding: rem(15) 0;
                        border-bottom:1px solid #F0F2F6;
                        li {
                            width: 100%;
                            img {
                                width: rem(42);
                                height: rem(43);
                            }
                            dl {
                                padding-left: rem(10);
                                dt {
                                    font-size: rem(12);
                                    line-height: rem(17);
                                    >p {
                                        width: 85%;
                                    }
                                }
                                dd {
                                    font-size: rem(11);
                                    line-height: rem(17);
                                    color: #808080;
                                    margin-top: rem(9);
                                }
                            }
                        }
                        li:last-child {
                            margin-top: rem(10);
                            font-size: rem(11);
                            line-height: rem(17);
                            color: #808080;
                        }
                    }
                }
            }
        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        button {
            display: block;
            width: 100%;
            height: rem(49);
            background-color: #C6C6C6;
            color: #fff;
            font-size: rem(16);
            -webkit-border-radius: 0;
            border-radius: 0;
        }
    }
    .blue {
        button {
            background-color: #469AF4;
        }
    }
}
</style>
