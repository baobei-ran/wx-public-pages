<template>
                    <!--  更多医生店铺 -->
    <div class="doctorshoplist dis_f flex_d">
         <div class="empty" v-if="is_emp">
                <img src="../../common/img/pic_zwsp.png" alt="" />
                <p>暂无数据</p>
            </div>
        <div class="content flex1" ref='scrolls'>  
            <div class="content_box">
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                    <div class="take Mg-T"  v-for='(val,i) in alllist' :key='i'>
                        <div class="doctor_box dis_f dis_sb flex_i">
                            <div class="doctor_title dis_f flex_i">
                                <div class="doc_pic"><img :src="$http.baseURL+val.picture" :key='val.picture' alt="" /></div>
                                <div class="keep">
                                    <h4>{{ val.true_name }}医生的店铺 
                                        <span v-if='val.relevance == 1'><img src='../../common/img/icon_bq.png' alt=''/>关注的医生</span></h4>
                                    <div class="soldOut">
                                        <span>{{ val.hospital_name }}</span> | <span>已售<span>{{ val.count }}</span>件</span>
                                    </div>
                                </div>
                            </div>
                            <div class='btn_more'><mt-button @click.native='getDoctor(val.did)'>进店</mt-button></div>
                        </div>
                        
                        <div class="order_list" @click='getDoctor(val.did)'>
                            <ul class="dis_f" id='doc_dian'>
                                <li v-for='item in val.goods_pic' >
                                    <img v-lazy="$http.baseURL+item" :key='item' alt="" />
                                </li>
                            
                                <!-- <li class="right"><img src="../../common/img/icon_enter.png" alt="" /></li> -->
                            </ul>
                        </div>
                    </div>
            </div>
                <div class="drop-up" v-if="dropup">—— 没有数据了 ——</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
   
    data () {
        return {
            alllist: [],         //  数据
            page: 1,
            limit: 10,
            busy: true,
            dropup: false,
            count: 0,
            uid: '',
            time: '',   // 盛放定时器
            is_emp: false,
        }
    },
    created() {
        var urldata = this.$route.query
        if(urldata.uid) {
            this.uid = urldata.uid
            var uids = this.$cookie.get('userLogins') 
            if (!uids || urldata.uid) {
                this.$cookie.set('userLogins', urldata.uid, 365)
            }
            var self = this;
            self.$http.post('/mobile/wxauth/is_auth', { uid: urldata.uid}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    if (res.auth == 3) {
                        self.$router.replace('/phone?uid='+urldata.uid)
                        return;
                    } 
                    if (res.auth == 2 ) {
                        self.$router.replace('/authentication')
                    }
                }
            })
        
        } else {
            this.show = true
            this.uid = this.$cookie.get('userLogins');
        }
         
    },
    mounted () {
        this.initdata()
    },
    activated () {
        this.$refs.scrolls.scrollTop = this.$route.meta.y
        var _this = this;
        this.$refs.scrolls.addEventListener('scroll', _this.isScrollTop, false)
    },
    deactivated () {
        var _this = this;
        this.$refs.scrolls.removeEventListener('scroll', _this.isScrollTop, false)
        clearTimeout(this.time)
    },
    methods: {
        isScrollTop (e) {
            if (this.time) clearTimeout(this.time)
            this.time = setTimeout(() => {
                this.$route.meta.y = e.target.scrollTop
            }, 300)
        },
        loadMore: function() {
            this.busy = true
            this.page += 1
            this.initdata()
        },
        initdata () {
            var self = this;
            if (this.dropup) {
                return
            }
            this.$http.post('/mobile/Wxdoccenter/doc_goods', {page: this.page, num: this.limit, uid: this.uid }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.busy = false;
                    self.is_emp = false;
                    self.count = res.counts
                     res.data.forEach(val => {
                            var pic = val
                            var arr = pic.goods_pic.split(',')
                            if (arr.length > 3) {
                                arr.length = 3
                                val.goods_pic = arr
                            } else {
                                val.goods_pic = arr
                            }
                        })
                    if (self.page <= 1) {
                        self.alllist = res.data;
                        if (self.alllist.length == self.count) {
                            self.busy = true
                        }
                    } 
                    else if (self.page > 1) {
                        var s = res.data
                        self.alllist = self.alllist.concat(s)
                        if (self.alllist.length == self.count) {
                            self.dropup = true
                            self.busy = true
                        }
                    }
                } else {
                    if (self.alllist.length == 0) {
                        self.is_emp = true;
                        self.busy = true
                        return;
                    }
                    if (self.alllist.length > 9) {
                        self.dropup = true
                    }
                    self.busy = true
                }
            })
        },
        Return () {
            this.$router.go(-1)
        },
        getDoctor (id) {    // 进店
        console.log(id)
            this.$router.push({name: 'doctorshop', params: { id: id}})
        },
        outdetails(val) {
            console.log(val)
        }
    }
}
</script>


<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
@mixin borderRaduis($v) {
    -webkit-border-radius: $v;
    -moz-border-radius: $v;
    -ms-border-radius: $v;
    -o-border-radius: $v;
    border-radius: $v;
}
.doctorshoplist {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    background-color: #f9f9f9;
    
    .Mg-T {
        margin-top: rem(10);
    }
    .empty {
        width: 100%;
        margin-top: rem(120);
        img {
            width: rem(150);
            height: rem(150);
            display: block;
            margin: 0 auto;
        }
        p {
            text-align: center;
            color: #808080;
            font-size: rem(14);
        }
    }
    .content {
        width: 100%;
        overflow: auto;
        padding: 0 rem(10);
        overflow: auto;
       .content_box {
           width:100%;
           margin-bottom: rem(20);
           .drop-up{
                width: 100%;
                height: rem(40);
                line-height:rem(40);
                text-align: center;
                font-size: rem(14);
                color:#CCC;
            }
        .take {
            width: 100%;
            box-shadow:0px rem(5) rem(10) 0px rgba(0, 0, 0, 0.1);
            padding: rem(10);
            font-weight:400;
            background: #fff;
            @include borderRaduis(rem(6));
            .doctor_box {
                width: 100%;
                .doctor_title {
                    width: 100%;
                    .doc_pic {
                        width: rem(44);
                        height: rem(44);
                        @include borderRaduis(100%);
                        img {
                            width: rem(44);
                            height: rem(44);
                            max-width: rem(44);
                            max-height: rem(44);
                            min-height: rem(44);
                            @include borderRaduis(100%);
                        }
                   
                    }
                 .keep {
                     padding-left: rem(10);
                     margin-right: rem(3);
                        >h4 {
                            line-height: rem(20);
                            font-size: rem(13);
                            color:#333;
                            font-weight:500;
                            >span {
                                color: #F09F88;
                                font-size: rem(10);
                                margin-left: rem(10);
                                img {
                                    width: rem(11);
                                    margin-right: rem(1);
                                    vertical-align: middle;
                                    
                                }
                            }
                        }
                        .soldOut {
                            font-size: rem(11);
                            color: #808080;
                            padding-top: rem(7);
                        }
                    }
               
            }
            .btn_more {
                >button {
                    height: rem(25);
                    border-radius: rem(5);
                    font-size: rem(13);
                    border:1px solid rgba(74,156,243,1);
                    color: #3196FF;
                    width:rem(42);
                    padding: 0;
                    background-color: #fff;
                }
            }
        }
            
             
            .order_list {
                width: 100%;
                margin-top: rem(10);
                #doc_dian {
                    display: -webkit-flex;
                    display: flex;
                        li {
                            width: 32%;
                            min-height: rem(108);
                            position: relative;
                            >img {
                                max-width: 100%;
                                display: block;
                                -webkit-border: 1px solid #eee;
                                border: 1px solid #eee;
                                @include borderRaduis(rem(4));
                            }
                            img[lazy-loaded] {
                                display: block;
                                width: 100%;
                                max-width: 100%;
                                -webkit-border: 1px solid #eee;
                                border: 1px solid #eee;
                                @include borderRaduis(rem(4));
                            }
                            img[lazy=loading] {
                                position: absolute;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                top: 0;
                                width: 0.4rem;
                                margin: auto;
                                -webkit-border: 0;
                                border:0;
                                background: url("../../common/images/lazy.gif") no-repeat;
                                background-size: cover;
                            }
                        }
                        li:nth-child(2) {
                            margin: 0 2%;
                        }
                }
               
            }
            
                .addbtn {
                    width: 100%;
                    height: rem(25);
                }
        }
    }

    }
}
</style>
