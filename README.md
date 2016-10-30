# ismorphic-promise.同构JS promise异步处理模块。

## 项目特点

1. 通过了[MDN官网的Promise所有用例](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。
2. 实现了基于prototype和Promise静态的方法。
3. 代码简单，性能高，内存回收处理及时。
4. 纯粹作者原创，未借鉴别人的思路，具有一定程度的突破性。
5. 前后端通用,相比于node/browser内置的Promise对象更具有扩展性
6. 源代码

## static methods

> Promise.all 等待所有的Promise都达到fulfilled的状态，任何一个Promise到达rejected都会触发 catch抛错

> Promise.race 等待所有的Promise中第一个达到fulfilled或者rejected的状态，即执行最后的then、catch结果

> Promise.resolve 直接处理fulfilled返回结果

> Promise.reject 直接处理reject的报错

## prototype methods原型链方法

> prototype.then 处理Promise的resolve返回

> prototype.catch 处理Promise的reject返回

## Promise实现思路

### 骨架
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









