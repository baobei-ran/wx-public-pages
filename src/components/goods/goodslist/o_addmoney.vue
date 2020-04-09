<template>
  <!-- 待付款 -->
  <div class="add Mg-T" >
    <h4>
        <span v-show="val.tpye == 1">{{ val.type_name }}医生的店铺</span> 
        <span v-show="val.tpye == 2">{{ val.type_name }}</span>
        <span>等待付款</span>
    </h4>
    <div class="order_list" @click='paydetail(val)'>
        <dl>
            <dt class="dis_f flex_i">
                <img v-for="(item, j) in val.img" :key='j+"_1"' :src="$http.baseURL+item" alt="">
                <span v-show="val.picnum > 4" class="omit"></span>
            </dt>
            <dd>
                <span>￥{{ val.money }}</span>
                <p>共{{ val.allnum }}件商品</p>
                <b v-show="val.distribution == 2">门店自提</b>
            </dd>
        </dl>
  </div>
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
    paydetail (val) {
      this.$emit('paydetail', val)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
