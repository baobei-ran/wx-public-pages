<template>
    <div class="userhome">
        user 首页

        <ul>
            <li>
                <a :href="'/wechat/personal?uid='+uid+''" >返回首页</a>
            </li>
            <li>
                <router-link to='/test'>测试页</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data () {
        return {
            url: '',
            uid: this.$cookie.get('userLogins')
        }
    },
    mounted () {
        this.url = this.$http.baseURL;
        console.log(this.$http)
    }
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px /100+rem;
}
.userhome {
    font-size: rem(28);
    text-align: center;
    ul {
        li {
            margin-top: rem(30);
        }
    }
}

a:link {
    color: #000;
}
a:visited { 
    color:red; 
} 
a:active {
    color: blue;
}
</style>