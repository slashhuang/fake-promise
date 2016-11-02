/**
 * Created by slashhuang on 16/10/27.
 * simple promise polyfill with then and catch funcionality
 * Promise具备的数据结构【promise是一个bean，作为数据结构的开始阶段】
 * status,
 * nextObjectArr={
    nextObject:{
       next:[],//子节点处理
       type:'then'/'catch',
       fn//回调处理
    }
 }
 *
 */

/*存储数据结构*/
let api = (context,type,fn)=>{
    let nextObj = new NextObject(type,fn);
    context.addChild(nextObj);
    return {
      then:function(fn){
        return api(nextObj,'then',fn)
      },
      catch:function(fn){
        return api(nextObj,'catch',fn)
      }
    }
}

let dealPromise=(promiseContext,$type,value)=>{
    promiseContext.next.child().forEach((nextObj)=>{
        let {type,fn,next} = nextObj;
        let result = null;
        //单条分支，找到最近的一次处理,执行就将该节点转化为Promise
        if(type==$type){
          try{
             result = fn(value);
             // 转换成Promise
             if (!(result instanceof Promise)) {
                result = Promise.resolve(result);
             }
          }catch(e){
             result = Promise.reject(e);
          }
          //将处理后的节点重新挂载
          result.next = nextObj.next;
        }else if(nextObj.next.length){
           dealPromise(nextObj,$type,value)
        }

    })
};

class NextObject {
  constructor(type,fn){
    this.type=type;
    this.fn=fn;
    this.next= new NextArray();
  }
  addChild(nextObject) {
    this.next.push(nextObject);
  }
}
class NextArray {
    constructor(){
      this.nexter = [];
    }
    push(nextObject){
      this.nexter.push(nextObject);
      if(this instanceof Promise){
        this._checkState();
      }
    }
    child(){
      return this.nexter;
    }
}

export class Promise{
    constructor(executor){
         /* Promise的参数必须是function*/
        if(typeof executor != 'function'){
            throw new TypeError('Promise argument is not a  valid function');
        }
        /* Promise的状态集合 */
        this.promiseState={
            type:'pending',
            value:null
        };
        /*是否已经有结果*/
        this.sealed = false;
         /*处理then/catch*/
        this.next = new NextArray();
        /* 立即执行new Promise的参数函数executor,如果没有调用notifier通知，则一直为pending状态*/
        try{
          executor(this.notifier('then'),this.notifier('catch'));
        }catch (error){
            //捕获同步错误
           this.promiseState = {
                type:'catch',
                value:error
           };
           //通知执行出错处理
           return this;
        }
    }
    _checkState(){
      let {type,value} = this.promiseState;
      if (type!='pending'){
        this.notifier(type)(value);
      }
    }
    /*用来传递resolve + reject的通信*/
    notifier(type){
        return (value)=>{
           //Promise的结果只执行一次，就不再接受其他状态
            if(this.sealed == false){
              this.sealed=true;
              this.promiseState={
                type,
                value
              };
              setTimeout(()=>dealPromise(this,type,value),0);
            }
        }
    }
    handlePromise(type){
      return (fn)=>{
         //存储数据结构
         let nextObject = new NextObject(type,fn);
         this.next.push(nextObject);
         return {
            then:function(fn){
              return api(nextObject,'then',fn)
            },
            catch:function(fn) {
              return api(nextObject,'catch',fn)
            }
         }
      }
    }
    /* prototype 处理Promise的结构。 then的每个状态都是个容器，相互独立 */
    then(resFn,rejFn){
       if(typeof resFn!='function'){
          return this;
       }else{
          return this.handlePromise('then')(resFn);
       }
       if(typeof rejFn=='function'){
          return this.catch(rejFn)
       };
    }
    catch(rejFn){
       if(typeof rejFn!='function'){
          return this;
       }else{
          return this.handlelPromise('catch')(rejFn);
       }
    }
}
Promise.resolve = function (result) {
  if (result instanceof Promise) return new Promise(function (resolve, reject) {
    return result.then(res => resolve(res), err => reject(err));
  });
  return new Promise(function (resolve, reject) {
    resolve(result);
  });
};
Promise.reject = function (err) {
  return new Promise(function (resolve, reject) {
    reject(err);
  });
};
Promise.all = function (promiseArr) {
  if(typeof promiseArr !=='object'){
    throw TypeError('Promise.all arguments should be a promise array')
  }
  let length = promiseArr.length;
  return new Promise(function (resolve, reject) {
      let cachedState={
        promiseCache:[],
        push:function(type,val){
          /*第一个reject出错，即不再执行Promise*/
          if(type=='catch'){
            reject(val);
          }else{
            let {promiseCache} = cachedState;
            promiseCache.push(val);
            if(promiseCache.length ==length){
              resolve(promiseCache);
            }
          }
        }
      };
      promiseArr.forEach((promiseItem)=>{
        if(promiseItem instanceof Promise){
             promiseItem
            .then((val)=>cachedState.push('then',val))
            .catch((val)=>cachedState.push('catch',val))
        }else{
            cachedState.push('then',promiseItem)
        }
    });
  });
}
Promise.race = function (promiseArr) {
  if(typeof promiseArr !=='object'){
    throw TypeError('Promise.race arguments should be a promise array')
  }
  let length = promiseArr.length;
  return new Promise(function (resolve, reject) {
      let cachedState={
        promiseCache:[],
        push:function(type,val){
          /*只要执行了，就说明已经*/
           type=='then' && resolve(val);
           type=='catch' && reject(val)
        }
      };
      promiseArr.forEach((promiseItem)=>{
        promiseItem
        .then((val)=>cachedState.push('then',val))
        .catch((val)=>cachedState.push('catch',val))
      })
  });
};
console.log('welcome to use Promise')






