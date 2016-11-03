(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	var api = function api(context, type, fn) {
	  var nextObj = new NextObject(type, fn);
	  context.next.addChild(context, nextObj);
	  return {
	    then: function then(fn) {
	      return api(nextObj, 'then', fn);
	    },
	    catch: function _catch(fn) {
	      return api(nextObj, 'catch', fn);
	    }
	  };
	};

	var dealPromise = function dealPromise(promiseContext, $type, value) {
	  promiseContext.next.child().forEach(function (nextObj) {
	    var type = nextObj.type,
	        fn = nextObj.fn,
	        next = nextObj.next;

	    var result = null;
	    //单条分支，找到最近的一次处理,执行就将该节点转化为Promise
	    if (type == $type) {
	      try {
	        result = fn(value);
	        // 转换成Promise
	        if (!(result instanceof Promise)) {
	          result = Promise.resolve(result);
	        }
	      } catch (e) {
	        result = Promise.reject(e);
	      }
	      //将处理后的节点重新挂载
	      result.next = nextObj.next;
	    } else if (nextObj.next.length) {
	      dealPromise(nextObj, $type, value);
	    }
	  });
	};

	var NextObject = function NextObject(type, fn) {
	  _classCallCheck(this, NextObject);

	  this.type = type;
	  this.fn = fn;
	  this.next = new NextArray();
	};

	var NextArray = function () {
	  function NextArray() {
	    _classCallCheck(this, NextArray);

	    this.nexter = [];
	  }

	  _createClass(NextArray, [{
	    key: 'addChild',
	    value: function addChild(context, nextObject) {
	      //通过call的形式，保持上下文
	      this.nexter.push(nextObject);
	      if (this instanceof Promise) {
	        this._checkState();
	      }
	    }
	  }, {
	    key: 'child',
	    value: function child() {
	      return this.nexter;
	    }
	  }]);

	  return NextArray;
	}();

	var Promise = exports.Promise = function () {
	  function Promise(executor) {
	    _classCallCheck(this, Promise);

	    /* Promise的参数必须是function*/
	    if (typeof executor != 'function') {
	      throw new TypeError('Promise argument is not a  valid function');
	    }
	    /* Promise的状态集合 */
	    this.promiseState = {
	      type: 'pending',
	      value: null
	    };
	    /*是否已经有结果*/
	    this.sealed = false;
	    /*处理then/catch*/
	    this.next = new NextArray();
	    /* 立即执行new Promise的参数函数executor,如果没有调用notifier通知，则一直为pending状态*/
	    try {
	      executor(this.notifier('then'), this.notifier('catch'));
	    } catch (error) {
	      //捕获同步错误
	      this.promiseState = {
	        type: 'catch',
	        value: error
	      };
	      //通知执行出错处理
	      return this;
	    }
	  }

	  _createClass(Promise, [{
	    key: '_checkState',
	    value: function _checkState() {
	      var _promiseState = this.promiseState,
	          type = _promiseState.type,
	          value = _promiseState.value;

	      if (type != 'pending') {
	        this.notifier(type)(value);
	      }
	    }
	    /*用来传递resolve + reject的通信*/

	  }, {
	    key: 'notifier',
	    value: function notifier(type) {
	      var _this = this;

	      return function (value) {
	        //Promise的结果只执行一次，就不再接受其他状态
	        if (_this.sealed == false) {
	          _this.sealed = true;
	          _this.promiseState = {
	            type: type,
	            value: value
	          };
	          setTimeout(function () {
	            return dealPromise(_this, type, value);
	          }, 0);
	        }
	      };
	    }
	  }, {
	    key: 'handlePromise',
	    value: function handlePromise(type) {
	      var _this2 = this;

	      return function (fn) {
	        //存储数据结构
	        var nextObject = new NextObject(type, fn);
	        _this2.next.addChild(_this2, nextObject);
	        return {
	          then: function then(fn) {
	            return api(nextObject, 'then', fn);
	          },
	          catch: function _catch(fn) {
	            return api(nextObject, 'catch', fn);
	          }
	        };
	      };
	    }
	    /* prototype 处理Promise的结构。 then的每个状态都是个容器，相互独立 */

	  }, {
	    key: 'then',
	    value: function then(resFn, rejFn) {
	      if (typeof resFn != 'function') {
	        return this;
	      } else {
	        return this.handlePromise('then')(resFn);
	      }
	      if (typeof rejFn == 'function') {
	        return this.catch(rejFn);
	      };
	    }
	  }, {
	    key: 'catch',
	    value: function _catch(rejFn) {
	      if (typeof rejFn != 'function') {
	        return this;
	      } else {
	        return this.handlelPromise('catch')(rejFn);
	      }
	    }
	  }]);

	  return Promise;
	}();

	Promise.resolve = function (result) {
	  if (result instanceof Promise) return new Promise(function (resolve, reject) {
	    return result.then(function (res) {
	      return resolve(res);
	    }, function (err) {
	      return reject(err);
	    });
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
	Promise.all = function (promiseArr) {
	  if ((typeof promiseArr === 'undefined' ? 'undefined' : _typeof(promiseArr)) !== 'object') {
	    throw TypeError('Promise.all arguments should be a promise array');
	  }
	  var length = promiseArr.length;
	  return new Promise(function (resolve, reject) {
	    var cachedState = {
	      promiseCache: [],
	      push: function push(type, val) {
	        /*第一个reject出错，即不再执行Promise*/
	        if (type == 'catch') {
	          reject(val);
	        } else {
	          var promiseCache = cachedState.promiseCache;

	          promiseCache.push(val);
	          if (promiseCache.length == length) {
	            resolve(promiseCache);
	          }
	        }
	      }
	    };
	    promiseArr.forEach(function (promiseItem) {
	      if (promiseItem instanceof Promise) {
	        promiseItem.then(function (val) {
	          return cachedState.push('then', val);
	        }).catch(function (val) {
	          return cachedState.push('catch', val);
	        });
	      } else {
	        cachedState.push('then', promiseItem);
	      }
	    });
	  });
	};
	Promise.race = function (promiseArr) {
	  if ((typeof promiseArr === 'undefined' ? 'undefined' : _typeof(promiseArr)) !== 'object') {
	    throw TypeError('Promise.race arguments should be a promise array');
	  }
	  var length = promiseArr.length;
	  return new Promise(function (resolve, reject) {
	    var cachedState = {
	      promiseCache: [],
	      push: function push(type, val) {
	        /*只要执行了，就说明已经*/
	        type == 'then' && resolve(val);
	        type == 'catch' && reject(val);
	      }
	    };
	    promiseArr.forEach(function (promiseItem) {
	      promiseItem.then(function (val) {
	        return cachedState.push('then', val);
	      }).catch(function (val) {
	        return cachedState.push('catch', val);
	      });
	    });
	  });
	};
	console.log('welcome to use Promise');
	var test = new Promise(function (resolve, reject) {
	  resolve(1);
	}).then(function (val) {
	  return new Promise(function (res, rej) {
	    return rej(val + 1);
	  });
	}).catch(function (val) {
	  console.log(val == 2);
	  console.dir(test);
	  cb();
	});

/***/ }
/******/ ])
});
;