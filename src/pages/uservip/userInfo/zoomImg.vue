<template>
    <div class="test">
        <div class="test_box">
            <img :src="url" alt="" class="perImg" @click="getThumbBoundsFn('.perImg')" />
        </div>
        
        <div class="fiexd" ref='fiexd' >
            <img :src="url" ref='zoomPic' alt="" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'/>
        </div>
            
        
    </div>
</template>
<script>
export default {
    data () {
        return {
            url: 'http://hb.meizankj.com/static/upload/201909161568611810277.png',
            buffMove: 3, //缓冲系数
			buffScale: 2, //放大系数
            finger: false, //触摸手指的状态 false：单手指 true：多手指
            // 重置坐标数据
            distX : 0,
			distY : 0,
			newX : 0,
            newY: 0,
            // 获取遮罩的占位宽高
            wrapX: 0,
            wrapY: 0,
            // 获取图片的宽高
            mapX: 0,
            mapY: 0,

            width: 0,
            height: 0,

            basePageX: 0,
            basePageY: 0,

            moveX: 0,
            moveY: 0,

            imgNewX: 0,
            imgNewY: 0,

            // 获取图片的占位宽高
            imgBaseWidth: 0,
            imgBaseHeight: 0,
        }
    },
    mounted () {
       this.$nextTick(() => {
           var self = this;
            this.wrapX = this.$refs.fiexd.offsetWidth
            this.wrapY = this.$refs.fiexd.offsetHeight
            this.mapX = this.$refs.zoomPic.width
            this.mapY = this.$refs.zoomPic.height
            self.width  = self.mapX - self.wrapX;   //地图的宽度减去可视区域的宽度
            self.height = self.mapY - self.wrapY;   //地图的高度减去可视区域的高度
            
            self.imgBaseWidth  = this.$refs.zoomPic.offsetWidth;
            self.imgBaseHeight = this.$refs.zoomPic.offsetHeight;
            this.$refs.zoomPic.style.cssText = "margin-top:-"+(this.$refs.zoomPic.offsetHeight/2)+"px";
       })
    },
    methods: {
        
        getThumbBoundsFn: function(index) {

            // find thumbnail element
            var thumbnail = document.querySelector(index);

            // get window scroll Y
            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
            // optionally get horizontal scroll
            console.log(thumbnail)
            // get position of element relative to viewport
            var rect = thumbnail.getBoundingClientRect(); 

            // w = width
            console.log({x:rect.left, y:rect.top + pageYScroll, w:rect.width})
            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};


            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
        },

		getTouchDist: function(e){ // 获取多点触控
			var x1 = 0,
				y1 = 0,
				x2 = 0,
				y2 = 0,
				x3 = 0,
				y3 = 0,
				result = {};

			x1 = e.touches[0].pageX;
			x2 = e.touches[1].pageX;
			y1 = e.touches[0].pageY - document.body.scrollTop;
			y2 = e.touches[1].pageY - document.body.scrollTop;

			if(!x1 || !x2) return;

			if(x1<=x2){
				x3 = (x2-x1)/2+x1;
			}else{
				x3 = (x1-x2)/2+x2;
			}
			if(y1<=y2){
				y3 = (y2-y1)/2+y1;
			}else{
				y3 = (y1-y2)/2+y2;
			}

			result = {
				dist: Math.round(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))),
				x: Math.round(x3),
				y: Math.round(y3)
			};
			return result;
		},
        _changeData: function(){
			this.mapX     = this.$refs.zoomPic.offsetWidth; 	  //地图宽度
			this.mapY     = this.$refs.zoomPic.offsetHeight;      //地图高度
			// this.outDistY = (this.mapY - this.wrapY)/2; //当图片高度超过屏幕的高度时候。图片是垂直居中的，这时移动有个高度做为缓冲带
			this.width    = this.mapX - this.wrapX;   //地图的宽度减去可视区域的宽度
			this.height   = this.mapY - this.wrapY;   //地图的高度减去可视区域的高度
		},
        touchStart (e) {
            e.preventDefault;
            var self = this;
            var touchTarget = e.targetTouches.length; //获得触控点数
			self._changeData(); //重新初始化图片、可视区域数据，由于放大会产生新的计算

			if(touchTarget == 1){
				// 获取开始坐标
				self.basePageX = getPage(e, "pageX");
				self.basePageY = getPage(e, "pageY");

				self.finger = false;
			}else{
				self.finger = true;

				self.startFingerDist = self.getTouchDist(e).dist;
				self.startFingerX    = self.getTouchDist(e).x;
				self.startFingerY    = self.getTouchDist(e).y;
			}

			// console.log("pageX: "+getPage(e, "pageX"));
			// console.log("pageY: "+getPage(e, "pageY"));
            
        },
        touchMove (e) {
			var self = this;

			// e.preventDefault();
			// e.stopPropagation();
           
			// console.log("event.changedTouches[0].pageY: "+e.changedTouches[0].pageY);
			
			var touchTarget = e.targetTouches.length; //获得触控点数

			if(touchTarget == 1 && !self.finger){
                var pageX = getPage(e, "pageX"), //获取移动坐标
				    pageY = getPage(e, "pageY");
                console.log(pageX, pageY)
                // 获得移动距离
                self.distX = (pageX - self.basePageX) + self.newX;
                self.distY = (pageY - self.basePageY) + self.newY;
                console.log(self.distX, self.distY)
                if(self.distX > 0){
                    // self.moveX = Math.round(self.distX/self.buffMove); // left 弹性缓冲
                    self.moveX = 0
                    console.log( self.moveX)
                }else if( self.distX<=0 && self.distX>=-self.width ){
                    self.moveX = self.distX;
                    console.log( self.moveX)
                }else if(self.distX < -self.width ){
                    // self.moveX = -self.width+Math.round((self.distX+self.width)/self.buffMove); // right 弹性缓冲
                    self.moveX = -self.width
                    console.log( self.moveX)
                }

                if(self.height<0){
                    if(self.$refs.zoomPic.offsetWidth == self.imgBaseWidth){
                        self.moveY = Math.round(self.distY/self.buffMove);   // top 弹性缓冲
                        console.log( self.moveY)
                    }else{
                        var moveTop = Math.round((self.$refs.zoomPic.offsetHeight-self.imgBaseHeight)/2);
                        self.moveY = -moveTop + Math.round((self.distY + moveTop)/self.buffMove);
                        console.log( self.moveY)
                    }
                }else{
                    var a = Math.round((self.wrapY - self.imgBaseHeight)/2),
                        b = self.$refs.zoomPic.offsetHeight - self.wrapY + Math.round(self.wrapY - self.imgBaseHeight)/2;
                    console.log( a, b)
                    if(self.distY >= -a){
                        self.moveY = Math.round((self.distY + a)/self.buffMove) - a;
                        console.log( self.moveY)
                    }else if(self.distY <= -b){
                        self.moveY = Math.round((self.distY + b)/self.buffMove) - b;
                        console.log( self.moveY)
                    }else{
                        self.moveY = self.distY;
                        console.log( self.moveY)
                    }
                }
                    self.refresh(self.moveX, self.moveY, "0s", "ease");
                self.finger = false;
			}

			if(touchTarget>=2){
				self._zoom(e);
			}
        },
        // 执行图片移动
		refresh: function(x, y, timer, type){
			this.$refs.zoomPic.style.webkitTransitionProperty = "-webkit-transform";
			this.$refs.zoomPic.style.webkitTransitionDuration = timer;
			this.$refs.zoomPic.style.webkitTransitionTimingFunction = type;
			this.$refs.zoomPic.style.webkitTransform = getTranslate(x, y);
        },
        // 图片缩放
		_zoom: function(e){
			var self = this;
			var nowFingerDist = self.getTouchDist(e).dist, //获得当前长度
				ratio 		  = nowFingerDist / self.startFingerDist, //计算缩放比
				imgWidth  	  = Math.round(self.mapX * ratio), //计算图片宽度
				imgHeight 	  = Math.round(self.mapY * ratio); //计算图片高度

			// 计算图片新的坐标
			self.imgNewX = Math.round(self.startFingerX * ratio - self.startFingerX - self.newX * ratio);
			self.imgNewY = Math.round((self.startFingerY * ratio - self.startFingerY)/2 - self.newY * ratio);

			if(imgWidth >= self.imgBaseWidth){
				e.target.style.width = imgWidth + "px";
				self.refresh(-self.imgNewX, -self.imgNewY, "0s", "ease");
				self.finger = true;	
			}else{
				if(imgWidth < self.imgBaseWidth){
					e.target.style.width = self.imgBaseWidth + "px";
				}
			}

			self.finger = true;
		},
        touchEnd: function(e){
			var self = this;
			self._changeData(); //重新计算数据
			if(self.finger){
				self.distX = -self.imgNewX;
				self.distY = -self.imgNewY;
			}

			if( self.distX>0 ){
				self.newX = 0;
			}else if( self.distX<=0 && self.distX>=-self.width ){
				self.newX = self.distX;
				self.newY = self.distY;
			}else if( self.distX<-self.width ){
				self.newX = -self.width;
			}
			// 重置数据
	
			var hideTime = ".2s";
			if(self.height<0){
				self.newY = -Math.round(e.target.offsetHeight - self.imgBaseHeight)/2;
			}else{
				var a = Math.round((self.wrapY - self.imgBaseHeight)/2),
					b = e.target.offsetHeight - self.wrapY + Math.round(self.wrapY - self.imgBaseHeight)/2;

				if(self.distY >= -a){
					self.newY = -a;
				}else if(self.distY <= -b){
					self.newY = -b;
				}else{
					self.newY = self.distY;
				}
			}
            self.refresh(self.newX, self.newY, hideTime, "ease-in-out");
		},
    }
}
var support = {
        transform3d: ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()),
        touch: ("ontouchstart" in window)
    };
function getTranslate(x, y){
    var distX = x, distY = y;
    return support.transform3d ? "translate3d("+ distX +"px, "+ distY +"px, 0)" : "translate("+ distX +"px, "+ distY +"px)";
}

function getPage(event, page) {
    return support.touch ? event.changedTouches[0][page] : event[page];
}
</script>
<style lang="scss" scoped>
@function rem($px) {
    @return $px /100+rem;
}
.test {
    width: 100%;
    height: 100%;
    font-size: rem(28);
    padding: rem(30);
    .test_box {
        img {
            width: 100%;
        }
    }
    .fiexd {
        width: 100%;
        height: 100%;
        position:fixed;
        left:0;
        top:0;
        z-index: 1000;
        background:rgba(0,0,0,0.95);
        // display: none;
        img {
            width:100%;
            position:absolute;
            top:50%;
        }
    }

    }


</style>