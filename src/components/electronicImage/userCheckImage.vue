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
            paths: '',
        }
    },
    mounted () {
        this.paths = JSON.parse(this.$cookie.get('_USER_IMAGE')) || 'http://wechat.client.pacsonline.cn/index_yyk.html#/reportInfo/report?license=c57f12f695585bacb79de89030beedf8&exam_id=116d6d59c62aff87&study_id=116d6d59c611fcca';
        console.log(this.paths)
    },
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