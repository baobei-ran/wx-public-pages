
<!--评分-->
<template>
  <div class="rate">
    <div>
      <i v-for="(val, i) in getList" class="iconfont" :style="{ width: size>0?size+'px': '', height: size>0?size+'px': '' }" @click="setScore(i+1)" :class="val"></i>
    </div>
  </div>
</template>

<script>
  
  export default {
    props: {
      ints: {
        type: Number,
        default: 0,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      size: {
        type: [Number, String],
        default: 0,
      }
    },
    data() {
      return {
        score: 0,
        indexActive: null
      }
    },
    watch: {
      ints: function (val) {
          this.score = this.ints / 2;
      }
    },
    mounted () {
        this.score = this.ints / 2;
        console.log(this.size)
    },
    computed: {
        getList() {
            // 如4.8 四个全星 1个半星
          let result = [];
          // 对分数进行处理, 向下取0.5的倍数
          let score1 = Math.floor(this.score * 2) / 2;
          // 控制半星
          let hasDecimal = score1 % 1 !== 0;
          // 全星.
          let integer = Math.floor(score1);
          // 全星放入到数组中
          for (let i = 0; i < integer; i++) {
            result.push('icon-star');
          }
          // 半星
          if (hasDecimal) {
            result.push('icon-star-b');
          }
    
          // 补齐
          while (result.length < 5) {
            result.push('icon-star-o');
          }
          return result;
      },
    },
    methods: {
      setScore (i) { 
        if (this.disabled) {
            return;
        }
        if (this.indexActive == i) {
            this.indexActive = null
            this.score = i - 0.5;
        } else {
            this.indexActive = i
            this.score = i
        }
        this.$emit('changeScore', this.score)
      },
    }
  }
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px/100+rem;
}
.rate {
  width: 100%;
  font-size: rem(28);
  div >i {
    margin: 0 rem(10);
  }
  .iconfont {
    display: inline-block;
    width: rem(40);
    height: rem(40);
  }
  .icon-star {
    background: url('../../common/icon/icon_xxxz.png') no-repeat;
    background-size: cover;
  }
  .icon-star-o {
    background: url('../../common/icon/icon_xxwx.png') no-repeat;
    background-size: cover;
  }
  .icon-star-b {
    background: url('../../common/icon/icon_xxyb.png') no-repeat;
    background-size: cover;
  }
}
</style>



