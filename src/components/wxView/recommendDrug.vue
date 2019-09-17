<template>
    <!-- 模板推送 推荐药品 -->
    <div class="recommendDrug dis_f flex_c">
       <div class="section flex1">
           <div class="section-box">
                <div class="head-msg">
                    您的医生<span>{{ tjmessage.true_name }}</span>，建议您服用以下药品
                </div>
                <div class="content-drug">
                    <h2 v-show="tjmessage.type == 2">{{ tjmessage.true_name }}医生的店铺</h2>
                    <h2 v-show="tjmessage.type == 1">{{ tjmessage.hospital_name }}</h2>
                    <dl class="dis_f" v-for="(val, i) in tjmessage.docsuggestdrug" :key='i' @click="updrugdetail(val.gid)">
                        <dt><img v-lazy="$http.baseURL+val.pic" alt="" /></dt>
                        <dd class="flex1">
                            <h2><span>{{ val.name }} <span v-show="val.gg">({{ val.gg }})</span></span><span class="F-r"><b>￥</b>{{ val.money }}</span></h2>
                            <p>{{val.gc}} <span class="F-r">x{{ val.num }}</span></p>
                        </dd>
                    </dl>
                </div>
           </div>
       </div>
       <div class="footer">
           <mt-button @click.native="handleClickbuy">购买药品</mt-button>
       </div>
    </div>
</template>

<script>
export default {
    name: 'recommendDrug',
    data () {
        return {
            rid: this.$route.query.rid,
            tjmessage: {},           // 信息
        }
    },
    mounted () {
        this.initdata()
    },
    methods: {
        initdata () {
            var self = this;
            self.$http.post('/mobile/wxorder/doc_push', {rid: this.rid}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.tjmessage = res.data[0];
                    self.$cookie.set('userLogins', self.tjmessage.uid, 1)
                }
            })
        },
        handleClickbuy () {
            this.$router.push({path:'/yaorecipeorder', query:{rid: this.rid}})
        },
        updrugdetail (id) { // 查看药品详情
            if(this.tjmessage.type == 1) {
                this.$router.push('/drugdetail?id='+id)
            } else {
                this.$router.push('/shopdetail?id='+id+'&type=1')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.recommendDrug {
    width: 100%;
    height: 100%;
    font-size: rem(14);
    background-color: #F4F4F4;
    .section {
        width: 100%;
        overflow-y: scroll;
        .section-box {
            .head-msg {
                height: rem(39);
                line-height: rem(39);
                background-color: #FDF5F3;
                color: #F09F88;
                font-size: rem(12);
                padding: 0 rem(15);
            }
            .content-drug {
                width: 100%;
                padding: 0 rem(15);
                background-color: #fff;
                >h2 {
                    padding: rem(16) 0;
                    color: #333;
                    font-weight: 600;
                    border-bottom: 1px solid #E6E6E6;
                }
                dl {
                    padding: rem(14.5) 0;
                    dt {
                        width: rem(44);
                        height: rem(44);
                        img {
                            width: rem(44);
                            height: rem(44);
                            border-radius:2px;
                        }
                    }
                    dd {
                        padding-left: rem(15);
                        > h2 {
                            line-height: rem(20);
                           > span:first-child {
                                display: inline-block;
                                width: 80%;
                                > span {
                                    font-size: rem(12);
                                    margin-left: rem(3);
                                }
                            }
                            > span {
                                b {
                                    font-size: rem(12);
                                }
                            }
                        }
                        p {
                            color: #808080;
                            font-size: rem(12);
                            margin-top: rem(8);
                            line-height: rem(20);
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
            width: 100%;
            background-color: #469AF4;
            color: #FFF;
            font-size: rem(16);
            display: block;
            border-radius: 0;
        }
    }
}
</style>

