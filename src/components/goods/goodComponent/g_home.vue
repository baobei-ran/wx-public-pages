<template>
  <div>              
    <!-- 待付款 -->
    <div class="order_content" v-for='(val,i) in alllist' :key='i' >
        <add-money @paydetail='paydetail' :val='val' v-if='val.status == 1'/>
        <!-- 待收货 -->
        <dai-tack @outdetails='outdetails' @buy='buy' @take='take' :val='val' v-if='val.status == 2 || val.status == 3 || val.status == 4'/>
         <!-- 已完成 -->
        <accomp-lish @outdetails='outdetails' @buy='buy' :val='val' v-if='val.status == 5'/>
        <!-- 已取消 -->
        <order-cancel @outdetails='outdetails' @buy='buy'  :val='val' v-if='val.status == 6' />
    </div>
  </div>
</template>

<script>
import AddMoney from '../goodslist/o_addmoney'
import DaiTack from '../goodslist/o_dtake'
import OrderCancel from '../goodslist/o_cancel'
import AccompLish from '../goodslist/o_accomplish'
export default {
  components: {
    AddMoney,
    DaiTack,
    OrderCancel,
    AccompLish
  },
  props: ['alllist'],
  methods: {
    paydetail(val) {    // 去支付就可以进入 待付款详情
        if (val.distribution == 1) {
            this.$router.push({ name: 'addorderdetail', params: { id: val.number }})
        } else {
            this.$router.push({ path: '/orderdetails', query: { id: val.number }}) // 药店自提详情
        }
        
    },
    outdetails (val) {    // 取消和已完成、待收货的查看详情
        if (val.distribution == 1) {
            this.$router.push({ path: '/successOrder', query: { id: val.number}})
        } else {
            this.$router.push({ path: '/orderdetails', query: { id: val.number }}) // 药店 自提详情
        }
        
    },
    del(val) { // 删除订单
        var self = this;
        MessageBox.confirm('删除后不可恢复，是否删除?', '').then(action => {
            var obj = { number: val.number, type: 1 }
            self.$http.post('/mobile/Wxorder/set_order', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    Toast({
                        message: '删除成功!',
                        position: 'center',
                        duration: 2000
                    });
                    self.initdata(self.page, self.type)
                } else {
                    Toast({
                        message: res.msg,
                        position: 'center',
                        duration: 2000
                    });
                }
            })
        }).catch(err => {
            console.log(err)
        })

    },
    buy (val) {   // 再次购买
        console.log(val)
        this.$router.push({ name: 'orderbuyagain', params: { id:val.number} })   
    },
    take(val) {  // 确认收货
        var self = this;
        MessageBox.confirm('<p style="color:#333;">确认收货吗?</p>', '').then(action => {
            var obj = { number: val.number, type: 3}
            self.$http.post('/mobile/Wxorder/set_order', obj).then(res => {
                console.log(res)
                if (res.code == 1) {
                    Toast({
                        message: '操作成功',
                        position: 'center',
                        duration: 2000
                    });
                    self.initdata (this.page, this.type)
                } else {
                    Toast({
                        message: res.msg,
                        position: 'center',
                        duration: 2000
                    });
                }
            })
        }).catch(err => {
            console.log(err)
        })
    },
  }
}
</script>

<style lang='scss'>
@import '../goodslist/listcommon.scss';
</style>