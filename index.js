/**
 * Created by slashhuang on 16/10/27.
 * simple promise polyfill with then and catch funcionality
 * promise具备的基本特性
 * 1. 状态
 * Promise拥有pending + fulfilled + rejected三种状态
 * 2. 执行方式
 * Promise的状态变为fulfilled + rejected的时候，对应的队列中的处理函数将会执行
 *
 */
class Promise{
    constructor(executor){
         /* Promise的参数必须是function*/
        if(typeof executor != 'function'){
            throw new TypeError('Promise argument is not a  valid function');
        }
        /* Promise的状态集合 */
        this.PromiseState=['pending','fulfilled','reject'];
        /*存储异步执行回调队列，用pop、push来处理回调顺序*/
        this.callQueue = [];
        let _this = this;
        /*用来传递resolve的通信*/
        this.resolveNotifier=(val)=>{
        };
        /*用来传递reject的通信*/
        this.rejectNotifier=()=>{

        };
        /* 立即执行new Promise的参数函数executor*/
        executor.apply(this,[this.resolveNotifier,this.rejectNotifier]);
    }
    /* prototype 处理Promise的结构 */
    then(fn){

    }
    catch(){

    }
    /* 静态方法 处理Promise的逻辑 */
    static race(){

    }
    static all(){

    }
    static resolve(){

    }
    static reject(){

    }
}

let test1 = function(argument) {

}
new Promise(function(resolve,reject) {

}).then(()=>{

}).then(()=>{

})