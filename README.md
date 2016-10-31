# ismorphic-promise.同构JS promise异步处理模块。

## 项目特点

1. 通过了[MDN官网的Promise所有用例](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。
2. 实现了基于prototype和Promise静态的方法。
3. 代码简单，性能高，内存回收处理及时。
4. 纯粹作者原创，未借鉴别人的思路，具有一定程度的突破性。
5. 前后端通用,相比于node/browser内置的Promise对象更具有扩展性
6. 源代码基于ES6的class语法，更加清晰

### [同步Promise的实现](sync_promise.js)
### [异步Promise的实现](async_promise.js)
### [最终Promise的实现](index.js)

## Promise基本设计思路
> 对于一个长这样的Promise结构
```javascript
    new Promise((res,rej)=>{
        //异步、同步操作
    }).then(then1).then(then2).catch(catch1)
```
> 映射为，每一层次返回
```bash
   return promise1 = { promiseState1,handler1,dependency=null };
   return promise2 = { promiseState2,handler2,dependency=promise1 };
   return promise3 = { promiseState3,handler3,dependency=promise2 };
   return promise4 = { promiseState4,handler4,dependency=promise3 };
```
> 处理逻辑
```bash
==> promise1 调用handler1
====== resolve或者reject改变promise1的状态，通知  ======
==> promise2开始执行handler2
====== resolve或者reject改变promise2的状态，通知  ======
==> promise3开始执行handler3
...依次类推

```


## Promise骨架
```javascript
	class Promise{
    	constructor(executor){
    	}
    	/*用来传递resolve + reject的通信*/
    	notifier(type){
        	return (val)=>{
        	}
        }
         /* 链式调用，
	     * 功能点1: 为了保持状态独立
	     * 功能点2: 回调处理函数只有一个[避免catch处理一次、then的第二个参数处理一次]，
	     * 返回一个Promise实例
	     */
	    chaindHandler(Result){
	    }
	    /*根据then和catch处理逻辑,同步则立即处理、异步则缓存在this.callQueue中*/
	    handlelPromise(type){
	        return (resFn,rejFn)=>{
	        }
	    }
	    /* prototype 处理Promise的结构。 then的每个状态都是个容器，相互独立 */
    	then(resFn,rejFn){
    	}
    	catch(rejFn){
	    }
	    /* 静态方法 处理Promise的逻辑 */
    	static race(PromiseInstance){
    	}
    	static all(PromiseInstance){
    	}
    	/**仅仅接收value/promise/thenable这三种类型数据**/
    	static resolve($Promise){
    	}
    	static reject(reason){
    	}
```


![基本的Promise流程](./promise.png)









