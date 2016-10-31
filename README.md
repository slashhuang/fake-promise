# ismorphic-promise.同构JS promise异步处理模块。

## 项目特点

1. 通过了[MDN官网的Promise所有用例](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。
2. 实现了基于prototype和Promise静态的方法。
3. 代码简单，性能高，内存回收处理及时。
4. 纯粹原创，未借鉴别人的思路，具有一定程度的突破性。
5. 前后端通用,相比于node/browser内置的Promise对象更具有扩展性
6. 源代码基于ES6的class语法，更加清晰

### [同步Promise的实现](sync_promise.js)
### [异步Promise的实现](async_promise.js)
### [最终Promise的实现](index.js)

## Promise设计的基本框架

1. 状态

> 每个Promise都是独立的状态，状态由该Promise的最后状态决定

> 每个Promise状态始终保留，不会被外界影响

2. 链式处理

> 所有的通知处理机制来自于(resolved,rejected)

3. Promise能兼容同步和异步场景的回调处理

## Promise数据结构骨架

```javascript
     let PromiseStructure = {
        observers:[],  //观察者数组，当前Promise状态改变的时候，通知所有的观察者
        promiseState:{ //存储数据及状态
            status:'',
            value:''
        },
        callQueue:[{   //存储当前Promise的resolve,reject参数函数
            resolvedFn:function,
            rejectedFn:function
        }]
    }
```

```javascript

    /**  举个常见的场景 **/

    let test1 = new Promise((res,rej)=>setTimeout(res,100,1));

    let f2 =  (val)=>new Promise((res,rej)=>{ res(2) });

    let test2 = test1.then(f2)

    /* 分析
     test1={
        observers:[test2],  //观察者数组，当前Promise状态改变的时候，通知所有的观察者
        promiseState:{ //存储数据及状态
            status:'pending',
            value:''
        },
        callQueue:[]
     }
     test2={
        observers:[],  //观察者数组，当前Promise状态改变的时候，通知所有的观察者
        promiseState:{ //存储数据及状态
            status:'pending',
            value:''
        },
        callQueue:[{   //存储当前Promise的resolve,reject参数函数
            resolvedFn:function,
            rejectedFn:function
        }]
     *
     * 过100ms，执行then的回调函数。当前如下
     *
     test1={
        observers:[],  //观察者数组，执行完通知test2后就出队列
        promiseState:{ //存储数据及状态
            status:'resolved',
            value:1
        },
        callQueue:[]
     }
     * 而test2则进入它自身各种return的Promise管理中
     test2={
        observers:[],  //观察者数组，当前Promise状态改变的时候，通知所有的观察者
        promiseState:{ //存储数据及状态
            status:'pending',
            value:''
        },
        callQueue:[] 
     */
	
```


![基本的Promise流程](promise.png)









