/**
 * Created by slashhuang on 16/10/27.
 * simple promise polyfill with then and catch funcionality
 */
class Promise{
    constructor(asyncFn){
        this.callQueue = []; //存储异步执行回调队列

        asyncFn();
        this.length=0;
         alert('init');
    }
    then(fn){
        this.callQueue.push(fn);
        return this
    }
    catch(){

    }
    compile(){

    }
}

let test1 = function(argument) {

}
new Promise(function(resolve,reject) {

}).then(()=>{

}).then(()=>{

})