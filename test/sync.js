
const  Promise = require('../')['Promise'];

var assert = require('assert');

describe('sync Promise test', function () {
  it('should work', function (cb) {
    /* 测试1用来 测试同步情况下的处理 ======测试通过======*/
      new Promise((resolve,reject)=>{
            resolve(1);
        })
        .then((val)=>new Promise((res,rej)=>rej(val+1)))
        .catch((val)=>{
            console.log(val==2);
            cb();
        });
  });
});