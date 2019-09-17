<template>
    <!-- 我的医生 -->
    <div class="doctor dis_f flex-v">
         <!-- <div class="header">
            <img @click='Return' src="../../common/img/icon_fh.png" alt="">
            <span>我的医生</span>
        </div> -->
        <div class="section flex1">
            <div>
                <div class="kong" v-if='!datalist.length'>
                    <img src="../../common/img/pic_zwys.png" alt="">
                    <p>你当前暂未添加医生，<span @click='handleClick'>立即找医生</span></p>
                </div>
                <div v-if='datalist.length'>
                    <div class="list">
                        <ul v-for='(val,i) in datalist' @click='Clickdetail(val.did)' :key='i'>
                            <li>
                                <img :src="$http.baseURL+val.picture" alt="">
                                <dl>
                                    <dt>
                                        <span>{{ val.true_name }}</span>
                                        <b>{{ val.gname }} | {{ val.department_name }}</b>
                                    </dt>
                                    <dd>
                                        {{ val.hospital_name }}
                                    </dd>
                                </dl>
                            </li>
                            <li>{{ val.title }}</li>
                        </ul>
                            
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <mt-button type="primary" v-if='!datalist.length' size="large" @click.native="handleClick">立即找医生</mt-button>
            <mt-button type="primary" v-if='datalist.length' size="large" @click.native="handleClick2">找其他医生</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            datalist: [],
            uid: this.$cookie.get('userLogins'),
            page: 1,
            limit: 15
        }
    },
   
    mounted() {
        this.initdata()
    },
    methods: {
        initdata () {
            var self = this;
            var obj = {uid:this.uid, page: this.page, limit: this.limit}
            this.$http.post('/mobile/wxdoccenter/my_doctors', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    var data = res.data, arr = [];
                    for (var i=0; i< data.length; i++) {
                        if (data[i].did) {
                            arr.push(data[i])
                        }
                    }
                    self.datalist = arr
                } else {
                    self.datalist = []
                }
            })
        },
        handleClick() {         // 立即找医生
            this.out('searchdoctor')
        },
        handleClick2() {    // 找其他医生
            this.out('/searchdoctor')
        },
        Return () {         // 返回
            this.$router.go(-1)
        },

        Clickdetail (id) {       // 进入医生详情
            this.$router.push({ name: 'doctordetail', params: { id:id}})
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
.doctor {
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: rem(14);
    .header {
        -webkit-display: flex;
        display: flex;
        height: rem(40);
        justify-content: center;
        color: #212121;
        position: relative;
        box-shadow:0px 1px 0px 0px rgba(224,224,224,.5);
        padding-top: rem(0);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        font-size: rem(16);
        background: #fff;
        img {
            font-size: rem(30);
            position: absolute;
            left: rem(15);
            top: rem(9);
            line-height: 1;
            font-size: rem(18);
            width: rem(18);
        }
        span {
            padding-top: rem(12);
            font-weight:400;
            color: #212121;
        }
    }
    .section {
        width: 100%;
        font-size: rem(14);
        overflow-y: scroll;
        padding-bottom: rem(5);
        .kong {
            text-align: center;
            padding: rem(81) 0;
            img {
                width: rem(125);
                display: block;
                margin: 0 auto;
            }
            >p {
                text-align: center;
                color: #808080;
                margin-top: rem(26);
                >span {
                    color: #129DFA;
                }
            }
        }
        .list {
            width: 100%;
            font-size: rem(12);
            padding: 0 rem(15);
            >ul {
                padding: rem(15);
                width: 100%;
                background:rgba(255,255,255,1);
                box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.1);
                border-radius:4px;
                margin-top: rem(5);
                li:first-child {
                    -webkit-display: flex;
                    display: flex;
                    >img {
                        display: block;
                        width: rem(49);
                        height: rem(49);
                        border-radius: 50%;
                    }
                    >dl {
                        flex: 1;
                        padding-left: rem(15);
                        dt {
                            line-height: rem(30);
                            span {
                                margin-right: rem(15);
                                color:#333;
                                font-size: rem(16);
                            }
                            b {
                                color: #808080;
                                font-size: rem(12);
                            }
                        }
                        dd {
                            font-size: rem(12);
                            color: #333;
                        }
                    }
                }
                li:last-child {
                    margin-top: rem(10);
                    font-size: rem(12);
                    color: #808080;
                    line-height: rem(18);
                }
            }
        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        button {
            height: rem(49);
            font-size: rem(17);
        }
    }
}
</style>
