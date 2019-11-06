<template>
    <!-- 星星评分 -->
    <div class="rate">
        <h2 style="font-size: 14px;text-align:center;margin: 20px 0;">星星评分</h2>
        <div class='scoreLayer' v-show="isShowScore" @click="hideScoreLayer($event)">
            <div class="center-box">
                <div class="star-box flex-between">
                    <ul class="star-list" @touchstart="touchStart" @touchmove="touchMove" ref="star">
                        <li class="star-item" v-for="i in scoreList" :class="{half: i.state == 1, full: i.state == 2}"></li>
                    </ul>
                    <p class="star-num">{{score}}分</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var _this = this
export default {
    data: _this => ({
        x0: 0,                      // 滑动初始点击位置
        len: 0,                     // 包裹星星的div的宽度
        score: 0,                   // 分数
        isShowScore: true,          // 是否显示弹框
        list: console.log(_this)    // 箭头函数 获取 vue 实例 
    }),
  computed: {
    scoreList () {
      // 用一个数组存储每个星星的状态，如果是满星就是2，半星就是1，没有就是0
      let i = 1
      let state
      const stateArr = []
      do {
        if (this.score >= 2 * i ) {
          state = 2
        } else if (this.score == 2 * i - 1) {
          state = 1
        } else {
          state = 0
        }
        stateArr.push({
          state
        })
        i++
      } while (i <= 5)
      return stateArr
    }
  },
  methods: {
    hideScoreLayer (evt) {
      if (typeof evt ==='symbol' || (evt && evt.target.classList.contains('scoreLayer'))) {
        this.isShowScore = false
        this.score = 0
      }
    },
    showScoreLayer () {
      this.isShowScore = true
    },
    touchStart (evt) {
      if (evt && evt.touches.length === 1) {
        this.len = this.$refs.star.offsetWidth
        this.x0 = evt.touches[0].clientX
      }
    },
    touchMove (evt) {
      this.score = 0
      if (evt) {
        let score = parseInt((evt.touches[0].clientX - this.x0)/this.len * 10)
        this.score = score > 10 ? 10 : score < 0? 0 : score
      }
    },
    submit () {   // 提交数据

    }
  }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px /100+rem;
}
.rate {
    width: 100%;
    // min-height: calc(100vh - 67px);
    .flex-between {
        display:flex;
        justify-content: space-between;
    }
  
.scoreLayer {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,.3);
}
  
  .center-box {
       padding-top: 0.4rem;
        padding-bottom: 0.4rem;
        width: 90%;
        background-color: #FFF;
        border-radius: 5px;
        box-shadow: 0 0 5px #ccc;
  }
   
    .star-box {
        padding: 0 0.2rem;
        align-items: center;
    }
      
    .star-item {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        margin: 0 5px;
        // background: url('./img/emptyStar.png') no-repeat center;
        background: #ccc;
        background-size: 0.5rem 0.5rem;
        &.half {
            // background: url('./img/halfStar.png') no-repeat center;
            background: red;
        }
            
        &.full {
            // background: url('./img/fullStar.png') no-repeat center;
            background: blue;
        }
    }
    p {
        font-size: 12px;
    }
}
</style>






<!-- 
<template>
只展示样式 
  <div class="Rating-gray">
    <i v-for="(item,index) in itemClasses" :key="index" class="fa" :class="item"></i>
  </div>
</template>
 
<script> 
// // 星星长度
// const LENGTH = 5;
// // 星星对应的class,亮星
// const CLS_ON = "fa-star";
// // 半星
// const CLS_HALF = "fa-star-half-empty";
// // 灰星
// const CLS_OFF = "fa-star-o";
 
// export default {
//   name: "Rating",
//   data () {
//       return {
//           rating: 2.5
//       }
//   },
//   computed: {
//     itemClasses() {
//       // 如4.8 四个全星 1个半星
//       let result = [];
//       // 对分数进行处理, 向下取0.5的倍数
//       let score = Math.floor(this.rating * 2) / 2;
//       // 控制半星
//       let hasDecimal = score % 1 !== 0;
//       // 全星
//       let integer = Math.floor(score);
//       // 全星放入到数组中
//       for (let i = 0; i < integer; i++) {
//         result.push(CLS_ON);
//       }
 
//       // 半星
//       if (hasDecimal) {
//         result.push(CLS_HALF);
//       }
 
//       // 补齐
//       while (result.length < LENGTH) {
//         result.push(CLS_OFF);
//       }
 
//       return result;
//     }
//   }
// };
// </script>
 
// <style scoped>
// .Rating-gray {
//   margin-right: 1.066667vw;
//   color: #ffbe00;
//   display: inline-block;
// }
// .fa {
//     display: inline-block;
//     width: 30px;
//     height: 30px;
//     border-radius: 50%;
    
// }
// .fa-star {
//     background: #ffbe00;
// }
// .fa-star-half-empty {
//     background: black;
// }
// .fa-star-o {
//     background-color: #ccc;
// }
// </style> -->