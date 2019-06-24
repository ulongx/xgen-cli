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

var _install = require('./install');

var _generateClient = require('./generate-client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initcilent(_ref, type) {
  var args = _ref.args,
      install = _ref.install;


  var cwd_cilent = (0, _path.join)(__dirname, '../boilerplates', 'client');

  //当前目录下
  var dest = process.cwd() + (type === 'c' ? '' : '-cli');

  var clientName = (0, _path.basename)(dest);
  var serverName = args[0];

  if (!(0, _emptyDir.sync)(dest)) {
    (0, _log.error)('当前目录非空，请在一个空的目录里面执行命令!');
    process.exit(1);
  }

  console.log('client at ' + dest + '.');
  console.log();

  _vinylFs2.default.src(['**/*', '!node_modules/**/*'], { cwd: cwd_cilent, cwdbase: true, dot: true }).pipe(template(dest, cwd_cilent)).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
    require('./init-mysql')(args, 'client', type);
    (0, _log.info)('rename', 'gitignore -> .gitignore');
    (0, _fs.renameSync)((0, _path.join)(dest, 'gitignore'), (0, _path.join)(dest, '.gitignore'));
    (0, _generateClient.generaterMakefile)(args, dest);
    if (type === 'c') {
      if (install) {
        (0, _log.info)('run', 'npm install');
        (0, _install.clientInstall)(printSuccess);
      } else {
        printSuccess();
      }
    }
  }).resume();

  function printSuccess() {
    (0, _log.success)('\n        Success! Created ' + clientName + ' at ' + dest + '.\n\n        \u5728\u8BE5\u76EE\u5F55\u4E2D\uFF0C\u60A8\u53EF\u4EE5\u8FD0\u884C\u51E0\u4E2A\u547D\u4EE4:\n        * npm start: \u542F\u52A8\u5F00\u53D1\u670D\u52A1\u5668.\n        * npm run build: \u7F16\u8BD1\u6253\u5305\u5E94\u7528\u7A0B\u5E8F.\n        * npm test: \u8FD0\u884C\u6D4B\u8BD5.\n\n        \u6211\u4EEC\u5EFA\u8BAE\u4F60\u9996\u5148\u8F93\u5165:\n        cd ' + dest + '\n        npm start\n\n        \u5DE5\u4F5C\u6109\u5FEB,ulongx!');
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

exports.default = initcilent;
module.exports = exports['default'];