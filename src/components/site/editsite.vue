<template>
<!-- 编辑地址 -->
    <div class="editsitelist">
        <!-- <div class="header">
            <img @click='cancel' src="../../common/img/icon_fh.png" alt="">
            <span>编辑地址管理</span>
        </div> -->
        <div class="content">
            <div class="content_box">
                <mt-field label="收货人" placeholder="请输入用户名" v-model="username"></mt-field>
                <mt-field label="手机号码" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
                <div class="select dis_f dis_sb">
                    <span>所在地区</span>
                    <p @click='isShow'><span>{{ htmls }}</span> <span>{{ htmlh }}</span> <span>{{ htmlq }}</span></p>
                </div>
                <textarea name="" v-model='txt' class="txt" placeholder="详细地址"></textarea>
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
               <div class="switchs Del">
                   <span @click='delsite'>删除该地址</span>
               </div>
            </div>
        </div>
        <div class="footer dis_f" v-show="hidShow">
            <mt-button size="large" class="noce" @click.native='cancel'>取消</mt-button>
            <mt-button size="large" type="primary" :disabeld='disabel' @click.native='outShop'>确定</mt-button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Popup } from 'mint-ui';
import { Field } from 'mint-ui';
import { Picker } from 'mint-ui';
import { Switch } from 'mint-ui';
import { MessageBox } from 'mint-ui';
export default {
        data () {
            return {
                value: false,              // switch默认地址
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
                userId: '',         // 用户ID
                disabel: false,      // 按钮点击控制
                provinceBoll: true,   // 省
                citysBool: false,     // 市
                areasBool: false,      // 区
                docmHeight: document.documentElement.clientHeight, // 默认屏幕高度
                showHeight: document.documentElement.clientHeight, // 实时屏幕高度
                hidShow: true, // 显示或者隐藏footer
            }
        },
        updated () {
            
        },
        mounted() {
            this.getInfo()
            this.shengs()
            this.userId = this.$route.query.uid
             // window.resize监听页面高度的变化
            window.onresize = () => {
                return (() => {
                    this.showHeight = document.body.clientHeight
                })()
            }
        },
        watch: {
            showHeight: function () {
                if (this.docmHeight > this.showHeight) {
                    this.hidShow = false
                } else {
                    this.hidShow = true
                }
            },
        },
        methods: {
            getInfo () {    // 获取用户信息
                var _self = this;
                this.$http.post('/mobile/Wxuser/useraddress_edit_info', {id: this.$route.query.id}).then(res => {
                    console.log(res)
                    if(res.code == 1) {
                        _self.username = res.data.name
                        _self.phone = res.data.phone
                        _self.htmls = res.data.province_name
                        _self.htmlh = res.data.city_name
                        _self.htmlq = res.data.county_name
                        _self.txt = res.data.address
                        _self.htmlsId = res.data.province
                        _self.htmlhId = res.data.city
                        _self.htmlqId = res.data.county
                        if (res.data.status == 2) {
                            _self.value = true
                        } else {
                            _self.value = false
                        }
                    }
                })
            },
            outShop () {    // 地址编辑好了
                var _self = this;
                this.disabel = true;
                var time = setTimeout(() => {
                    _self.disabel = false
                    clearTimeout(time)
                })
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
                if (!_self.htmlsId && _self.htmlhId) {
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
                var obj = { uid: _self.userId, id: _self.$route.query.id, name: _self.username, phone:_self.phone, province: _self.htmlsId, city: _self.htmlhId, county: _self.htmlqId, address: _self.txt, status: a }
                this.$http.post('/mobile/Wxuser/useraddress_edit', obj).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        Toast({
                            message: '修改成功！！！',
                            duration: 1000
                        });
                        // var userSite = JSON.parse(_self.$cookie.get('userSite'))
                        var objs = { uid: _self.userId, id: _self.$route.query.id, name: _self.username, phone:_self.phone, 
                                    province: _self.htmls, city: _self.htmlh, county: _self.htmlq, address: _self.txt, status: a }
                        _self.$cookie.set('userSite', JSON.stringify(objs));
                        
                        setTimeout(function () {
                            _self.$router.back()
                        }, 1000)
                    } else {
                        Toast({
                            message: res.msg,
                            duration: 1000
                        });
                    }
                })
            },

            shengClick () {
                var _self = this;
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
            provinces (val) {   // 获取市
                console.log(val)
                this.sheng = val.aname
                this.shengId = val.aid;
                this.shi = ''
                this.shiId = ''
                this.qu = ''
                this.quId = ''
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
            citys(val) {    // 获取区
                this.shi = val.aname
                this.shiId = val.aid
                this.qu = ''
                this.quId = ''
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
                this.hidShow = true
            },
            sureMap () { // 省市确定
                this.show = false;
                this.show = false;
                this.htmls = this.sheng;
                this.htmlh = this.shi;
                this.htmlq = this.qu
                this.htmlsId = this.shengId
                this.htmlhId = this.shiId
                this.htmlqId = this.quId
                this.hidShow = true
            },
            isShow () {
                this.show = !this.show
                this.hidShow = false
            },
            delsite () {    // 删除该地址
                var _self = this;
                MessageBox.confirm('<p style="color:#333;">确定删除此条吗?</p>', '').then(action => {
                    _self.$http.post('/mobile/Wxuser/useraddress_del', _self.$route.query).then(res => {
                        console.log(res)
                        if (res.code == 1) {
                            Toast({
                                message: '删除成功！！！',
                                position: 'middle',
                                duration: 1000
                            });
                            var userSite = JSON.parse(_self.$cookie.get('userSite'))
                            if (userSite && userSite.uid == _self.userId && userSite.id == _self.$route.query.id) {
                                _self.$cookie.delete('userSite');
                            }
                           var time = setTimeout(function () {
                               clearTimeout(time)
                                _self.$router.back()
                           }, 1000)
                        } else {
                            Toast({
                                message: res.msg,
                                position: 'middle',
                                duration: 2000
                            });
                        }
                    })
                }).catch(cancel => {
                    console.log('取消了')
                })
                
            },
            cancel () { // 取消修改
                this.$router.back()
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
.editsitelist {
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
                font-size: rem(14);
            }
            .picker {
                width: 100%;
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
            .Del {
                color: #E93825;
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
