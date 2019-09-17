<template>
<!-- 地址管理 -->
    <div class="sitelist">
        <!-- <div class="header">
            <img @click='Returns' src="../../common/img/icon_fh.png" alt="">
            <span>收货地址管理</span>
        </div> -->
        <div class="content">
            <div class="content_box">
                <div class="empty" v-if='!siteData.length'>
                    <img src="../../common/img/pic_zwdz.png" alt="">
                    <p>你还没有添加过地址</p>
                </div>
                <div v-if='siteData.length' class='site_con'>
                    <div class="orderSite"  v-for='(val,i) in siteData' :key='i'>
                        <ul @click='getsite(val.id)'>
                            <li>
                                <span>{{ val.name }}</span><span class="phone">{{ val.phone }}</span><span><img v-if='val.status == 2' src="../../common/img/icon_mr.png" alt=""></span>
                            </li>
                            <li class="place">
                                {{ val.province }}{{ val.city }}<span>{{ val.county }}</span><span>{{ val.address }}</span>
                            </li>
                        </ul>
                        <p @click='editOut(val.id)' class="edit_R"><img src="../../common/img/icon_bj.png" alt=""></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" >
            <mt-button size="large" type="primary" @click.native='outShop'>新增地址</mt-button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'setorder',
        data () {
            return {
               siteData: [],
               userId: ''         // 用户id
            }
        },
        updated () {
            
        },
        mounted () {
            console.log(this.$route)
            this.userId = this.$cookie.get('userLogins');
            this.listdata()
        },
        methods: {
            outShop () {    // 新增地址
                this.out('/addsite?uid='+ this.userId)
            },
            editOut (id) {    // 去编辑
                this.$router.push({path: '/editsite', query: { id:id, uid: this.userId } })
            },
            listdata () {
                var _self = this;
                this.$http.post('/mobile/Wxuser/useraddress_list', {uid: _self.userId}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        _self.siteData = res.data
                    }
                }).catch(err => console.log(err))
            },
            Returns () {
                this.$router.back()
            },
            getsite (id) {
                var location;
                this.siteData.map(val => {
                    if (val.id == id) {
                        location = val
                    }
                })
                var a = JSON.stringify(location)
                this.$cookie.set('userSite', a, 365)
                this.$router.replace({ name: 'takeorderdetail', params: { id: this.$route.query.id} })
                this.$router.go(-1);
            }
        }
}
</script>

<style>

</style>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.sitelist {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    .header {
        display: -webkit-flex;
        display: flex;
        height: rem(40);
        justify-content: center;
        color: #212121;
        position: relative;
        box-shadow:0px 1px 0px 0px rgba(224,224,224,1);
        padding-top: rem(0);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background: #fff;
        img {
            font-size: rem(30);
            position: absolute;
            left: rem(15);
            top: rem(10);
            line-height: 1;
            font-size: rem(19);
            width: rem(28);
            padding: rem(5);
        }
        span {
            padding-top: rem(15);
            font-weight:400;
            color: #212121;
        }
    }
    
    .content {
        -webkit-flex:1;
        flex: 1;
        overflow: auto;
        .empty {
            width: 100%;
            text-align: center;
            img {
                margin-top: rem(82);
                width: rem(120);
            }
            > p{
                margin-top: rem(26);
                font-size: rem(14);
                color: #808080;
            }
        }
        .site_con {
            width: 100%;
            padding: 0 rem(15);
            .orderSite {
                width: 100%;
                box-shadow:0px rem(5) rem(10) 0px rgba(0, 0, 0, 0.1);
                padding: rem(15) rem(30) rem(15);
                margin-top: rem(5);
                position: relative;
                background: #fff;
            >ul {
                
                width: 97%;
                li {
                    width: 100%;
                    color: #333;
                    font-size: rem(14);
                    padding-left: rem(18);
                    line-height: rem(17);
                    .phone {
                        margin:0 rem(8);
                        color: #666;
                    }
                    >span {
                        img {
                            width: rem(35);
                            height: rem(16);
                        }
                    }
                }
                .place {
                    background: url('../../common/img/icon_dz.png') no-repeat 0;
                    background-size: 8%;
                    font-size: rem(12);
                    margin-top: rem(11);
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
               
            }
             .edit_R {
                    position: absolute;
                    right:rem(2);
                    top: rem(23);
                    >img {
                        width: rem(28);
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
