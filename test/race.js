
const  Promise = require('../')['Promise'];

describe('Promise.race test', function () {
  it('should work', function (done) {
    var p1 = new Promise(function(resolve, reject) {
        setTimeout(resolve, 110, "one");
    });
    var p2 = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100, "two");
    });
    Promise.race([p1, p2]).then(function(value) {
        console.log(value); // "two"
        done();
    }).catch(function(value){
        console.log(value); // "two"
        done();
    });
  })
});



