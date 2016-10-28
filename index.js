/**
 * Created by slashhuang on 16/10/27.
 * simple promise polyfill with then and catch funcionality
 * Promise具备的基本特性
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
        this.promiseState={
            status:'pending',
            value:null
        };
         /* 异步情况下的Promise状态处理函数执行数组*/
        this.callQueue = [];
        let _this = this;
        /*用来传递resolve的通信*/
        this.resolveNotifier=(val)=>{
            this.promiseState={
                status:'resolved',
                value:val||null
            }
        };
        /*用来传递reject的通信*/
        this.rejectNotifier=(val)=>{
            this.promiseState={
                status:'rejected',
                value:val||null
            }
        };
        /* 立即执行new Promise的参数函数executor,不对this进行任何指向*/
        executor(this.resolveNotifier,this.rejectNotifier);
    }
    /* prototype 处理Promise的结构 */
    then(resFn,rejFn){
        let {status,value} = this.promiseState;
        /*处理同步的情况*/
        switch(status){
            case 'resolved':
                resFn && resFn(value);
                break;
            case 'rejected':
                resFn && rejFn(value);
                break;
            case 'pending':
                /*处理异步的情况*/
                this.callQueue.push({
                    resolved:resFn||null,
                    rejected:rejFn||null
                })
        };
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

let test1  = new Promise(function(resolve,reject) {
    resolve(5);
})
test1.then((val)=>{
    console.log(val);
    return new Promise((resolve,reject)=>{
        resolve(val+1)
    })
}).then((val)=>{console.log(val)})



