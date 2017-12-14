# 1.1 一个POST请求报文

* Content-Type：请求报文主体的类型、编码。常见的类型有text/plain、application/json、application/x-www-form-urlencoded。常见的编码有utf8、gbk等。

* Content-Encoding：声明报文主体的压缩格式，常见的取值有gzip、deflate、identity。

* 报文主体

# 1.2 请求体解析

### Node.js 原生HTTP模块中，是将用户请求数据封装到了用于请求对象req中，该对象是一个IncomingMessage，该对象同时也是一个可读流对象。在原生HTTP服务器，或不依赖第三方解析模块时，可以像下面这样接收并解析请求体：

``` 
const http = require('http');

//用http模块创建一个http服务端 
http.createServer(function(req, res) {
  if (req.method.toLowerCase() === 'post') {
    var body = '';   
    req.on('data', function(chunk){
      body += chunk;
    });

    req.on('end', function(){
      if(req.headers['content-type'].indexOf('application/json')!==-1){
        // JSON 格式请求体解析
        JSON.parse(body);
      } else if(req.headers['content-type'].indexOf('application/octet-stream')!==-1){
        // Raw 格式请求体解析
        // ……
      } else if(req.headers['content-type'].indexOf('text/plain')!==-1){
        // text 文本格式请求体解析
        // ……
      } else if(req.headers['content-type'].indexOf('application/x-www-form-urlencoded')!==-1){
        // URL-encoded 格式请求体解析
        // ……
      } else {
      	// 其它格式解析
      }
    })
  } else {
    res.end('其它提交方式');
  }
}).listen(3000);  
```

# 1.3 使用body-parser解析请求体(在最新版本中body-parser模块已经不和express,connect模块绑定在一块了，需要单独引入模块)

## body-parser模块是一个Express/Connect中间件，它使用非常简单且功能强大，可以像下面这样用这个模块解析请求体：

### 1.3.1 Express/Connect 项层处理

* Express框架默认使用body-parser做为请求体解析中间件，创建Express项目后，可以在app.js文件中看到如下代码：
```
/* 引入依赖项 */
var express = require('express');
// ……
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// ……

// 解析 application/json
app.use(bodyParser.json());	
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
```

* 这样就在项目的Application级别，引入了body-parser模块处理请求体。在上述代码中，模块会处理application/x-www-form-urlencoded、application/json两种内容格式的请求体。经过这个中间件处理后，就可以在所有路由处理器的req.body中访问请求参数。


### 1.3.2 解析Express具体路由 

* 在实际应用中，不同路径（路由）可能会要求用户使用不同的内容类型，body-parser还支持为单个Express路由添加请求体解析：
```
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// 创建 application/json 解析
var jsonParser = bodyParser.json()

// 创建 application/x-www-form-urlencoded 解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login 获取 URL编码的请求体
app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body.username)
})

// POST /api/users 获取 JSON 编码的请求体
app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  // create user in req.body
})
```

### 1.3.3指定请求类型
* body-parser还支持为某一种或一类内容类型的请求体指定解析方式，指定时可以通过在解析方法中添加type参数修改指定Content-Type的解析方式。
* 如，可以对text/plain内容类型使用JSON解析：
```
app.use(bodyParser.json({ type: 'text/plain' }))
```

# 2.body-parser模块的API

* 通过npm install body-parser命令安装模块后，可以通过以下方式获取模块引用：
```
var bodyParser = require('body-parser')
```
* bodyParser变量是对中间件的引用。请求体解析后，解析值都会被放到req.body属性，内容为空时是一个{}空对象。

* bodyParser.json() - 解析JSON格式
```
bodyParser.json(options)
```

[json](https://github.com/gengkangning/body-parser-analysis/blob/master/lib/types/json.js)  

# body-parser主要做了什么
* 处理不同类型的请求体：比如text、json、urlencoded等，对应的报文主体的格式不同。

* 处理不同的编码：比如utf8、gbk等。

* 处理不同的压缩类型：比如gzip、deflare等。

* 其他边界、异常的处理。

