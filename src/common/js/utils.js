// 存储当前历史记录点,实现控制手机物理返回键的按钮事件
export const pushHistory = () => {
    var state = {
      title: '',
      url: ''
    }
    window.history.pushState(state, state.title, state.url)
  }


  // 组件中使用
  // import { pushHistory } from '../../common/js/utils';

  // mounted 中使用
  //    pushHistory()
    //   监听返回按钮事件进行操作
    //    window.addEventListener("popstate", function (e) {
    //         // location.href = '（此处为要跳转的制定路径）'
            
    //     }, false);


    // 兼容 IE, obj为要绑定事件的元素，ev为要绑定的事件，fn为绑定事件的函数
    function addEvent(obj,ev,fn) 
    {
        if(obj.addEventListener){
                obj.addEventListener(ev,fn,false);
        }else if(obj.attachEvent){
                obj[ev+fn] = function(){
                        fn.call(obj);
                }
                obj.attachEvent("on" + ev,obj[ev+fn]);
        }else {
                obj['on'+type]=fn;
        }
    }
    function removeEvent(obj,ev,fn)
    {
        if(obj.removeEventListener){
                obj.removeEventListener(ev,fn);
        }else if(obj.detachEvent){
                obj.detachEvent("on" + ev, obj[ev+fn]);
        } else {
                obj['on'+type]=null;
        }
    }