# xgen-cli

[![NPM version](https://img.shields.io/npm/v/xgen-cli.svg?style=flat)](https://npmjs.org/package/xgen-cli) [![NPM downloads](http://img.shields.io/npm/dm/xgen-cli.svg?style=flat)](https://npmjs.org/package/xgen-cli)

xgen 命令行程序。根据数据库自动生成前端reactjs和服务端SpringBoot项目。仅支持MySql

## Install

```bash
$ npm install -g xgen-cli
```

## Usage

### xgen p

```bash
$ mkdir myApp && cd myApp
$ xgen p dbname 127.0.0.1 root 123 3306
$ make
```
最后一个参数是端口号，如果默认是3306端，可以不写。

#### option

```bash
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
```

### xgen g
```bash
$ xgen g --s model user demodb 127.0.0.1 root 123 3306;
```
#### option

```bash
  Usage: xgen g <command> [options]

  Options:

    -h, --help     output usage information
    --c            output the client files
    --s            output the server files

  Commands:

    model         生成model相关文件
    service       生成sercice相关文件

```

## License

[MIT](https://tldrlegal.com/license/mit-license)
