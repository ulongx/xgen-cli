# xgen-cli

[![NPM version](https://img.shields.io/npm/v/xgen-cli.svg?style=flat)](https://npmjs.org/package/xgen-cli) [![NPM downloads](http://img.shields.io/npm/dm/xgen-cli.svg?style=flat)](https://npmjs.org/package/xgen-cli)

xgen 命令行程序。根据数据库自动生成SpringBoot项目,带FreeMark 前端html模版，如果生成总个项目同时还带有reactjs工程。
目前仅支持MySql数据库

## 目前有三个 templates
  * blackgreen
  * ubold
  * default

## Install

``` bash
$ npm install -g xgen-cli
```

## Usage

### xgen p

``` bash
$ mkdir myApp && cd myApp
$ xgen p dbname 127.0.0.1 root 123 3306
$ make
```
最后一个参数是端口号，如果默认是3306端，可以不写。

#### option

``` bash
  Usage: xgen <command> [options]

  Options:

    -h, --help     output usage information
    -v, --version  output the version number

  Commands:

    server        在当前目录创建server端程序，短参数 "s"
    client        在当前目录创建client端程序，短参数 "c"
    project       创建一个工程包含server和client端，工程名字要和数据库名一致，短参数 "p"
    generate      在当前目录生成server或者client文件，短参数 "g"

  所有参数可以使用 -h (或 --help)来查看使用方式.

  Example All:
    xgen p app 127.0.0.1 root 1234 3306
    xgen p -t blackgreen app 127.0.0.1 root 1234 3306 自定义主题

  Example Server:
    xgen s com.spring.demotest jar demodb 127.0.0.1 root 1234 3306
    ->com.spring.demotest：  程序包名
    ->jar：  spring的启动方式，分为jar 、 war 方式
    xgen s -t blackgreen com.spring.demotest jar demodb 127.0.0.1 root 1234 3306     #自定义主题
    ->-t：  指定主题名称

  Example Single Java file:
    xgen g -s model account com.spring.single demodb 127.0.0.1 root 1234 3306
    ->account: 表名称
    ->com.spring.single： 程序包名
    xgen g -st blackgreen model account com.spring.single demodb 127.0.0.1 root 1234 3306  #生成指定模版
    ->-t:  blackgreen 模版名称
```

### xgen g 单个文件生成

server端单个类代码,生成model的时候，会有model，mapper.xml, mapper.java, page.java, service.java, serviceImpl.java, xxx.html, xxxController.java
``` bash
$ xgen g -s model account com.spring.single demodb 127.0.0.1 root 1234 3306;
$ xgen g -s service account com.spring.single demodb 127.0.0.1 root 1234 3306;
$ xgen g -st blackgreen model account com.spring.single demodb 127.0.0.1 root 1234 3306  #生成指定模版
```

client 端单个js代码
``` bash
$ xgen g -c model tablename demodb 127.0.0.1 root 123 3306;
```

#### option

``` bash
  Usage: xgen g [options] <command>

  Options:

    -h, --help     output usage information
    -c             output the client files
    -s             output the server files

  Commands:

    model         生成model相关文件 (server or client)
    service       生成service相关文件 (server or client)
    route         生成route文件 (client)
    component     生成component文件 (client)
    all           生成全部文件 (client)
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
