'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _fs = require('fs');

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _emptyDir = require('empty-dir');

var _log = require('./log');

var _generateServer = require('./generate-server');

var _install = require('./install');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initserver(_ref, type, themes) {
  var args = _ref.args,
      install = _ref.install;

  (0, _log.info)('Mysql', args);

  var cwd_server = (0, _path.join)(__dirname, '../boilerplates', 'server', themes);

  //当前目录下
  var dest = process.cwd();
  var serverName = (0, _path.basename)(dest);

  if (!(0, _emptyDir.sync)(dest)) {
    (0, _log.error)('当前目录非空，请在一个空的目录里面执行命令!');
    process.exit(1);
  }

  (0, _log.info)('server at', dest);
  console.log();

  var paramArgs = args;
  if (themes === 'default') {
    paramArgs.unshift('default');
  }

  _vinylFs2.default.src(['**/*', '!node_modules/**/*'], { cwd: cwd_server, cwdbase: true, dot: true }).pipe(template(dest, cwd_server)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
    (0, _log.info)('package', args[1]);
    require('./init-mysql')(paramArgs, 'server');
    (0, _log.info)('rename', 'gitignore -> .gitignore');
    (0, _fs.renameSync)((0, _path.join)(dest, 'gitignore'), (0, _path.join)(dest, '.gitignore'));
    (0, _generateServer.generaterConfig)(paramArgs);
    //generaterMakefile(args);
    // if (type === 's') {
    //   if (install) {
    //     info('run', 'mvn clean compile');
    //     sereverInstall(printSuccess);
    //   } else {
    //      printSuccess();
    //   }
    // }
    // })
  }).resume();

  function printSuccess() {
    (0, _log.success)('\n        Success! Created ' + serverName + ' at ' + dest + '.\n\n        \u5728\u8BE5\u76EE\u5F55\u4E2D\uFF0C\u60A8\u53EF\u4EE5\u8FD0\u884C\u51E0\u4E2A\u547D\u4EE4:\n        * mvn clean compile: \u7F16\u8BD1\u6253\u5305\u5E94\u7528\u7A0B\u5E8F..\n        * mvn clean install: \u5B89\u88C5\u5E94\u7528\u7A0B\u5E8F\u5305.\n        * mvn tomcat:run: \u8FD0\u884C\u5E94\u7528\u7A0B\u5E8F.\n\n        \u6211\u4EEC\u5EFA\u8BAE\u4F60\u9996\u5148\u8F93\u5165:\n        cd ' + dest + '\n        mvn tomcat:run\n\n        \u5DE5\u4F5C\u6109\u5FEB,ulongx!');
  }
  return true;
}

function template(dest, cwd) {
  return _through2.default.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }
    (0, _log.info)('create', file.path.replace(cwd + '/', ''));
    this.push(file);
    cb();
  });
}

exports.default = initserver;
module.exports = exports['default'];