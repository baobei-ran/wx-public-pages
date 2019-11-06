<template>
    <!-- 花钱购买的影像查看页 -->
    <div id='userImage'>
        <iframe scrolling="no" :src="paths" frameborder="0" id="contentIframe"></iframe>
    </div>
</template>
<script>
export default {
    data () {
        return {
            paths: ''
        }
    },
    mounted () {
        this.paths = this.$cookie.get('_USERIMAGE');
        console.log(this.paths)
    }
}
</script>
<style lang="scss" scoped>
 #userImage {
     width: 100%;
     height: 100%;
     min-height: 100%;
     overflow: hidden;
     iframe {
        width: 100%;
        height: 100%;
        border: 0;
     }
 }
</style>