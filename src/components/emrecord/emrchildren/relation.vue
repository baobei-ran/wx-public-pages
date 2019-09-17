<template>
    <!-- 选择关系组件 -->
    <div class="relation">
        <h2>选择与本人关系</h2>
        <ul>
            <li v-for="(item,i) in userlist" :key='i' @click="getrelation(item)" :class="{'actives':item.id == userid}">{{ item.name }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            userid: 1,
            // userdata: [
            //     {id:1,name: '本人'},
            //     {id:2,name: '父母'},
            //     {id:3,name: '兄弟姐妹'},
            //     {id:4,name: '子女'},
            //     {id:5,name: '配偶'},
            //     {id:6,name: '其他'}
            // ]
            userlist: []
        }
    },
    mounted () {
        var self = this;
        this.$http.post('/mobile/doch5/patient_type', null).then(res => {
            // console.log(res)
            if (res.code == 1) {
                self.userlist = res.data
            }
        }).catch(err => {  console.log(err) })
    },
    methods: {
        getrelation(v) {
            this.userid = v.id
            v.box = false
            this.$emit('usermsg', v)
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.relation {
    width: 100%;
    h2 {
        height: rem(84);
        line-height: rem(84);
        padding: 0 rem(30);
        font-size: rem(26);
        color: #333;
        border-bottom: 1px solid #e6e6e6;
    }
    ul {
        padding: rem(20) 0;
        li {
            text-align: center;
            height: rem(70);
            line-height: rem(70);
            color:#808080;
        }
        .actives {
            background-color: #E5F5FF;
            color: #0097FF;
        }
    }
}
</style>

