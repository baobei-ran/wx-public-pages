<template>
<!-- 商品订单 -->
    <div class="ordergoods">
        <div class="navtab">
            <ul class="dis_f dis_sb flex-vc">
                <li v-for='item in tabList' :key='item.id'  @click='tabs(item.id, item.v_id)' :class="{'action': tabId == item.id}" >{{ item.value }}</li>
            </ul>
        </div>
        <div class="content">
            <div class="content_box">
                <div class="orderall">
                    <div class="empty" v-if='!alllist.length'>
                        <empty></empty>
                    </div>
                    <div class="content_box_box">
                      <Home :alllist='alllist' />
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
import Home from './goodComponent/g_home'
export default {
    components: {
        empty: empty,
        Home: Home
    },
        data () {
            return {
                alllist: [],
                page: 1,
                limit: 20,
                type: '',
                tabId: 1,
                tabList: [
                  {id: 1, value: '全部', v_id: '', component: ''},
                  {id: 2, value: '待付款', v_id: '1', component: ''},
                  {id: 3, value: '待收货', v_id: '2', component: ''},
                  {id: 4, value: '已完成', v_id: '3', component: ''},
                  {id: 5, value: '已取消', v_id: '4', component: ''},
                ],
                uid:this.$cookie.get('userLogins'),
            }
        },
        activated () {
            this.initdata (this.page, this.type)
        },
        methods: {
            tabs (val, v_id) {
                this.tabId = val
                this.type = v_id
                this.initdata(this.page, this.type)
            },
            outShop () {    // 去逛逛按钮
                this.out('/doctorshoplist')
            },
            Returns () {
                this.$router.back()
            },
            initdata (page, type) {   // 数据
                var self = this;
                console.log(type)
                var obj = { uid: self.uid, status: type, page: page, num: this.limit }
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
        }
}
</script>

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
            height: rem(48);
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
