'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateClient = generateClient;
exports.generateIndexjs = generateIndexjs;
exports.generaterMakefile = generaterMakefile;

var _utils = require('./utils');

var _fs = require('fs');

var _log = require('./log');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _camelizejs = require('camelizejs');

var _camelizejs2 = _interopRequireDefault(_camelizejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* 生产antd client端代码
* create by ulongx on 2016/12/01
*/
function generateClient(rows, namespace, gtype) {
  (0, _assert2.default)(namespace, '缺少 namespace');
  //当前目录
  var dest = process.cwd() + (gtype === 'c' ? '' : '-cli');
  var base = 'src';

  var namespaceUp = (0, _camelizejs2.default)(namespace, false);

  /********** model ***********/
  var template = (0, _utils.getTemplate)('models', 'client');
  var source = template({ namespace: namespace });
  var filePath = base + '/models/' + namespaceUp + 's.js';
  (0, _log.info)('create', 'model ' + namespaceUp + 's');
  var fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'models create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  /********** services ***********/
  template = (0, _utils.getTemplate)('services', 'client');
  source = template({ namespace: namespace });
  filePath = base + '/services/' + namespaceUp + 's.js';
  (0, _log.info)('create', 'services ' + namespaceUp + 's');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'services create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  /********** routes ***********/
  template = (0, _utils.getTemplate)('routes', 'client');
  source = template({ namespace: namespace });
  filePath = base + '/routes/admin/' + namespaceUp + '.js';
  (0, _log.info)('create', 'routes ' + namespaceUp);
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'routes create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  /********** components ***********/

  //component 创建组件目录
  var componentDirPath = (0, _path.join)(dest, base + '/components/' + namespaceUp + 's');
  if (!(0, _fs.existsSync)(componentDirPath)) {
    (0, _fs.mkdirSync)(componentDirPath);
  }

  template = (0, _utils.getTemplate)('componentsList', 'client');
  var datas = {
    namespace: namespace,
    rows: rows
  };
  source = template(datas);
  filePath = base + '/components/' + namespaceUp + 's/' + namespaceUp + 'List.js';
  (0, _log.info)('create', 'components ' + namespaceUp + 'List');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'components create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  // console.log('modal');
  template = (0, _utils.getTemplate)('componentsModal', 'client');
  source = template(datas);
  filePath = base + '/components/' + namespaceUp + 's/' + namespaceUp + 'Modal.js';
  (0, _log.info)('create', 'components ' + namespaceUp + 'Modal');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'components create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  // console.log('Search');
  template = (0, _utils.getTemplate)('componentsSearch', 'client');
  source = template({ namespace: namespace });
  filePath = base + '/components/' + namespaceUp + 's/' + namespaceUp + 'Search.js';
  (0, _log.info)('create', 'components ' + namespaceUp + 'Search');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'components create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  /********** Mock data files ***********/
  template = (0, _utils.getTemplate)('mock.data', 'client');
  source = template(datas);
  filePath = './mock/' + namespaceUp + 's.js';
  (0, _log.info)('create', 'mock files ' + namespaceUp + 's');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'mock create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);
}

function generateIndexjs(payload, gtype) {
  var dest = process.cwd() + (gtype === 'c' ? '' : '-cli');
  var template = (0, _utils.getTemplate)('index', 'client');
  var source = template({ payload: payload });
  var filePath = './src/index.js';
  (0, _log.info)('create', 'indexjs file');
  var fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'index create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  //router.js init
  template = (0, _utils.getTemplate)('router.js', 'client');
  source = template({ payload: payload });
  filePath = './src/router.js';
  (0, _log.info)('create', 'routerjs file');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'router create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  //leftmenu.js init
  template = (0, _utils.getTemplate)('leftmenus', 'client');
  source = template({ payload: payload });
  filePath = './src/utils/menu.js';
  (0, _log.info)('create', 'menus file');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'menus create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);
};

function generaterMakefile(payload, dest) {
  var urlsConfig = {
    dbname: payload[0],
    url: payload[1],
    port: payload[4] ? payload[4] : 3306,
    dbusername: payload[2],
    dbpassword: payload[3]
  };
  var template = (0, _utils.getTemplate)('makefile', 'client');
  var source = template(urlsConfig);
  var filePath = 'Makefile';
  (0, _log.info)('create', filePath);
  var fileFullPath = (0, _path.join)(dest, filePath);
  // assert(!existsSync(filePath), 'makefile create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);
};