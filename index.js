/**
 * Created by slashhuang on 16/10/27.
 * simple promise polyfill with then and catch funcionality
 * Promise具备的基本特性
 * 1. 状态
 * Promise拥有pending + fulfilled + rejected三种状态
 * 2. 执行方式
 * Promise的状态变为fulfilled + rejected的时候，对应的队列中的处理函数将会执行

 * 单一状态都会不断的寻找处理函数，直到能够被处理,并且一个状态只能被处理一次
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
        /* 立即执行new Promise的参数函数executor,如果没有调用notifier通知，则一直为pending状态*/
        try{
          executor(this.notifier('resolved'),this.notifier('rejected'));
        }catch (error){
            //捕获同步错误
           this.promiseState = {
                status:'rejected',
                value:error
           };
           //通知执行出错处理
           return this;
        }
    }
     /*用来传递resolve + reject的通信*/
    notifier(type){
        return (val)=>{
            this.promiseState={
                status:type,
                value:val||null
            };
            //从回调队列中取出处理函数
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
    /* 链式调用，
     * 功能点1: 为了保持状态独立 
     * 功能点2: 回调处理函数只有一个[避免catch处理一次、then的第二个参数处理一次]，
     * 返回一个Promise实例
     */
    chaindHandler(fn){
        /*必须return Promise*/
        let {status,value} = this.promiseState;
        /*Promise已经有状态，则返回新的Promise实例*/
        if(status != 'pending'){
            return new Promise(()=>{});
        }else{
             if(fn){
                /*回调函数的结果如果是Promise，则返回该Promise,不然返回新的Promise实例*/
                return fn instanceof Promise ? fn : new Promise(()=>{});
            }else{
                return this;
            }
        }
    }
    /*根据then和catch处理逻辑*/
    handlelPromise(type){
        return (resFn,rejFn)=>{
            //为了用统一的模块处理then/catch,这里做个兼容处理
            if(type=='catch'){
                 rejFn=resFn;
                 resFn=null;
            }
            let {status,value} = this.promiseState;
            let self = this;
            let chaindHandler =(function(status){
                /*处理同步的情况*/
                switch(status){
                    case 'resolved':
                        return  resFn && resFn(value);
                    case 'rejected':
                        return rejFn && rejFn(value);
                         /*处理异步的情况*/
                    case 'pending':
                        /*处理异步,推送进回调数组*/
                        self.callQueue.push({
                            resolvedFn:resFn||null,
                            rejectedFn:rejFn||null
                        });
                };
            }(status));
            return this.chaindHandler(chaindHandler);
        }
    }
    /* prototype 处理Promise的结构。 then的每个状态都是个容器，相互独立 */
    then(resFn,rejFn){
       return this.handlelPromise('then')(resFn,rejFn);
    }
    catch(rejFn){
       return this.handlelPromise('catch')(rejFn);
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
    throw new TypeError('fuck')
})
.then((val)=>{
   console.log(val);
},(val)=>console.log(val))
.catch((val)=>{
    console.log(val+1)
})



