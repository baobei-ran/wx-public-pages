<template>
<!-- 商品订单 -->
    <div class="ordergoods">
        <div class="navtab">
            <ul class="dis_f dis_sb flex-vc">
                <li v-for='item in tabList' :key='item.id'  @click='tabs(item.id)' :class="{'action': tabId == item.id}" >{{ item.value }}</li>
            </ul>
        </div>
        <div class="content">
            <div class="content_box">
                

    <div class="orderall">
        <div class="empty" v-if='!alllist.length'>
            <empty></empty>
        </div>
        <div class="content_box">
            <div class="Pd-B10">
        <div class="content" v-if='alllist.length'>   
            <!-- 待付款 -->
            <div class="add Mg-T" v-for='(val,i) in alllist' :key='i' v-if='val.status == 1'>
                <h4>
                    <span v-show="val.tpye == 1">{{ val.type_name }}医生的店铺</span> 
                    <span v-show="val.tpye == 2">{{ val.type_name }}</span>
                    <span>等待付款</span>
                </h4>
                <div class="order_list" @click='paydetail(val)'>
                    <dl>
                        <dt class="dis_f flex_i">
                            <img v-for="(item, j) in val.img" :key='j+"_1"' :src="$http.baseURL+item" alt="">
                            <span v-show="val.picnum > 4" class="omit"></span>
                        </dt>
                        <dd>
                            <span>￥{{ val.money }}</span>
                            <p>共{{ val.allnum }}件商品</p>
                            <b v-show="val.distribution == 2">门店自提</b>
                        </dd>
                    </dl>
                </div>
                <div class="addbtn">
                    <mt-button type="primary" @click.native='paydetail(val)'>去支付</mt-button>
                </div>
            </div>
            
            <!-- 待发货 -->
            <!-- <div class="take Mg-T" v-for='(val,i) in alllist' :key='i+"_2"' v-if='val.status == 2 || val.status == 3 || val.status == 4'>
                <h4>{{ val.sname }}医生的店铺
                    <span>等待发货</span></h4>
                <div class="order_list" @click='outdetails(val)'>
                    <dl>
                        <dt class="dis_f flex_i">
                            <img v-for="(item, j) in val.img" :key='j+"_22"' :src="$http.baseURL+item" alt="">
                        </dt>
                        <dd>
                            <span>￥{{ val.money }}</span>
                            <p>共{{ val.allnum }}件商品</p>
                            <b v-show="val.distribution == 2">门店自提</b>
                        </dd>
                    </dl>
                </div>
                <div class="addbtn"><mt-button @click.native='buy(val)'>再次购买</mt-button></div>
            </div> -->

            <!-- 待收货 -->
            <div class="take Mg-T" v-for='(val,i) in alllist' :key='i+"_3"' v-if='val.status == 2 || val.status == 3 || val.status == 4'>
                <h4>
                    <span v-show="val.tpye == 1">{{ val.type_name }}医生的店铺</span> 
                    <span v-show="val.tpye == 2">{{ val.type_name }}</span>
                    <span v-text="val.tpye == 1?'待收货':'待取货'"></span></h4>
                <div class="order_list" @click='outdetails(val)'>
                    <dl>
                        <dt class="dis_f flex_i">
                            <img v-for="(item, j) in val.img" :key='j+"_33"' :src="$http.baseURL+item" alt="" />
                            <span v-show="val.picnum > 4" class="omit"></span>
                        </dt>
                        <dd>
                            <span>￥{{ val.money }}</span>
                            <p>共{{ val.allnum }}件商品</p>
                            <b v-show="val.distribution == 2">门店自提</b>
                        </dd>
                    </dl>
                </div>
                <div class="addbtn" v-show="val.distribution == 1"><mt-button @click.native='buy(val)'>再次购买</mt-button><mt-button class="yes" @click.native='take(val)'>确认收货</mt-button></div>
            </div>

        <!-- 已完成 -->
            <div class="take Mg-T" v-for='(val,i) in alllist' :key='i+"_4"' v-if='val.status == 5'>
                <h4>
                    <span v-show="val.tpye == 1">{{ val.type_name }}医生的店铺</span> 
                    <span v-show="val.tpye == 2">{{ val.type_name }}</span>
                    <span>已完成</span></h4>
                <div class="order_list" @click='outdetails(val)'>
                    <dl>
                        <dt class="dis_f flex_i">
                            <img v-for="(item, j) in val.img" :key='j+"_44"' :src="$http.baseURL+item" alt="" />
                            <span v-show="val.picnum > 4" class="omit"></span>
                        </dt>
                        <dd>
                            <span>￥{{ val.money }}</span>
                            <p>共{{ val.allnum }}件商品</p>
                            <b v-show="val.distribution == 2">门店自提</b>
                        </dd>
                    </dl>
                </div>
                <div class="addbtn" v-show="val.distribution == 1">
                    <!-- <mt-button @click.native='del(val)'>删除订单</mt-button> -->
                    <mt-button class="yes" @click.native='buy(val)'>再次购买</mt-button></div>
            </div>

            <!-- 已取消 -->
            <div class="take Mg-T" v-for='(val,i) in alllist' :key='i+"_5"' v-if='val.status == 6'>
                <h4>
                    <span v-show="val.tpye == 1">{{ val.type_name }}医生的店铺</span> 
                    <span v-show="val.tpye == 2">{{ val.type_name }}</span>
                    <span>已取消</span>
                </h4>
                <div class="order_list" @click='outdetails(val)'>
                    <dl>
                        <dt class="dis_f flex_i">
                            <img v-for="(item, j) in val.img" :key='j+"_55"' :src="$http.baseURL+item" alt="">
                            <span v-show="val.picnum > 4" class="omit"></span>
                        </dt>
                        <dd>
                            <span>￥{{ val.money }}</span>
                            <p>共{{ val.allnum }}件商品</p>
                            <b v-show="val.distribution == 2">门店自提</b>
                        </dd>
                    </dl>
                </div>
                <div class="addbtn" v-show="val.distribution == 1">
                    <mt-button class="yes" @click.native='buy(val)'>再次购买</mt-button></div>
            </div>
            
        </div>
        </div>
        </div>
    </div>




            </div>
        </div>
        <div class="footer" v-if='!alllist.length'>
            <mt-button size="large" type="primary" @click.native='outShop'>去逛逛</mt-button>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';
import empty from './goodslist/empty'
export default {
    components: {
        empty: empty
    },
        data () {
            return {
                alllist: [],
                page: 1,
                limit: 10,
                type: '',
                tabId: 1,
                tabList: [
                  {id: 1, value: '全部', component: ''},
                  {id: 2, value: '待付款', component: ''},
                  {id: 3, value: '待收货', component: ''},
                  {id: 4, value: '已完成', component: ''},
                  {id: 5, value: '已取消', component: ''},
                ]
            }
        },
        activated () {
            this.initdata (this.page, this.type)
        },
        methods: {
            tabs (val) {
                this.tabId = val
                if (val == 1) {
                    this.type = ''
                    this.initdata(this.page, this.type)
                } else if (val == 2) {
                    this.type = '1'
                    this.initdata(this.page, this.type)
                } else if (val == 3) {
                    this.type = '2'
                    this.initdata(this.page, this.type)
                } else if (val == 4) {
                    this.type = '3'
                    this.initdata(this.page, this.type)
                } else if (val == 5) {
                    this.type = '4'
                    this.initdata(this.page, this.type)
                }
            },
            outShop () {    // 去逛逛按钮
                this.out('/doctorshoplist')
            },
            Returns () {
                this.$router.back()
            },
            initdata (page, type) {   // 数据
                var self = this;
                var uid = this.$cookie.get('userLogins')
                console.log(type)
                var obj = { uid: uid, status: type, page: page, num: this.limit }
                self.$http.post('/mobile/wxorder/user_goods', obj).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        self.alllist = res.data
                        self.alllist.map(val => { // 图片最多显示四张
                            val.picnum = val.img.length
                            if(val.img.length > 5) {
                                val.img.length = 4
                            }
                         })
                        console.log(self.alllist)
                    } else {
                        self.alllist = []
                    }
                })
            },
            del(val) { // 删除订单
                var self = this;
                MessageBox.confirm('删除后不可恢复，是否删除?', '').then(action => {
                    var obj = { number: val.number, type: 1 }
                    self.$http.post('/mobile/Wxorder/set_order', obj).then(res => {
                        console.log(res)
                        if (res.code == 1) {
                            Toast({
                                message: '删除成功!',
                                position: 'center',
                                duration: 2000
                            });
                            self.initdata(self.page, self.type)
                        } else {
                            Toast({
                                message: res.msg,
                                position: 'center',
                                duration: 2000
                            });
                        }
                    })
                }).catch(err => {
                    console.log(err)
                })

            },
            buy (val) {   // 再次购买
                console.log(val)
                this.$router.push({ name: 'orderbuyagain', params: { id:val.number} })   
            },
            take(val) {  // 确认收货
                var self = this;
                MessageBox.confirm('<p style="color:#333;">确认收货吗?</p>', '').then(action => {
                    var obj = { number: val.number, type: 3}
                    self.$http.post('/mobile/Wxorder/set_order', obj).then(res => {
                        console.log(res)
                        if (res.code == 1) {
                            Toast({
                                message: '操作成功',
                                position: 'center',
                                duration: 2000
                            });
                            self.initdata (this.page, this.type)
                        } else {
                            Toast({
                                message: res.msg,
                                position: 'center',
                                duration: 2000
                            });
                        }
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
           
            paydetail(val) {    // 去支付就可以进入 待付款详情
                if (val.distribution == 1) {
                    this.$router.push({ name: 'addorderdetail', params: { id: val.number }})
                } else {
                    this.$router.push({ path: '/orderdetails', query: { id: val.number }}) // 药店自提详情
                }
                
            },
            outdetails (val) {    // 取消和已完成、待收货的查看详情
                if (val.distribution == 1) {
                    this.$router.push({ path: '/successOrder', query: { id: val.number}})
                } else {
                    this.$router.push({ path: '/orderdetails', query: { id: val.number }}) // 药店 自提详情
                }
                
            },
        }
}
</script>

<style>

</style>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.ordergoods {
    width: 100%;
    height: 100%;
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
    background: #F9F9F9;
    .navtab {
        padding-bottom: rem(2);
        background-color: #fff;
        ul {
            height: rem(46);
            padding: 0 rem(20);
            font-size: rem(14);
            li {
                float: left;
                height: rem(46);
                line-height: rem(46);
                transition: all 0.1s linear;
                position: relative;
            }
            li:after {
                display: block;
                content: '';
                clear:both;
                visibility: hidden;
            }
            li::before {
                content: "";
                position: absolute;
                top: 0;
                left: 100%;
                width: 0;
                height: 100%;
                border-bottom: 3px solid #4A9CF3;
                transition: 0.1s all linear;
            }
            .action {
                color: #4A9CF3;
            }
            .action ~ li::before {
                left: 0;
            }
            .action::before {
                width: 100%;
                left: 0;
                top: 0;
            }
        }
    }
    .content {
        -webkit-flex:1;
        flex: 1;
        overflow-y: scroll;
        
        .orderall {
    width: 100%;
    font-size: rem(16);
    
    .Mg-T {
        margin-top: rem(10);
    }
    .Pd-B10 {
        padding-bottom: rem(20);
    }
    .content {
        width: 100%;
        .add {
            width: 100%;
            font-weight:400;
            padding: rem(15);
            background-color: #fff;
            margin-top: rem(10);
            h4 {
            
                line-height: rem(30);
                font-size: rem(14);
                color:#333;
                overflow: hidden;
                span:first-child {
                    color: #333;
                }
                >span:last-child {
                    float: right;
                    color:#808080;
                    font-size: rem(12);
                }
            }
            .order_list {
                width: 100%;
                padding: rem(7.5) 0;
                >dl {
                    -webkit-display: flex;
                    display: flex;
                    margin: rem(7.5) 0;
                        dt {
                            width: 80%;
                            >img {
                                display: inline-block;
                                width: rem(50);
                                height: rem(50);
                                margin-bottom: rem(2);
                                margin-right: rem(3);
                                border-radius:4px;
                            }
                            .omit {
                                display: inline-block;
                                width: rem(30);
                                height: rem(30);
                                background: url('../../common/img/icon_gdyp.png') no-repeat;
                                background-size: cover;
                            }
                        }
                    dd {
                        margin-left: rem(2);
                        font-size: rem(12);
                        color:#333;
                        
                        >span {
                            color: #F09F88;
                            display: block;
                        }
                        > p {
                            padding: rem(5) 0;
                        }
                        >b {
                            font-size: rem(10);
                            color: #4A9CF3;
                        }
                    }
                }
               
            }
             >p {
                    width:100%;
                    text-align: right;
                    font-size: rem(12);
                    line-height: rem(20);
                }
                .addbtn {
                    width: 100%;
                    text-align: right;
                    margin-top: rem(15);
                    >button {
                        height: rem(25);
                        border-radius: rem(13);
                        font-size: rem(13);
                    }
                }
        }

        .take {
            width: 100%;
            font-weight:400;
            background-color: #fff;
            margin-top: rem(10);
            padding: rem(15);
             h4 {
                line-height: rem(30);
                font-size: rem(14);
                color:#333;
                 span:first-child {
                    color: #333;
                }
                >span:last-child {
                    float: right;
                    color:#808080;
                    font-size: rem(12);
                }
            }
            .order_list {
                width: 100%;
                padding: rem(7.5) 0;
                >dl {
                    -webkit-display: flex;
                    display: flex;
                    margin: rem(7.5) 0;
                        dt {
                            width: 80%;
                            >img {
                                display: inline-block;
                                width: rem(50);
                                margin-bottom: rem(2);
                                margin-right: 8px;
                                border-radius:4px;
                            }
                            .omit {
                                display: inline-block;
                                width: rem(30);
                                height: rem(30);
                                background: url('../../common/img/icon_gdyp.png') no-repeat;
                                background-size: cover;
                            }
                        }
                    dd {
                        font-size: rem(12);
                        color:#333;
                        text-align: center;
                        >span {
                            color: #F09F88;
                            display: block;
                            font-size: rem(12);
                        }
                        >p {
                            padding: rem(5) 0;
                        }
                        > b {
                            color: #4A9CF3;
                            font-size: rem(10);
                        }
                    }
                }
               
            }
             >p {
                    width:100%;
                    text-align: right;
                    font-size: rem(12);
                    line-height: rem(20);
                }
                .addbtn {
                    width: 100%;
                    text-align: right;
                    margin-top: rem(15);
                    >button {
                        height: rem(25);
                        border-radius: rem(13);
                        font-size: rem(13);
                        border:1px solid rgba(74,156,243,1);
                        color: #4A9CF3;
                        background-color: #fff;
                    }
                    .yes {
                        margin-left: rem(15);
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
            height: 100%;
            border-radius: 0;
            font-size: rem(17);
        }
    }
}


</style>
