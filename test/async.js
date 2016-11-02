
const  Promise = require('../')['Promise'];
var assert = require('assert');

describe('async Promise test', function () {
  it('should work', function (cb) {
    /* 测试1用来 测试同步情况下的处理 ======测试通过======*/
      new Promise((resolve,reject)=>{
            setTimeout(resolve,100,1);
        })
        .then((val)=>new Promise((res,rej)=>setTimeout(rej,100,val+1)))
        .catch((val)=>{
            console.log(val==2);
            cb();
        });
  });
});