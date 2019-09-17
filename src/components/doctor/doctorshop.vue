<template>
    <!-- 医生店铺页 -->
    <div class="doctorshop dis_f flex_fc">
        <div v-wechat-title="doctor.true_name+'的店铺'"></div>
        <div class="section flex1">
            <div >
                <div class="list">
                    <ul>
                        <li>
                            <img ref='userImg' src="../../common/img/pic_wdys_ystx.png" alt="">
                            <dl>
                                <dt>
                                    <span>{{ doctor.true_name }}的店铺</span>
                                    <b class="short" v-if='index == 0'>距我最近</b>
                                    <i>{{ doctor.dis }}km</i>
                                </dt>
                                <dd>
                                    {{ doctor.gname }} | {{ doctor.department_name }}
                                </dd>
                            </dl>
                        </li>
                        <li class="list_c">{{ doctor.address }}</li>
                    </ul>
                    <div class="shop_box">
                        
                            <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" v-if='datalist.length'>
                                <li class="li" v-for='(val,i) in datalist' :key='i' @click='outDetail(val.id)'>
                                    <div>
                                        <img v-lazy="$http.baseURL+val.pic" alt="" />
                                    </div>
                                    <h4>{{ val.name }}</h4>
                                    <p><span class="price">￥<b>{{ val.price }}</b></span><span>已售{{ val.sales_volume }}件</span></p>
                                </li>
                                <div class="drop-up" v-if="dropup">—— 没有数据了 ——</div>
                            </ul>
                           
                        <ol class="ol" v-if='!datalist.length'>
                            <li class="empty2">
                                <span></span>
                                <p>暂无商品</p>
                            </li>
                        </ol>
                    </div>
                    <!-- <div class="more">
                        上划查看更多
                    </div> -->
                </div>
            </div>
             
            
        </div>
        <div style='width:100%;height: 200px; display:none;'  id="container"></div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            datalist: [],       // 数据
            doctor: {
                true_name: '医生'
            },
            lng: '116.297176',            // 经度
            lat: '39.825233',            // 纬度
            uid: this.$cookie.get('userLogins'),
            did: this.$route.params.id,
            page: 1,
            limit: 10,
            index: this.$route.params.index,                            // 医生下标
            busy: true,
            dropup: false
        }
    },
    beforeCreate () {
        this.$indicator.open({
            text: '',
            spinnerType: 'fading-circle'
        });
    },
    created () {
        
    },
    beforeDestroy () {
        this.$indicator.close();
    },
    mounted () {
        var _this = this;
        console.log(this.$route.params)
            
            var map, geolocation;
            //加载地图，调用浏览器定位服务   高德地图
            map = new AMap.Map('container', {
                resizeEnable: true
            });
            map.plugin('AMap.Geolocation', function() {
                geolocation = new AMap.Geolocation({
                　　　　enableHighAccuracy: true, //是否使用高精度定位，默认:true
                　　　　timeout: 2000000, //超过10秒后停止定位，默认：无穷大
                　　　　buttonPosition: 'RB'
                });
                geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', function onComplete(data) {
                    var getLongitude = data.position.getLng();
                    var getLatitude = data.position.getLat();
                    // alert(getLongitude+'---'+getLatitude+'我的天') //弹出获得的经纬度
                    _this.lng = getLongitude
                    _this.lat = getLatitude
                }); //返回定位信息
                AMap.event.addListener(geolocation, 'error', function onError(err) {  //返回定位出错信息
                    console.log(err)
             });
            });
        this.getLocations()
        this.doctordata()
    },
    methods: {
        getLocations() {
            const that = this;
            AMap.plugin("AMap.Geolocation", function() {
                var geolocation = new AMap.Geolocation({
                // 是否使用高精度定位，默认：true
                enableHighAccuracy: true,
                // 设置定位超时时间，默认：无穷大
                timeout: 100000,
                // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                buttonOffset: new AMap.Pixel(10, 20),
                //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                zoomToAccuracy: true,
                //  定位按钮的排放位置,  RB表示右下
                buttonPosition: "RB"
                });

                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, "complete", onComplete);
                AMap.event.addListener(geolocation, "error", onError);

                function onComplete(data) {
                // data是具体的定位信息
                console.log(data);
                    var latitude = data.position.getLat() // 纬度
                    var longitude = data.position.getLng() // 经度
                    console.log('latitude', latitude, 'longitude', longitude)
                    that.lng = longitude
                    that.lat = latitude
                }

                function onError(data) {
                // 定位出错
                console.log(data);
                // 失败之后调用这个方法，使用IP定位获取当前城市信息
                that.getLngLatLocation();
                }
            });
    },
    // IP定位获取当前城市信息
    getLngLatLocation() {
        var that = this;
      AMap.plugin("AMap.CitySearch", function() {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            console.log(result)
            var ar = result.rectangle.split(';')[0];
            var ar2 = ar.split(',')
            that.lng = ar2[0]
            that.lat = ar2[1]
        
          }
        });
      });
      
    },
        loadMore: function() {
            this.busy = true
            this.page += 1
            this.dianList()
        },
        outDetail (id) {  // 进入商品详情
        console.log(id)
            this.$router.push({ path: '/shopdetail', query: { id:id}})
        },
        doctordata () {
            var _self = this;
            var obj = { lng: _self.lng, lat: _self.lat, uid: this.uid, did:this.did  }
            console.log(obj)
            this.$http.post('/mobile/Wxdoccenter/doccenter', obj).then(res => {     // 医生店铺信息
                // console.log(res)
                this.$indicator.close();
                if (res.code == 1) {
                    _self.doctor = res.data
                    if (_self.doctor.picture) {
                        _self.$refs.userImg.src = _self.$http.baseURL + _self.doctor.picture
                    }
                }
            }).catch(err => {
                console.log(err)
            })
            _self.dianList()
        },
        dianList() {
            var _self = this;
            if (this.dropup) {
                return
            }
            var obj = {did: this.did , 
                page:this.page, num: this.limit}
            this.$http.post('/mobile/Wxdoccenter/docgoods', obj).then(res => {
                console.log(res)
                _self.busy = false
                if (res.code == 1) {
                    if (_self.page<=1) {
                        _self.datalist = res.data
                    } else if (_self.page>1) {
                        var s = res.data
                        _self.datalist = _self.datalist.concat(s)
                        if (_self.datalist.length == res.counts ) {
                            _self.dropup = true
                            _self.busy = true
                        }
                    }
                    
                } else {
                    if (_self.datalist.length > 9) {
                        _self.dropup = true
                    }
                    _self.busy = true
                }
            })
        }
    }
}
</script>

<style lang='scss'>
    .mint-indicator-mask {
        opacity: .3;
        background: #000;
    }
</style>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.doctorshop {
    width: 100%;
    height: 100%;
    display:-webkit-box;
    display:-webkit-flex; 
    display:-moz-box; 
    display:-ms-flexbox; 
    display:flex;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
    background: #FAFAFA;
    font-size: rem(14);
    .section {
        width: 100%;
        font-size: rem(14);
        overflow: auto;
        .list {
            width: 100%;
            font-size: rem(12);
            padding: 0 rem(15);
            >ul {
                padding: rem(15);
                width: 100%;
                background:rgba(255,255,255,1);
                box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.1);
                -webkit-border-radius: 4px;
                border-radius:4px;
                margin-top: rem(5);
                li:first-child {

                    display: -webkit-flex;
                    display: flex;
                    >img {
                        display: block;
                        width: rem(49);
                        height: rem(49);
                        -webkit-border-radius: 50%;
                        border-radius: 50%;
                    }
                    >dl {
                        flex: 1;
                        padding-left: rem(15);
                        dt {
                            line-height: rem(30);
                            span {
                                margin-right: rem(14);
                                color:#333;
                                font-size: rem(16);
                            }
                            .short {
                                color: #4A9CF3;
                                font-size: rem(12);
                                background: url('../../common/img/icon_mrk.png') no-repeat;
                                background-size: 100% 90%;
                                padding: rem(5);
                                z-index: 99;
                                font-size: rem(12);
                            }
                            >i {
                                font-size: rem(13);
                                color:#333;
                                float: right;
                            }
                        }
                        dd {
                            font-size: rem(12);
                            color: #333;
                            margin-top: rem(5);
                        }
                    }
                }
                .list_c {
                    margin-top: rem(10);
                    font-size: rem(12);
                    color: #666;
                    line-height: rem(17);
                    padding-top: rem(16);
                    border-top: 1px solid #e6e6e6;
                    background: url('../../common/img/icon_dz.png') no-repeat rem(5) rem(8);
                    background-size: 10%;
                    padding-left: rem(35);
                }
            }
        }
        .shop_box {
            width: 100%;
            margin-top: rem(6);
            .drop-up{
                width: 100%;
                height: rem(40);
                line-height:rem(40);
                text-align: center;
                font-size: rem(14);
                color:#CCC;
            }
            ul {
                width: 100%;
                display: -webkit-flex;
                display: flex;
                -webkit-flex-wrap: wrap;
                flex-wrap: wrap;
                .li {
                    width: 47%;
                    margin: rem(5);
                    box-shadow:0px 5px 10px 0px rgba(0, 0, 0, 0.1);
                    > div {
                        width: 100%;
                        > img {
                            width: 100%;
                            display: block;
                        }
                    }
                    
                    >h4 {
                        color: #333;
                        line-height: rem(20);
                        font-size: rem(14);
                        padding: rem(15);
                    }
                    >p {
                        padding: 0 rem(15) rem(15) rem(15);
                        color: #aaa;
                        .price {
                            color: #F09F88;
                            margin-right: rem(10);
                            >b {
                                font-size: rem(14);
                            }
                        }
                    }
                }
            }
            > .ol {
                width: 100%;
                height: rem(170);
                margin-top: rem(39);
                .empty2 {
                    width: 100%;
                    text-align: center;
                    > span {
                        width: rem(120);
                        height: rem(120);
                        display: block;
                        margin: 0 auto;
                        background: url('../../common/img/pic_zwsp.png') no-repeat;
                        background-size: cover;
                    }
                   > p {
                        margin-top: rem(20);
                        text-align: center;
                        color: #333;
                        font-size: rem(15);
                    }
                }
            }
        }

        .more {
            width: 100%;
            color: #666;
            font-size: rem(12);
            line-height: rem(35);
            text-align: center;
        }
    }
   
}
</style>
