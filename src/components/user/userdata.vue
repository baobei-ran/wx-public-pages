<template>
    <div class="userdata">
        <div class="section">
            <ul>
                <li><span>头像</span><img ref="userImg" src="../../common/img/pic_txxq.png" alt="" /></li>
                <li><span>姓名</span><span>{{ userInfor.real_name }}</span></li>
                <li><span>身份证号</span><span>{{ userInfor.id_card }}</span></li>
                <li><span>手机号码</span><span>{{ userInfor.patient_phone }}</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            userInfor: {}
        }
    },
    mounted() {
        var self = this;
        var uid = this.$cookie.get('userLogins');
        this.$http.post('/mobile/wxauth/center', { uid: uid}).then(res => {
            console.log(res)
            if (res.code == 1) {
                res.data.id_card = res.data.id_card?res.data.id_card.substr(0, 6) + '****' + res.data.id_card.substr(14, res.data.id_card.length):'';
                var objData = res.data;
                self.userInfor = Object.freeze(objData);
                if (self.userInfor.pic) {
                    self.$refs.userImg.src = self.$http.baseURL + self.userInfor.pic
                }
            } else {
                self.userInfor = {}
            }
        })
    },
    methods: {
        Return () {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.userdata {
    width: 100%;
    height: 100%;
    font-size: rem(16);
    .section {
        width: 100%;
        background: #fff;
        padding-bottom: rem(5);
        ul {
            width: 100%;
            font-size: rem(14);
            li {
                width: 100%;
                padding: rem(20) rem(16);
                -webkit-display: flex;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #ebebeb;
                align-items: center;
                img {
                    width: rem(44);
                    height: rem(44);
                    border-radius: 50%;
                }
                span:last-child {
                    color: #666;
                }
            }
        }
    }
}
</style>

