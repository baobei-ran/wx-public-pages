<template>
    <!-- 图片展示 -->
    <div class="Emotion">
        <div class="Emotion_box">
            <div>
                <ul>
                    <li v-for="(val, i) in icon_pic" :key='i' @click='handleIcon(val.type)'><img :src="icon_baseURL+val.pic" alt="" /></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            icon_baseURL: './assets/images/faces/',
            icon_pic: [
                { type: "[):]", pic: "ee_1.png"},
                { type:"[:D]", pic:"ee_2.png"},
                { type:"[;)]", pic:"ee_3.png"},
                { type:"[:-o]",pic: "ee_4.png"},
                { type:"[:p]", pic:"ee_5.png"},
                { type:"[(H)]", pic:"ee_6.png"},
                { type:"[:@]", pic:"ee_7.png"},
                { type:"[:s]", pic:"ee_8.png"},
                { type:"[:$]", pic:"ee_9.png"},
                { type:"[:(]", pic:"ee_10.png"},
                { type:"[:'(]",pic: "ee_11.png"},
                { type:"[:|]", pic:"ee_18.png"},
                { type:"[(a)]",pic: "ee_13.png"},
                { type:"[8o|]", pic:"ee_14.png"},
                { type:"[8-|]", pic:"ee_15.png"},
                { type:"[+o(]", pic:"ee_16.png"},
                { type:"[<o)]", pic:"ee_12.png"},
                { type:"[|-)]", pic:"ee_17.png"},
                { type:"[*-)]", pic:"ee_19.png"},
                { type:"[:-#]", pic:"ee_20.png"},
                { type:"[:-*]", pic:"ee_22.png"},
                { type:"[^o)]", pic:"ee_21.png"},
                { type:"[8-)]",pic: "ee_23.png"},
                { type:"[(|)]", pic:"ee_24.png"},
                { type:"[(u)]", pic:"ee_25.png"},
                { type:"[(S)]", pic:"ee_26.png"},
                { type:"[(*)]", pic:"ee_27.png"},
                { type:"[(#)]", pic:"ee_28.png"},
                { type:"[(R)]", pic:"ee_29.png"},
                { type:"[({)]", pic:"ee_30.png"},
                { type:"[(})]", pic:"ee_31.png"},
                { type:"[(k)]",pic: "ee_32.png"},
                { type:"[(F)]", pic:"ee_33.png"},
                { type:"[(W)]", pic:"ee_34.png"},
                { type:"[(D)]", pic:"ee_35.png"}
            ]
        }
    },
    methods: {
        handleIcon(type) {
            this.$emit('handleIcon', type)
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.Emotion {
    width: 100%;
    border-top: 1px solid #E6E6E6;
    &_box {
        width: 100%;
        >div {
            width: 100%;
            ul {
                overflow: hidden;
                padding: rem(10);
                li {
                    float: left;
                    margin: rem(15);
                    img {
                        width: rem(50);
                        height: rem(50);
                    }
                }
            }
        }
    }
}
</style>