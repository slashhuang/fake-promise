# ismorphic-promise. promise异步处理的JS实现。

[![build status](https://travis-ci.org/slashhuang/ismorphic-promise.svg?branch=master)](https://travis-ci.org/slashhuang/ismorphic-promise)
## 项目特点

1. 通过了[MDN官网的Promise用例](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

2. 源代码基于ES6的class语法，更加清晰

### [实现的Promise源码](index.js)

## Promise设计的基本框架

1. 数据结构

> 采用链表的数据结构来描述Promise的状态

> then/catch方法抽象为树形链表的一个节点(可以类比dom tree)

> Promise抽象为状态的发起者,向所有的子节点触发事件，每条branch都只有一个回应者,依次递归。

2. 算法

> 树状节点的状态更新来自以下两方面.

1. resolved,rejected修改Promise，并异步传递状态给子节点。

2. then/catch的节点添加入链表,触发状态检查。

> 每个数据状态都依赖一个Promise来发起，并保持。


## Promise数据结构骨架

```javascript

     let PromiseStructure = {

        promiseState:{ //存储数据及状态
            status:'',
            value:''
        },

        sealed:boolean, //Promise是否已有状态，有的话就封锁

        next:[
            // then/catch节点
        ]

        then,

        catch
    }

```

## then/catch返回节点的数据结构

```javascript

     let then/catch节点 = {

        fn,   //处理函数

        next:[
            // then/catch节点
        ],

        type, //表明是处理then/catch的函数

        then, //链式API

        catch //链式API
    }

```

![基本的Promise流程](promise.png)









