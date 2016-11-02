

import {Promise} from './index.js';
/* 测试3用来 测试静态方法 race + all ======测试通过======*/


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





