<template>
    <!-- 图片 -->
    <div class="webPic">
        <ul>
            <li>
                <!-- 相机 -->
                <input @change="changeTakeApicture($event)" type="file" name="" capture multiple accept="image/*" id="filesPic"/>
                <label class="takeApicture" for="filesPic"></label>
                <p>相机</p>
            </li>
            <li>
                <!-- 照片 -->
                <input type="file" @change="changeApicture($event)" multiple id="filesP" /><label for="filesP"></label>
                <p>相册</p>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        changeTakeApicture (e) {
            var self = this;
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var input = document.getElementById('filesPic');  // 选择文件的input
            var obj = {input, files}
            this.$emit('changeTakeApicture', obj)
            e.target.value = '';
        },
        changeApicture (e) {
            var self = this;
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var input = document.getElementById('filesP');  // 选择文件的input
            var obj = {input, files}
            this.$emit('changeTakeApicture', obj)
            e.target.value = '';
        }
    }
}
</script>

<style lang="scss" scoped>
@function rem($px) {
    @return $px / 100+rem;
}
.webPic {
    width: 100%;
    border-top: 1px solid #E6E6E6;
    > ul {
        padding: rem(30) rem(30) rem(50);
        li {
            display: inline-block;
            padding: rem(30);
            label {
                display: inline-block;
                width: rem(118);
                height: rem(118);
                background: url('../../common/images/icon/btn_pais@2x.png') no-repeat;
                background-size: cover;
            }
            .takeApicture {
                background: url('../../common/images/icon/btn_xiangc@2x.png') no-repeat;
                background-size: cover;
            }
            input[type=file] {
                display: none;
            }
            >p {
                text-align: center;
                font-size: rem(24);
                color: #828282;
                margin-top: rem(15);
            }
        }
    }
}
</style>