

const  Promise = require('../')['Promise'];

describe('Promise.all test', function () {
  it('should work', function (done) {
    const t1 = new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('Promise.all 1')
        },10)
    })
    const t2 = new Promise((resolve,reject)=>{
        setTimeout(()=>{
              resolve('Promise.all 2')
        },20)
    });
    Promise.all([t1,t2]).then((val)=>{
        console.log(val);
        done();
    }).catch((val)=>{
        console.log('----',val);
        done();
    });

  })
})


