/*!
 * body-parser
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.  模块依赖
 * @private
 */

//引入depd模块，该模块
var deprecate = require('depd')('body-parser')

/**
 * Cache of loaded parsers.    加载解析器的缓存
 * @private
 */

//定义一个parsers对象，这样定义对象，没有继承任何原型方法，也就是说它的原型链没有上一层。
var parsers = Object.create(null)  

/**
 * @typedef Parsers
 * @type {function}
 * @property {function} json
 * @property {function} raw
 * @property {function} text
 * @property {function} urlencoded
 */

/**
 * Module exports. 暴露模块
 * @type {Parsers}
 */

exports = module.exports = deprecate.function(bodyParser,
  'bodyParser: use individual json/urlencoded middlewares')

/**
 * JSON parser.
 * @public
 */
 
//为暴露的模块创建一个名为json的访问器属性，可被枚举，可被删除，当访问器属性被读取时加载解析器。
Object.defineProperty(exports, 'json', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('json')
})

/**
 * Raw parser.
 * @public
 */
 
//为暴露的模块创建一个名为raw的访问器属性，可被枚举，可被删除，当访问器属性被读取时加载解析器。
Object.defineProperty(exports, 'raw', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('raw')
})

/**
 * Text parser.
 * @public
 */
 
//为暴露的模块创建一个名为text的访问器属性，可被枚举，可被删除，当访问器属性被读取时加载解析器。
Object.defineProperty(exports, 'text', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('text')
})

/**
 * URL-encoded parser.
 * @public
 */

//为暴露的模块创建一个名为urlencoded的访问器属性，可被枚举，可被删除，当访问器属性被读取时加载解析器。
Object.defineProperty(exports, 'urlencoded', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('urlencoded')
})

/**
 * Create a middleware to parse json and urlencoded bodies.
 *
 * @param {object} [options]  参数为options对象
 * @return {function} 返回一个函数
 * @deprecated
 * @public
 */

//声明bodyParser函数
function bodyParser (options) {
  //定义一个opts对象
  var opts = {}

  // exclude type option  判断options中的属性是否不是基本数据类型，如果不是则将它们放入到opts对象中
  if (options) {
    for (var prop in options) {
      if (prop !== 'type') {
        opts[prop] = options[prop]
      }
    }
  }
  
  //定义_urlencoded和_json，并将模块中的urlencode和json方法赋值给它们
  var _urlencoded = exports.urlencoded(opts)
  var _json = exports.json(opts)

  //返回bodyParser函数
  return function bodyParser (req, res, next) {
    _json(req, res, function (err) {
      if (err) return next(err)
      _urlencoded(req, res, next)
    })
  }
}

/**
 * Create a getter for loading a parser. 创建一个用于加载解析器的get函数，用于模块的访问器属性的调用
 * @private
 */

function createParserGetter (name) {
  return function get () {
    return loadParser(name)
  }
}

/**
 * Load a parser module. 加载一个解析器模块
 * @private
 */

function loadParser (parserName) {
  var parser = parsers[parserName]
  
  //如果parser不是undefined,说明这个模块已经被缓存，直接返回parser
  if (parser !== undefined) {
    return parser
  }
  
  //用一个switch判断parserName是什么类型的，并为parser引入响应的模块
  // this uses a switch for static require analysis
  switch (parserName) {
    case 'json':
      parser = require('./lib/types/json')
      break
    case 'raw':
      parser = require('./lib/types/raw')
      break
    case 'text':
      parser = require('./lib/types/text')
      break
    case 'urlencoded':
      parser = require('./lib/types/urlencoded')
      break
  }
  
  //缓存这个模块
  // store to prevent invoking require()
  return (parsers[parserName] = parser)
}
