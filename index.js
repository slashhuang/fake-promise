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
        let {type,fn} = nextObj;
        //单条分支，找到最近的一次处理
        if(type==$type){
          let result = fn(value);
          if( result && result instanceof Promise){
          //如果结果为Promise，则对子节点的上下文重新挂载
          }
        }else{
          //继续对子节点进行操作
          // dealPromise(nextObj)
        }
        dealPromise(nextObj,$type,value)
    })
};

class NextObject {
  constructor(type,fn){
    this.type=type;
    this.fn=fn;
    this.next=[];
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
        this.next = [];
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
console.log('welcome to use Promise')
/*测试同步情况*/
let test1 = new Promise((res,rej)=>{
    setTimeout(res,100,1);
});
let test2 = test1.then((val1)=>{console.log(val1)})
let test3 = test1.then((val2)=>{console.log(val2)});
let test4 = test2.then((val4)=>{console.log(val4)});
// let test3 = test2.then((val3)=>{}).then((val4)=>{});
console.dir(test1);
console.dir(test2);
console.dir(test3);






