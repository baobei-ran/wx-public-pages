<template>
<!-- 待收货 -->
  <div class="take Mg-T">
    <h4>
        <span v-show="val.tpye == 1">{{ val.type_name }}医生的店铺</span> 
        <span v-show="val.tpye == 2">{{ val.type_name }}</span>
        <span v-text="val.tpye == 1?'待收货':'待取货'"></span></h4>
    <div class="order_list" @click='outdetails(val)'>
        <dl>
            <dt class="dis_f flex_i">
                <img v-for="(item, j) in val.img" :key='j+"_33"' :src="$http.baseURL+item" alt="" />
                <span v-show="val.picnum > 4" class="omit"></span>
            </dt>
            <dd>
                <span>￥{{ val.money }}</span>
                <p>共{{ val.allnum }}件商品</p>
                <b v-show="val.distribution == 2">门店自提</b>
            </dd>
        </dl>
    </div>
    <div class="addbtn" v-show="val.distribution == 1"><mt-button @click.native='buy(val)'>再次购买</mt-button><mt-button class="yes" @click.native='take(val)'>确认收货</mt-button></div>
</div>
</template>

<script>
export default {
 props: {
   val: {
     type: Object | null
   }
 },
  methods: {
    outdetails (val) {
      this.$emit('outdetails', val)
    },
    buy(val) {
      this.$emit('buy', val)
    },
    take (val) {
      this.$emit('take', val)
    }
  }
}
</script>

<style>

</style>