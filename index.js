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
    constructor(asyncFn){
        this.callQueue = []; //存储异步执行回调队列

        asyncFn();
        this.length=0;
         alert('init');
    }
    /* prototype 处理Promise的结构 */
    then(fn){
        this.callQueue.push(fn);
        return this
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