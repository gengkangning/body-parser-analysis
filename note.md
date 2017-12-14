# 1.1 一个POST请求报文

* Content-Type：请求报文主体的类型、编码。常见的类型有text/plain、application/json、application/x-www-form-urlencoded。常见的编码有utf8、gbk等。

* Content-Encoding：声明报文主体的压缩格式，常见的取值有gzip、deflate、identity。

* 报文主体

# 1.2 请求体解析

### Node.js 原生HTTP模块中，是将用户请求数据封装到了用于请求对象req中，该对象是一个IncomingMessage，该对象同时也是一个可读流对象。在原生HTTP服务器，或不依赖第三方解析模块时，可以像下面这样接收并解析请求体：

``` const http = require('http');

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
}).listen(3000);  ```

# 1.3 使用body-parser解析请求体(在最新版本中body-parser模块已经不和express,connect模块绑定在一块了，需要单独引入模块)

## body-parser模块是一个Express/Connect中间件，它使用非常简单且功能强大，可以像下面这样用这个模块解析请求体：

### 1.3.1 Express/Connect 项层处理

* Express框架默认使用body-parser做为请求体解析中间件，创建Express项目后，可以在app.js文件中看到如下代码：

# body-parser主要做了什么
* 处理不同类型的请求体：比如text、json、urlencoded等，对应的报文主体的格式不同。

* 处理不同的编码：比如utf8、gbk等。

* 处理不同的压缩类型：比如gzip、deflare等。

* 其他边界、异常的处理。

