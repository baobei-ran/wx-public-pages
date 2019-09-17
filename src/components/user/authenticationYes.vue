
<template>
<!-- 问诊信息确认 -->
    <div class="login dis_f flex_d">
        
        <main class="content">
            <div class="content_box">
                <ul class="ul">
                    <li><span>问诊人员</span> <span>看好几家</span></li>
                    <li @click='setData'><span>健康数据</span> <span class="out" v-if='health'>去添加 </span>
                        <p v-if='!health'>及飒飒近段时间的开发商能 </p>
                        <img class="right" src="../../common/img/icon_enter.png" alt="">
                    </l>
                    <li><span>问诊人手机号</span> <span>525566989896</span></li>
                </ul>
                <div class="userMsg">
                    <div class="info">
                        <h4>疾病信息</h4>
                        <textarea name="" id="" @input='getLength' v-model='txt' maxlength="200" placeholder="请简要描叙病情"></textarea>
                        <span><i>{{ length }}</i>/200</span>
                    </div>
                    <div class="files">
                        <div class="files_img" v-for='(val,i) in imgList' :key='i'>
                            <img :src="val" alt="">
                            <i @click='del(i)'>X</i>
                        </div>
                         <div class="files_ip" v-if='imgList.length < 6'>
                             <img src="../../common/img/icon_tjtp.png" alt="">
                             <label for="upload_file">添加图片</label>
                             <input id="upload_file" type="file" class="file-input" accept="image/png,image/jpeg,image/jpg" multiple @change="inputChange" />
                         </div>
                    </div>
                </div>
            </div>
        </main>
        <div class="footer">
            <mt-button size="large" @click.native="handleClick" type="primary">提交</mt-button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui'
export default {
        data () {
            return {
                length: 0,        // 字数
                health: false,    //  健康数据 切换
                imgList: [],      // 图片预览图
                imgFiles: [],      // 上传的图片路径
                size: 6,           // 限制上传的图片
                txt: ''            // 获取文本内容
            }
        },
        methods: {
            inputChange (e) {    // 获取图片路径
                let files = e.target.files[0];
                this.imgFiles.push(files)
               this.imgList.push(window.URL.createObjectURL(files))

            },
            setData () {    // 去填写健康数据
                this.$router.push('/healthdata')
            },
            del (i) {   // 删除图片
                this.imgList.splice(i, 1);
                this.imgFiles.splice(i,1)
            },
            getLength () {  // 获取内容的数量
                this.length = this.txt.length
            },
            handleClick () {    // 提交
                
                Indicator.open({
                    text: '提交中...',
                    spinnerType: 'fading-circle',
                });
                setTimeout (() => {
                    Indicator.close();  // 关闭加载框
                }, 3000)
                if (!this.relation) {
                    Toast({
                        message: '请完善信息！',
                        duration: 2000
                    });
                    return false;
                } 
                if (!this.userName) {
                    Toast({
                        message: '请输入正确姓名！',
                        duration: 2000
                    });
                    return false;
                }
                if (!idcardReg.test(this.IDcard)) {
                    Toast({
                        message: '请输入正确的身份证！',
                        duration: 2000
                    });
                    return false;
                } 
            }
            
        }
}
</script>

<style lang='scss' scoped>
@function rem($px) {
  @return $px / 50 + rem;
}
.login {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    background-color: #F6F6F6;
   .content {
       -webkit-flex:1;
        flex: 1;
        overflow: auto;
        .content_box {
            .ul {
                background: #fff;
                padding: 0 rem(16);
                li {
                    display: flex;
                    justify-content: space-between;
                    padding: rem(20) 0;
                    font-size: rem(14);
                    color: #333;
                    border-top: 1px solid #EBEBEB;
                    position: relative;
                    span:last-child {
                        color: #808080;
                    }
                  
                    p {
                        width: 45%;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        padding-right: rem(5);color: #808080;
                    }
                    .right {
                        width: rem(25);
                        position: absolute;
                        right: rem(-9);
                        top: rem(15);
                    }
                }
            }
            .userMsg {
                width: 100%;
                margin-top: rem(5);
                background-color: #fff;
                
                .info {
                    padding: 0 rem(15);
                    border-bottom:1px solid #EBEBEB;
                    padding-bottom: rem(10);
                    h4 {
                        color: #333;
                        font-size: rem(14);
                        padding: rem(15) 0;
                    }
                    textarea {
                        width: 100%;
                        resize: none;
                        height: rem(50);
                        outline: none;
                        border:0;
                    }
                    span {
                        display: block;
                        text-align: right;
                        color: #808080;
                        font-size: rem(11);
                    }
                    
                }
            }

            .files {
                width: 100%;
                padding: rem(17) rem(15);
                -webkit-display: flex;
                display: flex;
                flex-wrap: wrap;
                .files_img  {
                     width: rem(75);
                    height: rem(75);
                    border:1px dashed #aaa;
                    font-size: rem(10);
                    text-align: center;
                    margin-right: rem(15);
                    margin-bottom: rem(15);
                    border-radius: rem(4);
                    position: relative;
                    img {
                        width: 100%;
                    }
                    >i {
                        position: absolute;
                        right: rem(-4);
                        top:rem(-3);
                        display: block;
                        width: rem(18);
                        height: rem(18);
                        border-radius: 50%;
                        background: #F45959;
                        color:#fff;
                        line-height: rem(18);
                        text-align: center;
                    }
                }
                .files_ip {
                    width: rem(75);
                    height: rem(75);
                    border:1px dashed #aaa;
                    font-size: rem(10);
                    text-align: center;
                    color: #808080;
                    position: relative;
                    img {
                        width: rem(27);
                        display: block;
                        margin: rem(10) auto;
                    }
                    >label {
                        display: block;
                        height: 100%;
                        position: absolute;
                        line-height: rem(75);
                        width: 100%;
                        padding-top: rem(10);
                        top:0;
                        left: 0;
                    }
                    input {
                        display: none;
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
           border-radius: 0;
       }
   }
    
}
</style>
