<template>
    <!-- 添加病历-- 诊疗信息 -->
    <div class="addrecordsUserClinic dis_f flex_c">
        <div class="content-box flex1">
            <div class="contents">
                <div class="contents-header dis_f dis_sb bg-white">
                    <div class="dis_f contents-header-left">
                        <h2>{{ userInfo.name }}</h2>
                        <b>|</b>
                        <span v-text='userInfo.sex == 1?"男":"女"'></span>
                        <b>|</b>
                        <span>{{ userInfo.age }}</span>
                    </div>
                    <div class="contents-header-right">{{ userInfo.userinfo }}</div>
                </div>
                <div class="contents-progress bg-white">
                    <ul class="dis_f">
                        <li></li>
                        <li class="ul-right li-active"></li>
                    </ul>
                    <ol class="dis_f">
                        <li>健康信息</li>
                        <li>诊疗信息</li>
                    </ol>
                </div>
                <div class="add-info">
                    <ul class="bg-white">
                        <li class="dis_f">
                            <span>就诊时间</span>
                            <p @click='selectdete'><span v-text='!dateTime?"请选择就诊时间":dateTime'></span><img src="../../../common/img/icon_xzrq.png" alt="" /></p>
                        </li>
                        <li><span>就诊医院</span><input v-model="cure_hos" type="text" placeholder="请填写就诊医院"/></li>
                        <li><span>就诊科室</span><input v-model="cure_dep" type="text" placeholder="请填写就诊科室"/></li>
                        <li><span>就诊医生</span><input v-model="cure_doc" type="text" placeholder="请填写就诊医生姓名"/></li>
                        <li><span>诊断结果</span><textarea v-model="cure_result" placeholder="请填写诊断结果"></textarea></li>
                    </ul>
                </div>
                <div class="add-pic-box bg-white">
                    <h2>上传医嘱<span>（不超过4张）</span></h2>
                    <div class="add-pic">
                        <ul class="dis_f">
                            <li class="dis_f flex-vc flex-hc" v-for="(val,i) in filesbase64" :key='i+"_1"'><img :src="val.pic" alt="" /><img class="pic-cancel" @click='cancelPic(val.id)' src="../../../common/img/icon_sc2.png" alt=""></li>
                            <li class="upfile" v-if="filesbase64.length < 4"><input type="file" multiple accept="image/*" @change='clickAddPic($event)' id="files" /><label for="files"><img src="../../../common/img/pic_tjtp.png" alt="" /></label></li>
                        </ul>
                    </div>
                </div>
                <div class="add-pic-box bg-white">
                    <h2>上传处方<span>（不超过4张）</span></h2>
                    <div class="add-pic">
                        <ul class="dis_f">
                            <li class="dis_f flex-vc flex-hc" v-for="(val,i) in filesbase642" :key='i+"_2"'><img :src="val.pic" alt="" /><img class="pic-cancel" @click='cancelPic2(val.id)' src="../../../common/img/icon_sc2.png" alt=""></li>
                            <li class="upfile" v-if="filesbase642.length < 4"><input type="file" @change='clickAddPic2($event)' accept="image/*" id="files2" /><label for="files2"><img src="../../../common/img/pic_tjtp.png" alt="" /></label></li>
                        </ul>
                    </div>
                </div>
                <div class="add-pic-box bg-white">
                    <h2>上传检验单图片<span>（不超过4张）</span></h2>
                    <div class="add-pic">
                        <ul class="dis_f">
                            <li class="dis_f flex-vc flex-hc" v-for="(val,i) in filesbase643" :key='i+"_3"'><img :src="val.pic" alt="" /><img class="pic-cancel" @click='cancelPic3(val.id)' src="../../../common/img/icon_sc2.png" alt=""></li>
                            <li class="upfile" v-if="filesbase643.length < 4"><input type="file" @change='clickAddPics3($event)' accept="image/*" id="files3" /><label for="files3"><img src="../../../common/img/pic_tjtp.png" alt="" /></label></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer" v-show="hidShow">
            <mt-button :disabled='disabled' @click.native="handleClickSubmit">完成</mt-button>
        </div>
        <!-- 日期选择 -->
        <mt-datetime-picker
            ref="picker1"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            :startDate="startDate"
            @confirm="handleConfirm">
        </mt-datetime-picker>

    </div>
</template>

<script>
export default {
    data () {
        return {
            isModel: false,
            hidShow: true, // 底部按钮的控制
            docmHeight: document.documentElement.clientHeight, // 默认屏幕高度
            showHeight: document.documentElement.clientHeight, // 实时屏幕高度
            files: [],              // 上传医嘱的文本流
            filesbase64: [],        // 上传医嘱的展示
            files2: [],             // 上传处方的文本流
            filesbase642: [],       // 上传处方的展示
            files3: [],             // 上传检验单图片的文本流
            filesbase643: [],       // 上传检验单图片的展示
            startDate: new Date(),  // 默认当前日期
            dateTime: '',               // 就诊时间
            userInfo: {},            // 信息
            cure_time: '',  // 提交的日期
            cure_hos: '',   // 医院
            cure_dep: '',   // 科室
            cure_doc: '',   // 医生
            cure_result: '', // 诊断结果
            disabled: false,
            delPic1: [],
            delPic2: [],
            delPic3: [],
        }
    },
    mounted () {
        this.userInfo = this.$route.query;
        var self = this;
        window.onresize = () => {
            return (() => {
                this.showHeight = document.body.clientHeight
            })()
        }
        this.getUserInfo()
        // var value = new Date();
        // var year = value.getFullYear();
        // var month = value.getMonth() + 1;
        // var date = value.getDate();
        // this.dateTime = year+'年'+ month+'月'+date+'日';
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isiOS) {
            document.body.addEventListener('touchmove', function (e) {
                if(document.activeElement) {
                    document.activeElement.blur();
                }
                var node = document.activeElement; //当前focus的dom元素
                if (node) {
                    if (node.nodeName == "TEXTAREA" || node.nodeName == 'INPUT') { //如果是input或textarea
                        if (node.style.textShadow === '') {
                            node.style.textShadow = 'rgba(0,0,0,0) 0 0 0'; //改变某个不可见样式，触发dom重绘
                        } else {
                            node.style.textShadow = '';
                        }
                    }
                }
            }, {passive: false})
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
        getUserInfo () {
            var self = this;
            self.$http.post('/mobile/Wxemr/health_information', { cid: this.userInfo.cid }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    if (res.data.cure_time) {
                        self.handleConfirm(new Date(res.data.cure_time * 1000));
                    }
                    self.cure_hos = res.data.cure_hos?res.data.cure_hos:'';   // 医院
                    self.cure_dep = res.data.cure_dep? res.data.cure_dep: '';  // 科室
                    self.cure_doc = res.data.cure_doc? res.data.cure_doc: '';   // 医生
                    self.cure_result = res.data.cure_result? res.data.cure_result: '' // 诊断结果
                    
                    if (res.data.doc_record_pic) {
                        var yzPic = res.data.doc_record_pic.split(',');
                        yzPic.map(val => {
                            if (val) {
                                var ids = (Math.random())+'e';
                                var obt = { id: ids, pic: self.$http.baseURL+val, img: val }
                                self.filesbase64.push(obt)
                            }
                        })
                    }
                    if (res.data.recipe_pic) {
                        var cfPic = res.data.recipe_pic.split(',');
                        cfPic.map(val => {
                            if (val) {
                                var ids2 = (Math.random())+'l';
                                var obt2 = { id: ids2, pic: self.$http.baseURL+val, img: val }
                                self.filesbase642.push(obt2)
                            }
                        })
                    }
                    if (res.data.test_pic) {
                        var jydPic = res.data.test_pic.split(',')
                        jydPic.map(val => {
                            if (val) {
                                var ids3 = (Math.random())+'m';
                                var obt3 = { id: ids3, pic: self.$http.baseURL+val, img: val }
                                self.filesbase643.push(obt3)
                            }
                        })
                    }
                    
                }
            }).catch(err => console.log(err))
        },
        handleClickSubmit () { // 提交
            
            var self = this;
            this.$indicator.open({
                text: '提交中...',
                spinnerType: 'fading-circle'
            });
            this.disabled = true;
            var formData = new FormData();
            var arrImg = [], arrImg2 = [], arrImg3 = [];
            this.files.map(val => {
                arrImg.push(val.f)
                formData.append('pic1[]', val.f)
            })
            this.files2.map(val => {
                arrImg2.push(val.f)
                formData.append('pic2[]', val.f)
            })
            this.files3.map(val => {
                arrImg3.push(val.f)
                formData.append('pic3[]', val.f)
            })
            var delImg = '', delImg2 = '', delImg3 = '';
            if (this.delPic1.length > 0) {
                delImg = this.delPic1.join(',')
            }
            if (this.delPic2.length > 0) {
                delImg2 = this.delPic2.join(',')
            }
            if (this.delPic3.length > 0) {
                delImg3 = this.delPic3.join(',')
            }
            var upobj = { cid:this.userInfo.cid, cure_time: this. cure_time, cure_hos: this.cure_hos, cure_dep: this.cure_dep, cure_doc: 
                            this.cure_doc, cure_result: this.cure_result,pic1: arrImg, pic2: arrImg2, pic3: arrImg3, del1: delImg, del2: delImg2, del3: delImg3  }
            console.log(upobj)
            formData.append('cid',this.userInfo.cid)
            formData.append('cure_time', this.cure_time)
            formData.append('cure_hos', this.cure_hos)
            formData.append('cure_dep', this.cure_dep)
            formData.append('cure_doc', this.cure_doc)
            formData.append('cure_result', this.cure_result)
            formData.append('del1', delImg)
            formData.append('del2', delImg2)
            formData.append('del3', delImg3);
            self.$http.formdata('/mobile/Wxemr/add_information', formData).then(res => {
                console.log(res)
                if (res.code == 1 || res.code == 0) {
                    self.$indicator.close();
                    self.$toast({
                        message: '提交成功！',
                        position: 'middle',
                        duration: 2000
                    });
                    var t = setTimeout(() => {
                        self.$router.go(-1)
                        clearTimeout(t)
                    }, 1000)
                } else {
                    self.$indicator.close();
                    self.disabled = false
                    self.$toast({
                        message: res.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }).catch(err => { 
                self.disabled = false;
                self.$indicator.close();
                self.$toast({
                    message: '服务器错误，请重新上传！',
                    position: 'middle',
                    duration: 2000
                });
             console.log(err); })
        },
        clickAddPic (e) { // 医嘱上传
            var self = this;
            if (!window.FileReader) {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var id = (Math.random())+'y';
            var o = { id: id, f:files[0] }
            self.files.push(o);
            var reader = new FileReader();
            reader.onload = (e) => {
                self.getBase64(e.target.result).then(file => {
                    var obj1 = { id: id, pic: file }
                    self.filesbase64.push(obj1)
                })
            }
            reader.readAsDataURL(files[0])
            e.target.value = '';
        },
        cancelPic(id) {  // 医嘱删除
            var self = this;
            this.files = this.files.filter(val => {
                return val.id !== id
            })
            this.filesbase64.map(vl => {
                if (vl.id == id && vl.img) {
                    self.delPic1.push(vl.img)
                }
            })
            this.filesbase64 = this.filesbase64.filter(v => {
                return v.id !== id
            })
            
        },
        clickAddPic2 (e) { // 处方上传
            var self = this;
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var reader = new FileReader();
            var id2 = (Math.random())+'c';
            var o2 = { id: id2, f:files[0] }
            self.files2.push(o2);
            reader.onload = (e) => {
                self.getBase64(e.target.result).then(file => {
                    var obj2 = { id: id2, pic: file }
                    self.filesbase642.push(obj2)
                })
            }
            reader.readAsDataURL(files[0]);
            e.target.value = '';
        },
        cancelPic2 (id) {  // 处方删除
            var self = this;
            this.files2 = this.files2.filter(val => {
                return val.id !== id
            })
            this.filesbase642.map(vl => {
                if (vl.id == id && vl.img) {
                    self.delPic2.push(vl.img)
                }
            })
            this.filesbase642 = this.filesbase642.filter(v => {
                return v.id !== id
            })
        },
        clickAddPics3 (e) { // 检验单图片上传
            var self = this;
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var id3 = (Math.random())+'d';
            var reader = new FileReader();
            var o3 = { id: id3, f:files[0] }
            self.files3.push(o3);
            reader.onload = (e) => {
                self.getBase64(e.target.result).then(file => {
                    var obj3 = { id: id3, pic: file }
                    self.filesbase643.push(obj3)
                })
            }
            reader.readAsDataURL(files[0]);
            e.target.value = '';
        },
        cancelPic3 (id) {  // 检验单图片删除
            var self = this;
            this.files3 = this.files3.filter(val => {
                return val.id !== id
            })
            this.filesbase643.map(vl => {
                if (vl.id == id && vl.img) {
                    self.delPic3.push(vl.img)
                }
            })
            this.filesbase643 = this.filesbase643.filter(v => {
                return v.id !== id
            })
            
        },
        selectdete () { // 弹起日期选择
            this.$refs.picker1.open();
        },
        handleConfirm (value) {
            var year = value.getFullYear();
            var month = value.getMonth() + 1;
            var date = value.getDate();
            this.dateTime = year+'年'+ month+'月'+date+'日';
            this.cure_time = year+'-'+month+'-'+date
        },
         // 图片压缩并保存到files
        getBase64(url) {
            var self = this;
            var Img = new Image(),
                dataURL = '';
            Img.src = url;
            var p = new Promise(function (resolve, reject) {
                Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
                    var canvas = document.createElement("canvas"), //创建canvas元素
                        width = Img.width, //确保canvas的尺寸和图片一样
                        height = Img.height;
                    // 默认将长宽设置为图片的原始长宽，这样在长宽不超过最大长度时就不需要再处理
                    var ratio = width / height,
                        maxLength = 1000,
                        newHeight = height,
                        newWidth = width;
                    // 在长宽超过最大长度时，按图片长宽比例等比缩小
                    if (width > maxLength || height > maxLength) {
                        if (width > height) {
                            newWidth = maxLength;
                            newHeight = maxLength / ratio;
                        } else {
                            newWidth = maxLength * ratio;
                            newHeight = maxLength;
                        }
                    }
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    var ctx = canvas.getContext("2d");
                    ctx.fillStyle = "#fff"; // 改变canvas黑色的背景色
                    ctx.fillRect(0, 0, canvas.width, canvas.height);  
                    ctx.drawImage(Img, 0, 0, newWidth, newHeight); //将图片绘制到canvas中
                    dataURL = canvas.toDataURL('image/jpeg', 0.7); //转换图片为dataURL
                    resolve(dataURL);
                };
            });
            return p
        },
    },
    beforeDestroy () {
        this.$indicator.close();
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.addrecordsUserClinic {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    background-color: #f4f4f4;
    .content-box {
        width: 100%;
        overflow-y: scroll;
        // -webkit-overflow-scrolling: touch;
        .contents {
            width: 100%;
            margin-bottom: rem(20);
            .contents-header {
                width: 100%;
                padding: 0 rem(30);
                height: rem(98);
                line-height: rem(98);
                &-left {
                    color: #333;
                    b {
                        margin: 0 rem(10);
                        color: #aaa;
                        vertical-align: middle;
                    }
                }
                &-right {
                    width: 50%;
                    text-align: right;
                    color: #808080;
                }
            }
            .contents-progress {
                width: 100%;
                height: rem(140);
                margin-top: rem(20);
                ul {
                    width: 100%;
                    padding-top: rem(38);
                    position: relative;
                    li {
                        display: inline-block;
                        width: 50%;
                        height: 2px;
                        background-color: #469AF4;
                    }
                    li::after {
                        position: absolute;
                        left: 25%;
                        margin-top: rem(-8);
                        content: '';
                        display: block;
                        width: rem(20);
                        height: rem(20);
                        background-color: #469AF4;
                        -webkit-border-radius: 100%;
                        border-radius: 100%;
                    }
                    .ul-right::after {
                        left: 75%;
                    }
                    .li-active::after {
                        width: rem(42);
                        height: rem(42);
                        margin-top: rem(-20);
                        -webkit-transform: translateX(-50%);
                        transform: translateX(-50%);
                        background: url('../../../common/img/icon_xz.png') no-repeat;
                        background-size: cover;
                    }
                }
                ol {
                    margin-top: rem(30);
                    li {
                        width: 50%;
                        color: #333;
                        font-weight:600;
                        text-align: center;
                    }
                    li:first-child {
                        color: #808080;
                    }

                }
            }
            .add-info {
                width: 100%;
                > ul {
                    margin-top: rem(20);
                    padding: 0 rem(30);
                    li {
                        height: rem(98);
                        line-height: rem(98);
                        color: #333;
                        span {
                            display: inline-block;
                            width: 25%;
                        }
                        input {
                            width: 70%;
                            height: rem(40);
                            line-height: rem(40);
                            border:0;
                            font-size: rem(28);
                            color: #333;
                        }
                        textarea {
                            display: block;
                            width: 100%;
                            height: rem(120);
                            color: #333;
                            border:0;
                            background-color: #F9F9F9;
                            padding: rem(20);
                            resize: none;
                            font-size: rem(28);
                            line-height: rem(40);
                        }
                        > p {
                            span {
                                display: inline;
                                color: #808080;
                                vertical-align: middle;
                            }
                            img {
                                margin-left: rem(17);
                                width: rem(44);
                                vertical-align: middle;
                                margin-top: rem(-4);
                            }
                        }
                    }
                    li:last-child {
                        height: auto;
                        padding-bottom: rem(30);
                    }
                }
            }
            .add-pic-box {
                width: 100%;
                margin-top: rem(20);
                padding: rem(30);
                h2 {
                    color: #333;
                    span {
                        font-size: rem(24);
                        color: #808080;
                    }
                }
                .add-pic {
                    width: 100%;
                   > ul {
                        width: 100%;
                        margin-top: rem(30);
                        li {
                            width: rem(150);
                            height: rem(150);
                            position: relative;
                            margin-right: rem(30);
                            text-align: center;
                            line-height: rem(150);
                            border: 1px dashed #eee;
                            -webkit-border-radius: rem(8);
                            border-radius: rem(8);
                            img {
                                width: 100%;
                                height: 100%;
                            }
                            .pic-cancel {
                                position: absolute;
                                top: rem(-20);
                                right: rem(-20);
                                width: rem(44);
                                height: rem(44);
                            }
                            input {
                                display: none;
                            }
                            label {
                                display: block;
                            }
                        }
                        li:last-child {
                            margin: 0;
                        }
                        .upfile {
                            border: 0;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
    .footer {
        width: 100%;
        height: rem(98);
        button {
            width: 100%;
            height: rem(98);
            background-color: #469AF4;
            color: #fff;
            font-size: rem(32);
            -webkit-border-radius: 0;
            border-radius: 0;
        }
    }
}
</style>

