/**
 * Created by slashhuang on 16/10/28.
 * simple promise polyfill with then and catch funcionality
 * promise测试 you can run in node env with strict mode ```node example.js```
 *
 *
 */

 // -------------------prototype方法-------------------
'use strict'
 let resolveFn = [
     (val)=>{
        console.log(val)
        return new Promise((res,rej)=>{
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

// -------------------静态方法-------------------
/* Promise.all 等待回调全部返回 */
var t1 = Promise.resolve(3);
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
// --------------例3
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


/** Promise.reject(reason) .**/
Promise.reject(new Error("fail")).catch((error)=>{
  console.log(error); // Stacktrace
});


