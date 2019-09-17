<template>
<!-- 地址管理 -->
    <div class="sitelist">
        <div class="content">
            <div class="content_box">
                <div class="empty" v-if='!siteData.length'>
                    <img src="../../common/img/pic_zwdz.png" alt="">
                    <p>你还没有添加过地址</p>
                </div>
                <div v-if='siteData.length' class='site_con'>
                    <ul v-for='(val,i) in siteData' :key='i'>
                        <li>
                            <span>{{ val.name }}</span><span class="phone">{{ val.phone }}</span><span><img v-if='val.status == 2' src="../../common/img/icon_mr.png" alt=""></span>
                        </li>
                        <li class="place">
                            {{ val.province }}{{ val.city }}<span>{{ val.county }}</span><span>{{ val.address }}</span>
                        </li>
                        <li @click='editOut(val.id)' class="edit_R"><img src="../../common/img/icon_bj.png" alt=""></li>
                    </ul>
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
    data () {
        return {
            siteData: [],
            userId: ''         // 用户id
        }
    },
    mounted () {
        this.userId = this.$cookie.get('userLogins');
    },
    activated () {
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
                } else {
                    _self.siteData = []
                }
            }).catch(err => console.log(err))
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
.sitelist {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
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
            >ul {
                width: 100%;
                box-shadow:0px rem(5) rem(10) 0px rgba(0, 0, 0, 0.1);
                padding: rem(15);
                margin-top: rem(5);
                position: relative;
                background-color: #fff;
                li {
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
