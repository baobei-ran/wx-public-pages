<template>
    <!-- 添加成员 -->
    <div class="wrap">
        <div class="addmember dis_f flex_c">
            <div class="section flex1" >
                <div class="section_msg">
                    <div class="user">
                        <label class="label" for="">问诊人关系</label>
                        <span v-show="!relation" class="RightJT" @click='getRelative'>请选择 <i class="iconfont icon-youjiantou1"></i></span>
                        <span class="RightJT2" v-show='relation' @click='getRelative'>{{ relation }} <i class="iconfont icon-youjiantou1"></i></span>
                    </div>
                    <div class="user">
                        <label for="">姓名</label>
                        <input type="text" v-model='userName' maxlength="6" placeholder="请输入真实姓名" />
                    </div>
                    <div class="user">
                        <label for="">身份证号</label>
                        <input type="text" v-model='IDcard' maxlength="18" placeholder="请输入身份证号码" />
                    </div>
                </div>
                <div class="dels" v-if='type == 1 ? false : true'>
                    <mt-button @click.native="delClick">删除成员信息</mt-button>
                </div>
            </div>
            <div class="footer" v-show='hidshow'>
                <mt-button @click.native="preserveClick">保存</mt-button>
            </div>
        </div>
        <mt-popup style="width: 100%;"
            v-model="isGetrelative"
            position="bottom">
            <div class="absoloute" >
                <child-relative :types='type'  v-on:childByValue="childByValue" ></child-relative>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import Getrelative from './getrelative'
export default {
    name: 'addmember',
    components: {
        'child-relative': Getrelative
    },
    data () {
        return {
            name: 'addmember',
            relation: '',
            userName: '',
            IDcard: '',
            docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
            showHeight: document.documentElement.clientHeight,  //实时屏幕高度
            hidshow: true,  //显示或者隐藏footer
            isGetrelative: false,
            aid: '',
            type: '',   
        }
    },
    created () {
        console.log(this.$route.query)
        this.aid = this.$route.query.id
        this.type = this.$route.query.type
        this.userName = this.$route.query.name
        this.IDcard = this.$route.query.idcard
        if (this.type == 1) {
            this.hidshow = false
            this.relation = '本人'
        }
    },
    mounted() {
        // window.onresize监听页面高度的变化
        var self = this;
        window.onresize = function() {
            return( function (){
                self.showHeight = document.body.clientHeight;
            })()
        }
        
            
        
    },
    watch: {
        showHeight:function() {
            if(this.docmHeight > this.showHeight){
                this.hidshow=false
            }else{
                this.hidshow=true
            }
        }
    },
    methods: {
        preserveClick: function () {  // 保存
            var iscardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;   // 正则身份证
            var self= this;
            if (this.relation == '') {
                this.$toast({
                    message: '请选择问诊人关系',
                    position: 'middle',
                    duration: 3000
                })
                return;
            }
            if (this.userName == '') {
                this.$toast({
                    message: '请输入真实姓名',
                    position: 'middle',
                    duration: 3000
                })
                return;
            }
            if (this.IDcard == '' || !iscardReg.test(this.IDcard)) {
                this.$toast({
                    message: '请输入正确的身份证',
                    position: 'middle',
                    duration: 3000
                })
                return;
            }
            var obj = {id: this.aid, type: this.type,name: this.userName, idcard:this.IDcard };
            var jsonobj2 = {id: this.aid, type: this.type,real_name: this.userName, id_card:this.IDcard }
            console.log(obj)
            this.$http.post('/mobile/Wxpatient/edit_patient', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.$cookie.set('administrationVal', JSON.stringify(jsonobj2))
                    self.$toast({
                        message: '修改成功！',
                        position: 'middle',
                        duration: 2000
                    });
                    var time = setTimeout(function () {
                        self.$router.go(-1)
                        clearTimeout(time)
                    }, 1000)
                } else {
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            })
        },
        childByValue: function (v) {
            this.relation = v.name;
            this.type = v.id
            this.isGetrelative = v.hide
        },
        getRelative: function () {
            if(this.type == 1) {
                this.$toast({
                    message: '本人不可修改',
                    position: 'middle',
                    duration: 3000
                });
                return;
            }
            this.isGetrelative = true;
        },
        delClick: function () {  // 删除
            var self = this;
            this.$messagebox.confirm('<p style="color: #333;">删除后信息不可找回，确定删除吗？</p>', '').then(action => {
                self.$http.post('/mobile/Wxpatient/del_patient', { id: self.aid}).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        self.$toast({
                            message: '删除成功！',
                            position: 'middle',
                            duration: 2000
                        });
                        var Val = JSON.parse(this.$cookie.get('administrationVal'));
                        if (Val && Val.id == self.aid) {
                            this.$cookie.delete('administrationVal')
                        }
                        var time = setTimeout(function () {
                            self.$router.go(-1)
                            clearTimeout(time)
                        }, 1000)
                    } else {
                        self.$toast({
                            message: res.msg,
                            position: 'middle',
                            duration: 2000
                        });
                    }
                })
            }).catch(cancel => {

            })
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.wrap {
    width: 100%;
    height: 100%;
}
.addmember {
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: rem(14);
    .section {
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        .section_msg {
            width: 100%;
            margin-top: rem(10);
            .user {
                width: 100%;
                display: -webkit-flex;
                display: flex;
                margin-left: rem(16);
                -webkit-justify-content: space-between;
                justify-content: space-between;
                -webkit-align-items: center;
                align-items: center;
                border-bottom: 1px solid #E4E9F4;
                font-size: rem(14);
                padding:rem(18) rem(16) rem(18) 0;
                position: relative;
                .RightJT {
                    position: absolute;
                    right: rem(28);
                    color: #808080;
                    padding-left: 20%;
                }
                .RightJT2 {
                    position: absolute;
                    right: rem(28);
                    color: #333;
                    padding-left: 20%;
                    i {
                        color: #808080;
                    }
                }
                > select {
                    display: block;
                    height: 100%;
                    float: right;
                    outline: none;
                    border:0;
                    background-color: #fff;
                    color: #333;
                    appearance: none;
                    -moz-appearance: none;
                    -webkit-appearance: none;
                    text-align: center;
                    font-size: rem(14);
                    margin-right: rem(12);
                }
                label {
                    color: #808080;
                    display: block;
                    width: 25%;
                }
                input {
                    color: #333;
                    height: 100%;
                    width: 75%;
                    border:0;
                    text-align: right;
                    padding-right: rem(16);
                    font-size: rem(14);
                }
                
                input::-moz-placeholder {
                    font-size: rem(14);
                    color: #C7C7C7;
                    line-height: rem(20);
                    text-align: right;
                }

                input:-ms-input-placeholder {
                    font-size: rem(14);
                    color: #C7C7C7;
                    line-height: rem(20);
                    text-align: right;
                }

                input::-webkit-input-placeholder {
                    font-size: rem(14);
                    color: #C7C7C7;
                    line-height: rem(20);
                    text-align: right;
                }
            }
        }
        .dels {
            width: 100%;
            text-align: center;
            padding-top: rem(15);
            button {
                width: rem(180);
                height: rem(35);
                background-color: #FFF;
                color: #F09F88;
                border:1px solid #F09F88;
                font-size: rem(14);
            }
        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        button {
            width: 100%;
            height: 100%;
            background-color: #469AF4;
            color: #FFF;
            font-size: rem(16);
            -webkit-border-radius: 0;
            border-radius: 0;
        }
    }
    
}

.absolute {
    width: 100%;
    height: 100%;
}
</style>

