<template>
<!-- 添加地址 -->
    <div class="sitelist">
        <!-- <div class="header">
            <img @click='Return' src="../../common/img/icon_fh.png" alt="">
            <span>新增收货地址</span>
        </div> -->
        <div class="content flex1">
            <div class="content_box">
                <mt-field label="收货人" placeholder="请输入用户名" v-model="username"></mt-field>
                <mt-field label="手机号码" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
                <div class="select dis_f dis_sb">
                    <span>所在地区</span>
                    <p style="color: #ccc;" v-if='!htmls' @click='isShow'>请选择</p>
                    <p v-if='htmls' @click='isShow'><span>{{  htmls }} {{  htmlh }} {{  htmlq }}</span></p>
                </div>
                <textarea name="" class="txt" v-model='txt' placeholder="详细地址(示例：北京市海淀区清华大学学校内3楼门卫室)"></textarea>
                <div class="picker" style="width:100%;" v-show='show'>
                    <mt-popup style='width:100%;'
                    v-model='show' 
                    :closeOnClickModal='false'
                    position="bottom">
                        <div class="pop-btn dis_f">
                            <p @click="cancle">取消</p>
                            <p @click="sureMap">确定</p>
                        </div>
                        <div class="dis_f dis_sa zhanshi">
                            <p @click='shengClick'>{{ sheng }}</p>
                            <p @click='shiClick'>{{ shi }}</p>
                            <p>{{ qu }}</p>
                        </div>
                        <div class="selects" style="height: 300px;">
                            <ul v-show="provinceBoll">
                                <li v-for="val in province" :value="val.id" @click='provinces(val)'>{{ val.aname }}</li>
                            </ul>
                            <ul v-show="citysBool">
                                <li v-for="val in city" :value="val.id" @click='citys(val)'>{{ val.aname }}</li>
                            </ul>
                            <ul v-show="areasBool">
                                <li v-for="val in area" :value="val.id" @click='areas(val)'>{{ val.aname }}</li>
                            </ul>
                        </div>
                    </mt-popup>
                    
                </div>
               <div class="switchs dis_f dis_sb">
                   <span>设为默认地址</span>
                    <mt-switch v-model="value"></mt-switch>
               </div>
            </div>
        </div>
        <div class="footer dis_f" v-show="hiShow">
            <mt-button size="large" class="noce" @click.native='cancel'>取消</mt-button>
            <mt-button size="large" :disabled='disabled' type="primary" @click.native='outShop'>确定</mt-button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Popup } from 'mint-ui';
import { Field } from 'mint-ui';
import { Picker } from 'mint-ui';
import { Switch } from 'mint-ui';

export default {
 
        data () {
            return {
                value: true,              // switch默认地址
                show: false,           // 控制省市联动弹框
                username: '',          // 用户名
                phone: '',             // 手机 
                txt: '',                // 详细地址
                
                sheng: '',          // 选择暂存 省
                shi: '',            // 选择暂存  市
                qu: '',             // 选择暂存 区
                shengId: '',        // 选择暂存 省id
                shiId: '',          // 选择暂存  市id
                quId: '',           // 选择暂存 区id
                province: [],       // 省数据
                city: [],           // 市数据
                area: [],           // 区数据
                htmls: '',          // 确认后的省
                htmlh: '',          // 确认后的市
                htmlq: '',          // 确认后的区
                htmlsId: '',          // 确认后的省id
                htmlhId: '',          // 确认后的市id
                htmlqId: '',          // 确认后的区id
                provinceBoll: true,   // 省
                citysBool: false,     // 市
                areasBool: false,      // 区
                disabled: false,        // 按钮控制
                docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
                showHeight: document.documentElement.clientHeight,  //实时屏幕高度
                hiShow:true  //显示或者隐藏footer
            }
        },
       
        mounted () {
            this.shengs()
            var self = this;
            window.onresize = function () {
                return (function () {
                    self.showHeight = document.body.clientHeight
                })()
            }
        },
        watch: {
            showHeight: function () {
                if (this.docmHeight > this.showHeight) {
                    this.hiShow = false
                } else {
                    this.hiShow = true
                }
            },
        },
        methods: {
            shengClick () { 
                this.provinceBoll = true
                this.citysBool = false
                this.areasBool = false
                this.shi = ''
                this.shiId = ''
                this.qu = ''
                this.quId = ''
            },
            shiClick () {
                this.citysBool = true
                this.areasBool = false
                this.qu = ''
                this.quId = ''
            },
            provinces (val) {
                console.log(val)
                this.sheng = val.aname
                this.shengId = val.aid;
                 var _self = this;
                _self.$http.post('/mobile/Wxuser/area', {fid: val.aid}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        _self.city = res.data
                        _self.provinceBoll = false
                        _self.citysBool = true
                    }
                })
            },
            citys(val) {
                this.shi = val.aname
                this.shiId = val.aid
                var _self = this;
                _self.$http.post('/mobile/Wxuser/area', {fid: val.aid}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        _self.area = res.data
                        _self.citysBool = false
                        _self.areasBool = true
                    }
                })
            },
            areas(val) {
                this.qu = val.aname
                this.quId = val.aid
            },
            shengs () { // 获取省
                var _self = this;
                _self.$http.post('/mobile/Wxuser/area', {}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        _self.province = res.data
                    }
                })
            },
            
            cancle () { // 省市取消
                this.show = false;
                this.hidshow = true
            },
            sureMap () { // 省市确定
                this.show = false;
                this.htmls = this.sheng;
                this.htmlh = this.shi;
                this.htmlq = this.qu
                this.htmlsId = this.shengId
                this.htmlhId = this.shiId
                this.htmlqId = this.quId
                this.hidshow = true
            },
            isShow () { // 激活选城市弹框
                this.show = !this.show
                if (this.show) {
                    this.hidshow = false
                }
            },

             outShop () {    // 新增地址

                var _self = this;
                this.disabled = true;
                var t = setTimeout(function () {
                    _self.disabled = false;
                    clearTimeout(t)
                }, 3000)
                var isphone = /^1(3|4|5|6|7|8|9)\d{9}$/;//手机号验证
                if (!_self.username) {
                    Toast({
                        message: '请输入姓名',
                        duration: 1500
                    });
                    return;
                }
                if (!_self.phone || !isphone.test(_self.phone)) {
                    Toast({
                        message: '请输入正确手机号',
                        duration: 1500
                    });
                    return;
                }
                if (!_self.htmlsId || !_self.htmlhId || !_self.htmlqId) {
                    Toast({
                        message: '请选择地址',
                        duration: 1500
                    });
                    return;
                }
                if (!_self.txt) {
                    Toast({
                        message: '请输入详细地址',
                        duration: 1500
                    });
                    return;
                }
                var a;
                if (this.value) {
                    a = 2
                } else {
                    a = 1
                }
                var uid = _self.$route.query.uid
                var obj = { uid:uid, name: _self.username,phone:_self.phone, province: _self.htmlsId, city: _self.htmlhId, county: _self.htmlqId, address: _self.txt, status: a }
                _self.$http.post('/mobile/Wxuser/useraddress_add', obj).then(res => {
                    console.log(res)
                    if(res.code == 1) {
                        Toast({
                            message: '添加成功！！！',
                            duration: 1000
                        });
                        var userSite = JSON.parse(_self.$cookie.get('userSite'));
                        if (userSite) {
                            _self.$cookie.delete('userSite');
                        }
                        setTimeout(function () {
                            _self.$router.back()
                        }, 1000)
                    }
                }).catch(err => {console.log(err)})
            },
            Return () {
                this.$router.back()
            },
            cancel () { // 取消增加
               this.$router.back()
            }
        }
}
</script>

<style>
    .picker-item .picker-selected {
        font-size: 14px;
    }
</style>
<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.sitelist {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    background-color:#F6F6F6;
    display: -webkit-box; 
    display: -moz-box; 
    display: -webkit-flex; 
    display: -moz-flex; 
    display: -ms-flexbox; 
    display: flex;
    -webkit-box-orient:vertical;
    -webkit-box-direction:normal;
    -moz-box-orient:vertical;
    -moz-box-direction:normal;
    -webkit-flex-direction:column;
    flex-direction: column;
    .header {
        display: -webkit-box; 
        display: -moz-box; 
        display: -webkit-flex; 
        display: -moz-flex; 
        display: -ms-flexbox; 
        display: flex; 
        height: rem(40);
        -webkit-justify-content:center;
        -moz-box-pack:center;
        -webkit--moz-box-pack:center;
        box-pack:center;
        justify-content:center;
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
        .content_box {
            width: 100%;
            font-size: rem(14);
            color: #333;
            .select {
                width: 100%;
                height: rem(53);
                background: #fff;
                padding: 0 rem(10);
                font-size: rem(15);
                line-height: rem(53);
                overflow: hidden;
                > p {
                    width: 72%;
                    
                }
               
            }
            .txt {
                width: 100%;
                min-height: rem(48);
                resize: none;
                outline: none;
                padding: rem(15);
                line-height:rem(20);
                border:0;
                font-size: rem(13);
            }
            .picker {
                width: 100%;
                font-size: rem(14);
                z-index: 10000;
                .pop-btn {
                    width: 100%;
                    >p{
                        width: 50%;
                        text-align: center;
                        line-height: rem(40);
                        border-bottom: 1px solid #e6e6e6;
                        color: #4A9CF3;
                    }
                    >p:last-child {
                        border-left:1px solid #e6e6e6;
                        background: #4A9CF3;
                        color: #fff;
                    }
                }

                .zhanshi {
                    padding: rem(10) 0;
                }
                .selects {
                    overflow: auto;
                    ul {
                        li {
                            padding: rem(10);
                        }
                    }
                }
            }
            .switchs {
                margin-top: rem(5);
                width: 100%;
                height: rem(49);
                padding: rem(12) rem(15);
                background: #fff;
                line-height: rem(28);
            }

        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        display: -webkit-flex;
        display: flex;
        background-color: #fff;
        button {
            height: 100%;
            border-radius: 0;
            font-size: rem(17);
        }
        .noce {
            background: #fff;
            color: #4A9CF3;
        }
    }
}


</style>
