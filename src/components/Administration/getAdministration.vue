<template>
    <!-- 就诊成员管理 -->
    <div class="administration dis_f flex_c">
        <div class="section flex1">
            <ul>
                <li v-for='(val,i) in dataList' :key='i'>
                    <span @click='setStronge(val)'>{{ val.real_name }}</span>
                    <span class="edits" v-if='val.type !==1' @click='editClixk(val)'>编辑</span>
                </li>
            </ul>
        </div>
        <div class="footer">
            <mt-button @click.native="addClick">添加成员</mt-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'getAdministration',
    data () {
        return {
            uid: this.$cookie.get('userLogins'),
            dataList: []
        }
    },
    activated() {
        this.initdata()
    },
    methods: {
        initdata () {
            var self = this;
            self.$http.post('/mobile/Wxpatient/index', { uid: this.uid}).then(res => {
                console.log(res)
                if (res.code == 1) {
                    self.dataList = res.data
                }
            })
        },
        addClick: function () {
            this.out('/administration/addmember')
        },
        editClixk: function (v) {
            this.$router.push({path: '/administration/editmember', query: { id: v.id, name: v.real_name, type: v.type, idcard: v.id_card }})
        },
        setStronge: function (v) {
            this.$cookie.set('administrationVal', JSON.stringify(v))
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 50 + rem;
}
.administration {
    width: 100%;
    height: 100%;
    font-size: rem(14);
    background: #fff;
    .section {
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        ul {
            width: 100%;
            padding-left: rem(16);
            li {
                width: 100%;
                height: rem(60);
                line-height: rem(60);
                overflow: hidden;
                border-bottom: 1px solid #E0E0E0;
               > span:first-child {
                    color:#212121;
                    display: block;
                    height: rem(44);
                    float: left;
                    width: 77%;
                }
               .edits {
                    float: right;
                    color: #469AF4;
                    border-left: 1px solid #E0E0E0;
                    padding: 0 rem(15);
                    text-align: center;
                    height: rem(20);
                    line-height: rem(20);
                    margin-top: rem(23);
                }
            }
        }
    }
    .footer {
        width: 100%;
        height: rem(49);
        button {
            width: 100%;
            height: 100%;
            background-color: #469AF4;
            color: #fff;
            font-size: rem(16);
            -webkit-border-radius: 0;
            border-radius: 0;
        }
    }
}
</style>

