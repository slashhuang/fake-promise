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
        /* 立即执行new Promise的参数函数executor,不对this进行任何指向*/
        executor(this.notifier('resolved'),this.notifier('rejected'));
    }
     /*用来传递resolve + reject的通信*/
    notifier(type){
        return (val)=>{
             this.promiseState={
                status:type,
                value:val||null
            };
            //同步的话顺序所有的值都已经一次执行完毕。===！处理异步情况
            if(this.callQueue.length>0){
                // 获取执行函数第一项触发结果
                let $1stFn = this.callQueue.shift();
                // 获取对应函数的键值名
                let keyName = type + 'Fn';
                let $fn = $1stFn[keyName];
                // 执行函数
                typeof $fn == 'function' && $fn(val);
            }
        }
    }
    /* prototype 处理Promise的结构。 then的每个状态都是个容器，相互独立 */
    then(resFn,rejFn){
        let {status,value} = this.promiseState;
        /*处理同步的情况*/
        switch(status){
            case 'resolved':
                resFn && resFn(value);
                break;
            case 'rejected':
                rejFn && rejFn(value);
                break;
            case 'pending':
                /*处理异步的情况*/
                this.callQueue.push({
                    resolvedFn:resFn||null,
                    rejectedFn:rejFn||null
                })
        };
       return this;
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

let test1  = new Promise((resolve,reject)=>{
    setTimeout(resolve,0,5);
})
.then((val)=>{
   alert(val);
})
.then((val)=>{
    alert(val+1)
})



