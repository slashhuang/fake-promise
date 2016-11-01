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
    promiseContext.next.forEach((nextObj)=>{
        let {type,fn,next} = nextObj;
        let result = null;
        //单条分支，找到最近的一次处理
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
        }else if(callbackObject.next.length){
           dealPromise(nextObj,$type,value)
        }
       
    })
};
//为了处理，直接挂载then/catch，修改Array的push方法
class NextShape extends Array{
  constructor(){
    super();
    this.a='a';
  }
  $push(nextObj){
    super.push(nextObj);
    //如果推送进数组的时候，上下文已经是个Promise了，则执行一次
    this._ctx && this._ctx._checkState();
  }
}
console.dir(NextShape)

let q = new NextShape({})
console.dir(q);
q.$push(1)



class NextObject {
  constructor(type,fn){
    this.type=type;
    this.fn=fn;
    this.next= new NextShape();
  }
  addChild(nextObject) {
    this.next.push(nextObject);
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
         /*处理then/catch*/
        this.next = new NextShape();
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
            //Promise的结果只能执行一次
            this.promiseState={
              type,
              value
            };
            setTimeout(()=>dealPromise(this,type,value),0);
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
console.log('welcome to use Promise')
/*测试同步情况*/
let test1 = new Promise((res,rej)=>{
    setTimeout(res,100,1);
});
let test2 = test1.then((val1)=>{
  return new Promise((res,rej)=>{
    setTimeout(res,100,2);
  })
})
let test3 = test1.then((val2)=>{console.log(val2)});
let test4 = test2.then((val4)=>{console.log(val4)});

setTimeout(()=>test2.then((val4)=>{debugger;console.log(val4)}),500)






