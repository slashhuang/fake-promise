/**
 * Created by slashhuang on 16/10/28.
 * simple promise polyfill with then and catch funcionality
 * promise测试 you can run in node env with strict mode ```node example.js```
 *
 *
 */
'use strict'
 let resolveFn = [
     (val)=>{
        console.log(val)
        return new Promise((res,rej)=>{
            // rej(2);
            res(2)
        })
     },
     (val)=>{
        console.log(val);
        return new Promise((res,rej)=>{
            rej(3)
        })
    }
];
let rejectFn = [
    (val)=>{
        console.log('rejected----',val);
        return new Promise((res,rej)=>{
            res(3)
        })
    }
];

new Promise((res,rej)=>{
    res(1);
})
.then(resolveFn[0])
.then(resolveFn[1])
.catch(rejectFn[0])
.then(resolveFn[1])
