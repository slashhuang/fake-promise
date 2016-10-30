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
            // Promise的结果只能执行一次
            if( this.promiseState.status == 'pending'){
                this.promiseState={
                    status:type,
                    value:val||null
                };
                let C_length = this.callQueue.length;
                //递归寻找执行函数
                let queuedHandler =()=>{
                     //从回调队列中取出处理函数
                    if(this.callQueue.length>0){
                        // 获取执行函数第一项触发结果
                        let _1stFn = this.callQueue.shift();
                        // 获取对应函数决定取resolvedFn还是rejectedFn来处理
                        let keyName = type + 'Fn';
                        let $fn = _1stFn[keyName];
                        // 执行函数
                        if( typeof $fn == 'function'){
                            // console.warn(`执行函数为链式调用的第${C_length-this.callQueue.length}个`)
                            this.chaindHandler($fn(val));
                        }else{
                            //继续寻找下一个能够处理的函数
                            queuedHandler();
                        }
                    }
                };
                queuedHandler();
            }
        }
    }
    /* 链式调用，
     * 功能点1: 为了保持状态独立 
     * 功能点2: 回调处理函数只有一个[避免catch处理一次、then的第二个参数处理一次]，
     * 返回一个Promise实例
     */
    chaindHandler(Result){
        /*必须return Promise*/
        let {status,value} = this.promiseState;       
        if(Result){
            /*
             * 回调函数的结果如果是Promise，则返回该Promise,
             * 同时把后续的回调函数栈赋值给新的Promise
             */
            if(Result instanceof Promise){
                Result.callQueue =this.callQueue;
                //将存储的then/catch重新放回到Result下面
                while(this.callQueue.length>0){
                     let {resolvedFn,rejectedFn} = this.callQueue.shift();
                     Result = Result.then(resolvedFn,rejectedFn);
                }
            }
            /*不然返回新的Promise实例*/
            return Result instanceof Promise ? Result : new Promise(()=>{});
        }else{
            //没有返回，说明没有对应的函数处理或者是异步场景。则返回this，保持Promise的实例不变
            return this;
        }
    }
    /*根据then和catch处理逻辑,同步则立即处理、异步则缓存在this.callQueue中*/
    handlelPromise(type){
        return (resFn,rejFn)=>{
            //过滤处理函数
            resFn = typeof resFn=='function'&&resFn;
            rejFn = typeof rejFn=='function'&&rejFn
            //为了用统一的模块处理then/catch,这里做个兼容处理
            if(type=='catch'){
                 rejFn=resFn;
                 resFn=null;
            }
            let {status,value} = this.promiseState;
            let self = this;
            //获取处理的结果
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
    static race(PromiseInstance){
       //直接借用Promise的then方法，捕获数据,只要触发一次，Promise就seal住不接受后续处理，因此还是比较简单
        return new Promise((res,rej)=>{
            PromiseInstance.forEach(function($Promise){
                //如果是Promise才需要处理
                if($Promise instanceof Promise){
                     $Promise.then(
                        val=>res(val),
                        val=>rej(val)
                    );
                 }else{
                    res($Promise);
                 }
             });
            });
    }
    static all(PromiseInstance){
         //直接借用Promise的then方法，捕获数据
        let $statusValue = [];
        let triggerFn=(res,rej)=>(status,value)=>{
            //如果有一个rejected，则认为已经出结果了

            if(status =='rejected'){
                rej(value);
                return;
            };
            $statusValue .push(value);
            //都返回结果后
            if($statusValue.length  == PromiseInstance.length){
                res($statusValue)
            }
        } 
        return new Promise((res,rej)=>{
            PromiseInstance.forEach(($Promise)=>{
                 if($Promise instanceof Promise){
                     $Promise.then(
                        val=>triggerFn(res,rej)('resolved',val),
                        val=>triggerFn(res,rej)('rejected',val)
                    );
                 }else{
                    triggerFn(res,rej)('',$Promise);
                 }
                });
            });
    }
    static resolve(){

    }
    static reject(){

    }
}
/* 测试1用来 测试同步情况下的处理 ======测试通过======*/
// let test1  = new Promise((resolve,reject)=>{
//     throw new TypeError('fuck')
// })
// .then((val)=>{},
//     (val)=>{
//     console.log(val);
//     return new Promise((res,rej)=>{rej(2)})
// })
// .then((val)=>{
//     console.log(val)
// })
// .catch((val)=>{
//     console.log('catch=====',val+1)
// });

/* 测试2用来 测试异步情况下，队列形式的函数处理 ======测试通过======*/
// let test2  = new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         console.log('async  ==>  level 1');
//         resolve('async level 1')
//     },100)
// })
// .then('1') //参数无法处理Promise状态，寻找下一个执行函数
// .then((val)=>{
//         console.warn(val,'---- executed');
//         return new Promise((res,rej)=>{
//             console.log('sync after async ==> level 2');
//             res('sync after async level 2')
//         })
// })
// .then((val)=>{
//         console.warn(val,'---- executed');
//         return new Promise((res,rej)=>{
//             console.log('sync after async ==> level 2');
//             throw new TypeError('sync error thrown');
//         })
// })
// .catch((val)=>{
//     console.log('catch=====',val)
// });

/* 测试3用来 测试静态方法 race + all ======测试通过======*/

// let t1 = ()=>new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         console.error('测试静态方法===Promise.all')
//         resolve('Promise.all 1')
//     },100)
// })

// console.error('测试静态方法===Promise.race')
// let t2 =()=> new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         console.error('测试静态方法===Promise.all')
//           resolve('Promise.all 2')
//     },110)
// });
// Promise.all(t1(),t2()).then((val)=>console.dir(JSON.stringify(val)));

// Promise.race(t1(),t2()).then((val)=>console.dir(JSON.stringify(val)));



new Promise((res,rej)=>{
  res(1)
})
.then((val)=>{console.log(val);return new Promise(()=>{
  throw new TypeError('fuck')
})},(val)=>console.log('rejected then1===',val))
.then((val)=>console.log(val),(val)=>console.log('rejected===',val))
.catch((val)=>console.log('rejected=catch==',val))

// -------------------静态方法-------------------
/* Promise.all 等待回调全部返回 */
var t1 = 1;
var t2 = 1337;
var t3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

Promise.all([t1, t2, t3]).then(values => {
  console.log(values); // [3, 1337, "foo"]
});
var p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, "one");
});
var p2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 2000, "two");
});
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, "three");
});
var p4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 4000, "four");
});
var p5 = new Promise((resolve, reject) => {
  reject("reject");
});

Promise.all([p1, p2, p3, p4,p5]).then(values => {
  console.log(values);
}).catch(reason => {
  console.log(reason)
});

/** The Promise.race(iterable) 取回调函数返回的第一个**/
// --------------例1
var p1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, "one");
});
var p2 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "two");
});
Promise.race([p1, p2]).then(function(value) {
  console.log(value); // "two"
  // Both resolve, but p2 is faster
});
// --------------例2
var p3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "three");
});
var p4 = new Promise(function(resolve, reject) {
    setTimeout(reject, 500, "four");
});

Promise.race([p3, p4]).then(function(value) {
  console.log(value); // "three"
  // p3 is faster, so it resolves
}, function(reason) {
  // Not called
});
// // --------------例3
var p5 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, "five");
});
var p6 = new Promise(function(resolve, reject) {
    setTimeout(reject, 100, "six");
});
Promise.race([p5, p6]).then(function(value) {
  // Not called
}, function(reason) {
  console.log(reason); // "six"
  // p6 is faster, so it rejects
});





