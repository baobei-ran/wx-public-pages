
<!--评分-->
<template>
  <div class="rate" :class="{'disabled':disabled}">
    <!-- <i v-for="i in 5" class="iconfont" @mouseenter="disabled?'':curScore=i" @mouseleave="disabled?'':curScore=''" @click="disabled?'':setScore(i)" :class="getClass(i)">
      <i v-if="disabled&&i==Math.floor(score)+1" class="iconfont icon-star" :style="'width:'+width"></i>
    </i> -->
     <!-- <span v-if="showText" class="text">{{curScore||score}}分</span> -->


    <div>
      <i v-for="(val, i) in getList" class="iconfont" @click="setScore(i+1)" :class="val"></i>
    </div>
    <span v-if="showText" class="text">{{score}}分</span>
  </div>
</template>

<script>
  
  export default {
    // props: {
    //   score: {
    //     type: Number,
    //     default: 0,
    //     //required: true
    //   },
    //   disabled: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   showText: {
    //     type: Boolean,
    //     default: false,
    //   },
    // },
    data() {
      return {
        curScore: '',
        width:'',
        score: 0,
        disabled: false,
        showText: true,
        indexActive: null
      }
    },
    created: function () {
      this.getDecimal();
    },
    mounted () {
      console.log('测试啊')
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
      // getClass(i) {
      //   if (this.curScore === '') {
      //     return i <= this.score ? 'icon-star' : 'icon-star-o'
      //   } else {
      //     return i <= this.curScore ? 'icon-star' : 'icon-star-o'
      //   }
      // },
      
      getDecimal() {
        this.width=Number(this.score * 100 - Math.floor(this.score) * 100)+'%';
      },
      setScore(i){
        if (this.indexActive == i) {
            this.indexActive = null
            this.score = i - 0.5;
        } else {
            this.indexActive = i
            this.score = i
        }
        // alert(i)
        // this.$emit('update:score',i);//使用`.sync`修饰符，对score 进行“双向绑定
      },
    }
  }
</script>
<style lang="scss" scoped>
.rate {
  width: 100%;
  font-size: 13px;
  padding: 20px;
  div >i {
    margin: 0 5px;
  }
  .iconfont {
    display: inline-block;
    width: 30px;
    height: 30px;
    // border-radius: 50%;
  }
  .icon-star {
    background: url('../../../common/icon/icon_xxxz.png') no-repeat;
    background-size: cover;
  }
  .icon-star-o {
    background: url('../../../common/icon/icon_xxwx.png') no-repeat;
    background-size: cover;
  }
  .icon-star-b {
    background: url('../../../common/icon/icon_xxyb.png') no-repeat;
    background-size: cover;
  }
}
</style>



