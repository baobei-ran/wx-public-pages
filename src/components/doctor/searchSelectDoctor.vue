<template>
    <!-- 查找更多医生 -->
    <div class="doctor dis_f flex_d">
        <div class="header_box">
            <div class="header_search dis_f flex_i dis_sb">
                <router-link :to='"/searchlist?lon="+lon+"&lat="+lat'>
                    <input class="search_txt flex1" type="search" placeholder="搜索医生、科室、疾病">
                    <!-- <label for="" @click='searchs'>搜索</label>  v-model="searchVal" @keyup.enter="searchs" -->
                </router-link>
            </div>
           <div class='selects'>
                <van-dropdown-menu>
                    <van-dropdown-item :title="cityVal.aname?cityVal.aname:'地区'" ref="item">
                        <div class="citys dis_f">
                            <ul>
                                <li v-for="val in provinceList" :key='val.aid' :class="{'sheng-active':province.aid == val.aid}" @click='handleSheng(val)'>
                                    <span>{{ val.aname }}</span>
                                    <img v-if='province.aid == val.aid' src="../../common/img/icon_xuanze.png" alt="" />
                                </li>
                            </ul>
                            <ul>
                                <li v-for="val in cityList" :key='val.aid'  :class="{'city-active': cityVal.aid == val.aid}" @click='handleCity(val)'>
                                    <span>{{ val.aname }}</span>
                                    <img v-if='cityVal.aid == val.aid' src="../../common/img/icon_xuanze.png" alt="" />
                                </li>
                            </ul>
                        </div>
                    </van-dropdown-item>
                    <van-dropdown-item :title='deskVal.name?deskVal.name:"科室"' ref='keshi'>
                        <div class="common-select">
                            <ul>
                                <li v-for="val in deskList" :key='val.id' @click='handleDesk(val)'  :class="{'sort-active':deskVal.id == val.id}">
                                    <span>{{ val.name }}</span>
                                    <img v-if='deskVal.id == val.id' src="../../common/img/icon_xuanze.png" alt="" />
                                </li>
                            </ul>
                        </div>
                    </van-dropdown-item>
                    <van-dropdown-item :title='sortVal.name?sortVal.name:"排序"' ref='sort'>
                        <div class="common-select">
                            <ul>
                                <li v-for='val in sortList' :key='val.id' @click='handleSort(val)' :class="{'sort-active':sortVal.id == val.id}">
                                    <span>{{ val.name }}</span>
                                    <img v-if='sortVal.id === val.id' src="../../common/img/icon_xuanze.png" alt="" />
                                </li>
                            </ul>
                        </div>
                    </van-dropdown-item>
                    <van-dropdown-item :title='typeVal.name?typeVal.name:"服务类型"' ref='serves'>
                        <div class="common-select">
                            <ul>
                                <li v-for='(val, i) in typeList' :key='i+"t"' @click='handleType(val)' :class="{'sort-active':typeVal.id == val.id}">
                                    <span>{{ val.name }}</span>
                                    <img v-if='typeVal.id == val.id' src="../../common/img/icon_xuanze.png" alt="" />
                                </li>
                            </ul>
                        </div>
                    </van-dropdown-item>
                </van-dropdown-menu>
           </div>
        </div>
        
    <div class="section flex1" ref='scroll' >
        <div class="section_box"  >
            <div class="kong" v-if='!datalist.length'>
                <img src="../../common/img/pic_zwys.png" alt="" />
                <p>无数据</p>
            </div>
        
            <div class="doctor_list" v-if='datalist.length'>
                <van-list  v-model="busy" :finished="finished" :finished-text="txtMsg"  @load="loadMore" >
                    <div class="list" v-for='(val,i) in datalist' :key='i' >
                        <ul @click='Clickdetail(val.did, i)'>
                            <li>
                                <span>
                                    <img :src="val.picture?$http.baseURL+val.picture:''" alt="" />
                                </span>
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
                            <li class="dw_r" v-if='false'></li>
                            <li class="beadeptat ">擅长：<span> {{ val.title }}</span></li>
                        </ul>
                        <dl class="dls dis_f flex_i dis_sb">
                            <dt>
                                处方数量 <span>{{ val.recount }}</span>
                            </dt>
                            <dt>
                                患者数量 <span>{{ val.fw_doc }}</span>
                            </dt>
                            <dd>
                                <span v-if='val.reversion_rate && val.reversion_rate !== 0'>平均回复时长<b>{{ val.reversion_rate }}</b></span> 
                            </dd>
                        </dl>
                    </div>
               </van-list>
            </div>
        </div>
            
    </div>
        <div style='width:100%;height: 200px; display:none;' id="aMap"></div>
    </div>
</template>

<script>
// 节流函数
// const delay = (function() {
//   var timer = 0;
//   return function(callback, ms) {
//     clearTimeout(timer);
//     timer = setTimeout(callback, ms);
//   };
// })();

export default {
    data () {
        return {
            Visible: false,
            searchVal: '',      // 搜索内容
            datalist: [],    // 数据列表
            num: 0,             // 面包屑
            page: 1,
            limit: 15,
            lon: '116.297176',  // 经度
            lat: '39.825233',    // 纬度
            loading: false,
            allLoaded: false,
            bottomStatus: '',
            dropDown: false,        // 下拉
            busy: false,
            timerId: '',            // 滚动时间
            finished: false,        // 无数据停止获取，给出提示
            txtMsg: '',
            provinceList: [],       // 省
            cityList: [],           // 市
            province: {aid: ''},           // 选中省
            cityVal: {aid: ''},            // 选中市
            sortVal: {id:'', name:''},              // 排序选中
            typeVal: {id:'', name:''},           // 服务类型选中
            sortList: [], // 排序
            typeList: [],   // 服务类型列表
            deskVal: {id: ''},    // 
            deskList: [],   // 科室数据
        }
    },
    
    //  watch: {
    // //watch title change
    //     searchVal() {
    //         delay(() => {
    //             this.searchs();
    //         }, 500);
    //     },
    // },
   
     created () {
        var urldata = this.$route.query
        if (urldata.uid) {
            this.$cookie.set('userLogins', urldata.uid, 365)
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
        }
            
         var self = this;
         var map, geolocation;
        //加载地图，调用浏览器定位服务   高德地图
        map = new AMap.Map('container', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
            　　　　enableHighAccuracy: true, //是否使用高精度定位，默认:true
            　　　　timeout: 20000, //超过10秒后停止定位，默认：无穷大
            　　　　buttonPosition: 'RB'
            });
            geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', function onComplete(data) {
                var getLongitude = data.position.getLng();
                var getLatitude = data.position.getLat();
                // alert(getLongitude+'---'+getLatitude+'我的天') //弹出获得的经纬度
                self.lon = getLongitude
                self.lat = getLatitude
            }); //返回定位信息
             AMap.event.addListener(geolocation, 'error', function onError(err) {  //返回定位出错信息
                    console.log(err)
             }); 
        });
    },
    mounted () {
       this.getProvince();
       this.getLikeData()
       this.initdata()
       this.getLocations();
    },
    activated () {
        this.$refs.scroll.scrollTop = this.$route.meta.y 
        var _this = this;
        this.$refs.scroll.addEventListener('scroll',_this.justifyPos,true );
        if (this.$route.meta.isRefresh) {
           this.searchVal = '';
           this.province = {aid:'', aname: ''};
           this.cityVal= {aid:'', aname: ''};
           this.deskVal = { id: '', name: ''};
           this.typeVal = { id: '', name: ''};
           this.sortVal = {id:'', name:''};
           this.$refs.scroll.scrollTop = this.$route.meta.y = 0;
           this.initdata()
        }
    },
    deactivated () {
        // 当组件销毁的时候，移除滚动行为监听, 清空定时器；
        // 该方法是绑定到 window 身上，即使跳转到其他组件，仍然会监听页面的滚动行为
        var _this = this;
        this.$refs.scroll.removeEventListener('scroll', _this.justifyPos, true)
        clearTimeout(this.timerId)
    },
    methods: {
        getProvince () {
            var self = this;
            this.$http.post('/mobile/wxuser/area', {fid:''}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.provinceList = res.data
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getCity (id) {
            var self = this;
            self.cityList = []
            this.$http.post('/mobile/wxuser/area', {fid:id}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.cityList = res.data
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getLikeData () {
            var self =this;
            this.$http.post('/mobile/doch5/LikeData', null).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.deskList = res.data1; // 科室
                    self.sortList = res.data2; // 排序
                    self.typeList = res.data3; // 服务类型
                }
            }).catch(err => {
                console.log(res)
            })
        },
        handleSheng(v) { // 省
            console.log(v)
            this.province = v
            this.getCity(v.aid)
            if (this.cityVal.aid) {
                this.cityVal = ''
            }
        },
        handleCity (v) { // 城市
            console.log(v)
            this.cityVal = v;
            if (this.page != 1) {
                this.page = 1
            }
            this.searchs()
            this.$refs.item.toggle();
        },
        handleDesk(v) {   // 科室
            this.deskVal = v;
            if (this.page != 1) {
                this.page = 1
            }
            this.searchs()
            this.$refs.keshi.toggle();
        },
        handleSort(v) {  // 排序
            this.sortVal = v;
            if (this.page != 1) {
                this.page = 1
            }
            this.searchs()
            this.$refs.sort.toggle();
        },
        handleType(v) { // 服务类型
            this.typeVal = v;
            if (this.page != 1) {
                this.page = 1
            }
            this.searchs()
            this.$refs.serves.toggle();
        },
       justifyPos (e) {         // 获取滚动的位置信息
                    // 节流；
            if (this.timerId) clearTimeout(this.timerId)
            this.timerId = setTimeout(() => {
                // 获取页面滚动距离之后设置给当前路由的 元信息
                // console.log(e.target.scrollTop)
                var _this = this;
                this.$route.meta.y = e.target.scrollTop
            }, 300)
        },
        
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
                    that.lon = longitude
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
            that.lon = ar2[0]
            that.lat = ar2[1]
          }
        });
      });
    },
        loadMore: function() {
            this.page += 1
            this.initdata()
        },
        searchs () {
            // 搜索
            // console.log(this.lon, this.lat)
            // this.$refs.scroll.scrollIntoView();
            // this.$refs.scroll.scrollTop = 0 // 搜索的时候滚动的top值为零
            var self = this;
            if (this.finished == true) {
                this.finished = false
            }
             var obj = {page: 1, num: 15, lon: this.lon,lat: this.lat,  name: this.searchVal, province: this.province.aid, city: this.cityVal.aid, depid: this.deskVal.id, bus: this.typeVal.id}
            console.log(obj)
            self.$http.post('/mobile/Wxorder/doc_more', obj).then(res => {
                console.log(res)
                    self.busy = false
                if (res.code == 1) {
                    if (self.sortVal.id == 2) {
                        res.data.sort(function (a, b) {
                            return b.ask_num - a.ask_num;
                        })
                    } else if (self.sortVal.id == 3) {
                        res.data.sort(function (a, b) {
                            if (a.reversion_rate) {
                                return a.reversion_rate - b.reversion_rate;
                            }
                        })
                    } else if (self.sortVal.id == 4) {
                        res.data.sort(function (a, b) {
                            return b.fw_doc - a.fw_doc;
                        })
                    }
                    self.datalist = res.data
                    self.filterTimers(self.datalist);
                    if (self.datalist.length == res.counts) {
                        if(self.datalist.length > 5) {
                          self.txtMsg = '没有更多数据了'
                        } else {
                            self.txtMsg = ''
                        }
                        this.finished = true
                    } else {
                        this.finished = false
                    }
                    this.$nextTick(() => {
                        this.$refs.scroll.scrollTop = 0
                        this.$refs.scroll.scrollIntoView();
                    })
                } else {
                   self.datalist = []
                   self.finished = true
                }
            })
        },
        initdata () {
            var self = this;
            var obj = {page: this.page, num: this.limit, lon: this.lon,lat: this.lat,  name: this.searchVal, province: this.province.aid, city: this.cityVal.aid, depid: this.deskVal.id, bus: this.typeVal.id}
                console.log(obj)
            self.$http.post('/mobile/Wxorder/doc_more', obj).then(res => {
                console.log(res)
                    self.busy = false
                if (res.code == 1) {
                   if (self.page <= 1) {
                        self.datalist = res.data
                   } else if (self.page > 1) {
                       var list = res.data
                      self.datalist = self.datalist.concat(list)
                        if (self.datalist.length == res.counts) {
                            this.busy = false
                            if (self.datalist.length > 5) {
                                self.txtMsg = '没有更多数据了'
                            } else {
                                self.txtMsg = ''
                            }
                            this.finished = true
                        } else {
                            this.finished = false
                        }
                   }
                   self.filterTimers(self.datalist);
                } else {
                    this.busy = false
                    if (self.datalist.length > 5) {
                       self.txtMsg = '没有更多数据了'
                    } else {
                        self.txtMsg = ''
                    }
                   this.finished = true
                   
                }
                
            })
        },
        Clickdetail (id, i) {                // 单机对应医生进入详情
            this.$router.push({path: '/doctordetail', query:{id : id, index: i}})
        },
        filterTimers (time) {   // 进行时间格式处理
            time.map(val => {
                if(!val.reversion_rate) {
                    return;
                }
                if (val.reversion_rate > 0) {
                    var nian = (val.reversion_rate / 60 / 60 / 24 / 30 / 365).toFixed(2)
                    if (nian > 1) {
                        val.reversion_rate = '<'+ nian + '年'
                        return;
                    }
                    var month = (val.reversion_rate / 60 / 60 / 24 / 30).toFixed(2)
                    if (month > 1) {
                        val.reversion_rate = '<'+ month + '月'
                        return;
                    }
                    var ri = (val.reversion_rate / 60 / 60 / 24).toFixed(2)
                    if (ri > 1) {
                        val.reversion_rate = '<'+ ri + '天'
                        return;
                    }
                    var tis = (val.reversion_rate / 60 / 60).toFixed(2)
                    
                    if (tis >= 1) {
                        val.reversion_rate = '<'+ tis + 'h'
                        return;
                    }
                    var ti = Math.round(val.reversion_rate / 60)
                    
                    if (ti>0) {
                        val.reversion_rate = '<'+ ti + 'min'
                    } else {
                        val.reversion_rate = '<' + val.reversion_rate + 's'
                    }
                } else {
                    val.reversion_rate = val.reversion_rate 
                }
                
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        console.log(to, from)
      if(from.fullPath == "/mydoctor") { 
          to.meta.isRefresh = true;
      } else {
          to.meta.isRefresh = false;
      }
      next();
    },
}
</script>

<style lang='scss' >
@function rem($px) {
    @return $px / 50 + rem;
}
  
            .mint-searchbar-core {
                font-size: rem(14);
                line-height: rem(28);
                height: rem(28);
            }
    .mint-searchbar-core::-webkit-input-placeholder {
                line-height: rem(20);
                font-size: rem(13);
                margin-bottom: rem(5);
        }
            
    .mint-searchbar-core:-moz-placeholder { 
        font-size: rem(13);
        line-height: rem(20);
        margin-bottom: rem(5);
    }
    .mint-searchbar-core::-moz-placeholder { 
        font-size: rem(13);
        line-height: rem(20);
        margin-bottom: rem(5);
    }
    .mint-searchbar-core:-ms-input-placeholder {
        font-size: rem(13);
        line-height: rem(20);
        margin-bottom: rem(5);
    }
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
    .header_box {
        width: 100%;
    .header_search {
        width: 100%;
        padding: rem(15);
        a {
            display: block;
            width: 100%;
        }
        .search_txt {
            width: 100%;
            height: rem(30);
            -webkit-appearance:none;
            -webkit-border-radius: rem(20);
            -moz-border-radius:rem(20);
            -ms-border-radius:rem(20);
            -o-border-radius:rem(20);
            border-radius: rem(20);
            border:1px solid #f5f6f6;
            background: #F5F6F6 url('../../common/img/icon_ss.png') no-repeat left center;
            background-size: 7%;
            color: #333;
            padding: 0 rem(35);
            background-position: rem(8) rem(3);
            font-size: rem(14);
        }
        

        >label {
            margin-left: rem(13);
            display: block;
            font-size: rem(14);
            color: #666;
        }
        .mint-search {
        height: rem(46);
            .mint-searchbar {
                height: 100%;
                padding: rem(8) rem(10);
                .mint-searchbar-inner {
                    height: 100%;
                    padding: 0 !important;
                }
            }
            input[type=search]::-webkit-input-placeholder {
                line-height: rem(28);
                color: #808080;
            }
            
            input[type=search]:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                color: #808080;
                line-height: rem(28);
            }
            input[type=search]::-moz-placeholder { /* Mozilla Firefox 19+ */
                color: #808080;
                line-height: rem(28);
            }
            input[type=search]:-ms-input-placeholder { /* Internet Explorer 10-11 */
                color: #808080;
                line-height: rem(28);
            }
            .mint-searchbar-core {
                font-size: rem(14);
            }
        }
    }
    .selects {
        width: 100%;
        padding: 0 rem(10);
        font-size: rem(15);
        .citys {
            width: 100%;
            padding: rem(10) 0;
            ul {
                width: 50%;
                max-height: rem(400);
                overflow-y:scroll;
                li {
                    height: rem(30);
                    line-height: rem(30);
                    font-size: rem(14);
                    padding-left: rem(20);
                }
                .sheng-active {
                    color: #4A9CF3;
                    background-color: #EDF5FE;
                    img {
                        width: rem(22);
                        vertical-align: middle;
                        margin-left: rem(20);
                    }
                }
                .city-active {
                    color: #4A9CF3;
                    background-color: #EDF5FE;
                    img {
                        width: rem(22);
                        vertical-align: middle;
                        margin-left: rem(16);
                    }
                }
            }
            ul:last-child {
                max-height: rem(400);
                overflow-y:scroll;
                -webkit-overflow-scrolling: touch;
                li{
                    padding-left: rem(4);
                }
            }
        }
    }
    .common-select {
        width: 100%;
        max-height: rem(400);
        overflow-y:scroll;
        -webkit-overflow-scrolling: touch;
        >ul {
            width: 100%;
            padding: rem(10) 0;
            li {
                padding: 0 rem(20);
                height: rem(30);
                line-height: rem(30);
                font-size: rem(14);
                > img {
                    width: rem(22);
                    vertical-align: middle;
                    margin-left: rem(22);
                }
            }
            .off-active {
                color: #4A9CF3;
                background-color: #EDF5FE;
            }
            .sort-active {
                color: #4A9CF3;
                background-color: #EDF5FE;
            }
        }
    }
    .sortList {
        width: 100%;
        height: rem(44);
        padding: 0 rem(20);
        position: relative;
        ul {
            
            li {
                line-height: rem(44);
                >img {
                    width: rem(15);
                    vertical-align: middle;
                }
            }
            .action {
                color: #4A9CF3;
            }
        } 
        .tabnum {
            width: 100%;
            height: 100%;
            position: absolute;
            top: rem(44);
            left: 0;
            box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            display: -moz-box;
            display:-webkit-flex; 
            display: -ms-flexbox;
                
            -moz-box-orient: vertical;
            -webkit-flex-direction:column;
            -ms-flex-direction:column;
            .tablist {
                height: rem(28*3);
                p {
                    width: 100%;
                    background: #fff;
                    text-align: center;
                    padding: rem(7.5);
                    line-height: rem(28);
                }
            }
            
            >div:last-child {
                width: 100%;
                height: 64.5vh;
                -moz-box-flex: 1;
                -webkit-flex:1;
                -ms-flex:1;
                flex:1;
                background:rgba(0, 0, 0, 0.4);
            }
        }
        .show {
            display: block;
        }
    }

}


    
    .section {
        width: 100%;
        font-size: rem(14);
        overflow: auto;
        padding-top: rem(10);
        position: relative;
        
            
        .section_box {
            
            &::-webkit-scrollbar { 
                background-color: transparent;
            }
            .drop-up{
                width: 100%;
                height: rem(40);
                line-height:rem(40);
                text-align: center;
                font-size: rem(14);
                color:#CCC;
            }
        .kong {
            text-align: center;
            padding: rem(61) 0;
            img {
                width: rem(125);
                display: block;
                margin: 0 auto;
            }
            >p {
                text-align: center;
                color: #808080;
                margin-top: rem(26);
            }
        }
        .doctor_list {
            width: 100%;
            font-size: rem(12);
            padding: 0 rem(15);
            
          .list {
                width: 100%;
                border-radius:4px;
                box-shadow:0px 2px 5px 0px rgba(0, 0, 0, 0.1);
                margin-top: rem(10);
            >ul {
                width: 100%;
                padding: rem(15);
                background:rgba(255,255,255,1);
                border-bottom: 1px solid #E6E6E6;
                position: relative;
                .beadeptat {
                    padding-top: rem(10);
                }
                li:first-child {
                    display: -webkit-flex;
                    display: flex;
                    > span {
                        display: block;
                        width: rem(50);
                        height: rem(50);
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                        overflow: hidden;
                        img {
                            width: auto;
                            min-height: 100%;
                        }
                    }
                    >img {
                        display: block;
                        width: rem(49);
                        height: rem(49);
                        border-radius: 100%;
                    }
                    >dl {
                        flex: 1;
                        padding-left: rem(15);
                        dt {
                            line-height: rem(30);
                            span {
                                margin-right: rem(8);
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
                .juli {
                    position: absolute;
                    right: rem(10);
                    top: rem(25);
                }
                .dw_r {
                    position: absolute;
                    right: 0;
                    top: rem(17);
                    width: rem(60);
                    height: rem(19);
                    line-height: rem(19);
                    text-align: center;
                    color: #fff;
                    font-size: rem(12);
                    padding-top: rem(1);
                    z-index: 99;
                    background: url('../../common/img/bq_jwzj.png') no-repeat 0;
                    background-size: cover;
                }
                li:last-child {
                    margin-top: rem(10);
                    font-size: rem(12);
                    color: #808080;
                    line-height: rem(18);
                }
            }
            .dls {
                width: 100%;
                padding: 0 rem(15);
                height: rem(41);
                font-size: rem(12);
                dt {
                    color: #333;
                    >span {
                        color: #4A9CF3;
                    }
                }
                dd {
                    color: #333;
                    min-width: rem(80);
                    > span {
                        b {
                            color: #F09F88;
                        }
                    }
                }
            }
          }
        }
    }
    }
    
}
</style>
