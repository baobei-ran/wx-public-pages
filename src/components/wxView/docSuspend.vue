<template>
    <!-- 医生停诊通知 -->
    <div class="docSuspend">
        <div class="section">
            <ul class="docMsg">
                <li>
                    <img :src="$http.baseURL+datalist.picture" alt="">
                    <dl>
                        <dt>
                            <span>{{ datalist.true_name }}</span>
                            <b>{{ datalist.gname }}丨{{ datalist.department_name }}</b>
                        </dt>
                        <dd>
                            {{ datalist.hospital_name }}
                        </dd>
                    </dl>
                </li>
            </ul>
            <ol class="doc_msg">
                <li><span>停诊时间</span><span>{{ doc_data.time }}</span></li>
                <li><span>停诊说明</span><span>{{ doc_data.cause }}</span></li>
                <li><span>停诊服务</span><span>{{ doc_data.arr }}</span></li>
            </ol>
        </div>
    </div>
</template>

<script>
export default {
    name: 'docSuspend',
    data () {
        return {
             datalist: {},
             doc_data: {
                did: '',
                uid: '',
                time: '',
                cause: '',
                arr: ''
             }
        }
    },
    mounted () {
        this.doc_data = this.$route.query;
        this.initdata()
    },
    methods: {
        initdata () {
            var obj = { did: this.doc_data.did , uid: this.doc_data.uid  }, self = this;
            this.$http.post('/mobile/wxdoccenter/doctor_detail', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.datalist = res.data
                }
            })
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
.docSuspend {
    width: 100%;
    height: 100%;
    background-color: #F4F4F4;
    .section {
        width: 100%;

    .docMsg {
        width: 100%;
        background:#FFF;
        border-radius:4px;
        li {
            padding: rem(11) rem(16);
            display: -webkit-flex;
            display: flex;
            -webkit-align-items: center;
            align-items: center;
            >img {
                display: block;
                width: rem(64);
                height: rem(64);
                -webkit-border-radius: 100%;
                border-radius: 100%;
                margin-top: rem(10);
            }
            >dl {
                vertical-align: middle;
                -webkit-box-flex: 1;              
                -moz-box-flex: 1;                 
                -webkit-flex: 1;                    
                -ms-flex: 1;  
                flex: 1;
                padding-left: rem(15);
                dt {
                    line-height: rem(17);
                    span {
                        margin-right: rem(5);
                        color:#333;
                        font-size: rem(17);
                    }
                    b {
                        color: #808080;
                        font-size: rem(14);
                    }
                }
                dd {
                    margin-top: rem(15);
                    font-size: rem(13);
                    color: #808080;
                }
            }
        }
    }
    .doc_msg {
            width: 100%;
            margin-top: rem(10);
            background-color: #fff;
            padding: rem(20) rem(16);
               > li {
                    margin-top: rem(20);
                    font-size: rem(14);
                    overflow: hidden;
                    span {
                        display: block;
                        float: left;
                        line-height: rem(21);
                    }
                    > span:first-child {
                        color: #808080;
                        width: 22%;
                    }
                    > span:last-child {
                        color: #333;
                        width: 76%;
                    }
                }
                li:first-child {
                    margin: 0;
                }
            }
    }
}
</style>
