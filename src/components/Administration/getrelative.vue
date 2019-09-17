<template>
    <!-- 选择与本人的关系 -->
    <div class="getrelative">
        <ul>
            <li v-for='(val,i) in relations' :key='val.id' @click='pitchonClick(val)' :class='{"blue":val.id == v_success }'><span>{{ val.name }}</span> </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['types'],
    data () {
        return {
            relations: [],
            v_success: ''
        }
    },
    mounted () {
        this.initdata()
        console.log(this.type)
    },
    methods: {
        initdata: function () {
            var self = this;
            self.$http.post('/mobile/Wxpatient/type').then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.relations = res.data
                    self.v_success = self.types
                    res.data.map(v => {
                        if (v.id == self.types) {
                            self.pitchonClick(v)
                        }
                    })
                }
            })
        },
        pitchonClick: function (v) {
            this.v_success = v.id;
            v.hide = false
            console.log(v)
            this.$emit("childByValue", v)
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.getrelative {
    width: 100%;
    height: 100%;
    background-color: #fff;
    font-size: rem(14);
    > ul {
        width: 100%;
        li {
            font-size: rem(14);
            color: #333;
            padding: rem(12) 0;
            line-height: rem(22);
            overflow: hidden;
            cursor: pointer;
            text-align: center;
        }
        .blue {
            color: #3196FF;
            background: rgba(70,154,244, .1);
        }
    }
}
</style>

