<template>
    <!-- 问诊记录 -->
    <div class="userPayRecord dis_f flex_c">
        <div class="userPayRecord-content flex1">
           <div class="userPayRecord-content-box">
               <ul>
                    <li>
                       <span>问诊单号：</span>
                       <span>2131456578985431321</span>
                    </li>
                    <li>
                       <span>患者问诊时间：</span>
                       <span>2019-09-09 09:00</span>
                    </li>
                    <li>
                       <span>问诊状态：</span>
                       <span>已退诊 医生主动退诊</span>
                    </li>
                    <li>
                       <span>医生接诊时间：</span>
                       <span>2019-09-09 09:00</span>
                    </li>
                    <li>
                       <span>医生退诊时间：</span>
                       <span>2019-09-09 11:00</span>
                    </li>
               </ul>
               <ul class="Mg-T20">
                    <li>
                       <span>问诊用户：</span>
                       <span>小智障</span>
                    </li>
                    <li>
                       <span>就诊人：</span>
                       <span>豆豆 | 男 | 21</span>
                    </li>
                    <li>
                       <span>与本人关系：</span>
                       <span>配偶</span>
                    </li>
                    <li>
                       <span>支付金额：</span>
                       <span>21元</span>
                    </li>
               </ul>
           </div>
        </div>
        <div class="userPayRecord-footer">
            <van-button type="info">查看问诊记录</van-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'userPayRecordDetail',
    data () {
        return {

        }
    },
    mounted () {
        
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.userPayRecord {
    width: 100%;
    height: 100%;
    max-height: 100%;
    font-size: rem(28);
    background-color: #F4F4F4;
    .Mg-T20 {
        margin-top: rem(20);
    }
    &-content {
        width: 100%;
        overflow-y: scroll;
        &-box {
            width: 100%;
            ul {
                background-color: #fff;
                padding: rem(15) rem(30);
                li {
                    padding: rem(13);
                    color: #333;
                    font-size: rem(28);
                    span{
                        display: inline-block;
                        line-height: rem(40);
                    }
                    span:first-child {
                        color: #808080;
                        width: 34%;
                    }
                    span:last-child {
                        width: 65%;
                    }

                }
            }
        }
    }

    &-footer {
        width: 100%;
        background-color: #fff;
        button {
            width: 100%;
            height: rem(98);
            font-size: rem(32);
            background-color: #5189F6;
        }
    }

}


</style>