

import {Promise} from './index.js';
/* 测试3用来 测试静态方法 race + all ======测试通过======*/


const  P =require('./dist/index.js')['Promise'];
debugger;

let t1 = ()=>new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('Promise.all 1')
    },100)
})

let t2 =()=> new Promise((resolve,reject)=>{
    setTimeout(()=>{
          resolve('Promise.all 2')
    },110)
});
Promise.all(t1(),t2()).then((val)=>console.dir(JSON.stringify(val)));



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
var _t1 = Promise.resolve(3);
var _t2 = 1337;
var t3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

Promise.all([_t1, _t2, t3]).then(values => {
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





