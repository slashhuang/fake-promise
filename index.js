/**
 * Created by slashhuang on 16/10/27.
 * simple promise polyfill with then and catch funcionality
 * Promise具备的基本特性
 * 1. 状态
 * Promise拥有pending + fulfilled + rejected三种状态
 * 2. 执行方式
 * Promise的状态变为fulfilled + rejected的时候，对应的队列中的处理函数将会执行

 * 单一状态都会不断的寻找处理函数，直到能够被处理,并且一个状态只能被处理一次
 * then1 ==> {promiseState1,callQueue,dependency=[]}
 * then2 ==> {promiseState2,callQueue-then1[callQueue],dependency=[then1]}
 * then3 ==> {promiseState2,callQueue-then1[callQueue]-then2[callQueue],dependency=[then2]}
 */
export class Promise{
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
        /*所有观测Promise的对象*/
        this.observers = [];
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
    //注册观察者
    subscribe(Observer_fn){
      this.observers.push(Observer_fn);
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
                //遍历观察者
                this.observers.forEach((o_fn)=>{
                  o_fn(this);
                })
            }
        }
    }
    /*
     * 由于逻辑可以复用，采用一个方法统一处理then/catch
     * 根据then和catch处理逻辑,同步则立即处理、异步则缓存在this.callQueue中
     * 同于Promise每个返回都是一个独立的状态集，因此返回一个新的Promise，并且这个新的Promise依赖于调用方的返回
     */
    handlelPromise(type){
        return (resFn,rejFn)=>{
            //如果都不是function类型,则不新增Promise状态
            if(typeof resFn!='function' && typeof rejFn!='function'){
                return this;
            }
            //过滤处理函数
            resFn = typeof resFn=='function'&&resFn;
            rejFn = typeof rejFn=='function'&&rejFn
            //为了用统一的模块处理then/catch,这里做个兼容处理
            if(type=='catch'){
                 rejFn=resFn;
                 resFn=null;
            };
            let {status,value} = this.promiseState;
            let self = this;
            //获取处理的结果
            let g_Promise =(function(status){
                /*处理同步的情况*/
                switch(status){
                    case 'resolved':
                        return  resFn && resFn(value);
                    case 'rejected':
                        return rejFn && rejFn(value);
                         /*处理异步的情况*/
                    case 'pending':
                        let newP = new Promise((res,rej)=>{});
                        /* 处理异步,推送进回调数组
                         * 注册dependency中的notifier
                         */
                        newP.callQueue = [{
                            resolvedFn:resFn||null,
                            rejectedFn:rejFn||null
                        }];
                        /*注册对这个Promise的观察者*/
                        self.subscribe((dependency_state)=>{
                          let { promiseState } = dependency_state;
                          let { status,value } = promiseState;
                          if(newP.callQueue.length>0){
                              // 获取执行函数第一项触发结果
                              let _1stFn = newP.callQueue.shift();
                              // 获取对应函数决定取resolvedFn还是rejectedFn来处理
                              let $fn = _1stFn[status + 'Fn'];
                              // 执行函数
                              if( typeof $fn == 'function'){
                                  let $cbk = $fn(value);
                                  //如果返回还是个promise，则将返回的状态赋值给newP
                                  if($cbk && $cbk instanceof Promise){
                                     //newP的回调队列挂载到新的状态上
                                      $cbk.observers = $cbk.observers.concat(newP.observers);
                                      newP = $cbk;
                                      newP.then((val)=>{
                                          newP.observers.forEach((o_fn)=>{
                                            o_fn(newP);
                                          })},(val)=>{
                                          newP.observers.forEach((o_fn)=>{
                                            o_fn(newP);
                                          });
                                      });
                                  }else{
                                     //如果没有可以执行的函数,则把newP赋值回去
                                    newP.observers.forEach((o_fn)=>{
                                      o_fn(self);
                                    });
                                    newP = self;
                                  }
                              }else{
                                  //如果没有可以执行的函数,则把newP赋值回去
                                    newP.observers.forEach((o_fn)=>{
                                      o_fn(self);
                                    });
                                    newP = self;
                              }
                          }
                        });
                        return newP;
                };
            }(status));
            return this.generatePromise(g_Promise);
        }
    }
    /*Promise的链式*/
    generatePromise(g_Promise){
         if(g_Promise && g_Promise instanceof Promise){
          /*
          * 如果是在上个Promise已经resolved或者rejected情况下，参数返回为Promise，则返回新的Promise
          */
            return g_Promise
         }else{
            /*不然说明，当前的Promise返回没有任何可以处理的函数，Promise链条不做任何增加*/
            return this;
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
    /**仅仅接收value/promise/thenable**/
    static resolve($Promise){
         //如果是Promise才需要处理
        if($Promise instanceof Promise){
            $Promise.then(
                val=>res(val),
                val=>rej(val)
            );
        }
         return new Promise((res,rej)=>{
                if($Promise instanceof Promise){
                    $Promise.then(
                        val=>res(val),
                        val=>rej(val)
                    );
                }
               else{
                    //如果是then键值的伪promise
                    if(typeof $Promise =='object' &&$Promise.hasOwnProperty('then')){
                        let { then }= $Promise;
                        return new Promise(then)
                    }else{
                        res($Promise);
                    }
                 }
             });
    }
    static reject(reason){
            return new Promise((res,rej)=>{
                rej(resson);
             });
    }
}
console.log('welcome to use Promise')
/*测试异步情况*/
let test1 = new Promise((res,rej)=>{
    setTimeout(res,1000,1);
});
console.dir(test1);
let test2 = test1.then((val)=>{
    console.log(val);
    return new Promise((res,rej)=>{
        setTimeout(res,1000,3);
    }).then((val)=>{
       return new Promise((res,rej)=>{
         setTimeout(res,1000,4);
       })
    })
});
console.dir(test2);
let test3 = test2.then((val)=>{
    console.log(val);
    return new Promise((res,rej)=>{
        res(3);
    })
});
console.dir(test3);





