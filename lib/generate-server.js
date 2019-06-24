'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateServer = generateServer;
exports.generaterConfig = generaterConfig;
exports.generaterMakefile = generaterMakefile;
exports.generaterService = generaterService;

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
* 生成server端代码
* create by ulongx on 2016/12/01
*/
function generateServer(rows, tablename, tablecomment, dbname, packageName, themeName) {
  var dest = process.cwd();
  var base = 'src/main';
  var package_name = packageName ? packageName.replace(/\./g, '/') : 'com/mapath/' + dbname;
  var java_base = base + '/java/' + package_name;
  var html_base = base + '/resources/templates';

  var datas = {
    tablename: tablename,
    rows: rows,
    currentdate: new Date(),
    tablecomment: tablecomment,
    packagename: packageName
  };

  var tablenameUp = (0, _camelizejs2.default)(tablename);

  /********* Model ***********/
  var template = (0, _utils.getTemplate)('model', 'server');
  var source = template(datas);
  var filePath = java_base + '/model/' + tablenameUp + '.java';
  (0, _log.info)('create', 'model ' + tablenameUp);
  var fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);

  /********* Mapper.xml ***********/
  template = (0, _utils.getTemplate)('mapper.xml', 'server');
  source = template(datas);
  filePath = java_base + '/mapper/' + tablenameUp + 'Mapper.xml';
  (0, _log.info)('create', 'mapper ' + tablenameUp + 'Mapper.xml');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);

  /********* Mapper.java ***********/
  template = (0, _utils.getTemplate)('mapper.java', 'server');
  source = template(datas);
  filePath = java_base + '/mapper/' + tablenameUp + 'Mapper.java';
  (0, _log.info)('create', 'mapper ' + tablenameUp + 'Mapper.java');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);

  /********* Page.java ***********/
  template = (0, _utils.getTemplate)('page.java', 'server');
  source = template(datas);
  filePath = java_base + '/page/' + tablenameUp + 'Page.java';
  (0, _log.info)('create', 'page ' + tablenameUp + 'Page.java');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);

  /********* view Html ***********/
  template = (0, _utils.getTemplate)('views.html', 'server', themeName);
  source = template(datas);
  filePath = html_base + '/' + (0, _camelizejs2.default)(tablename, false) + '.html';
  (0, _log.info)('create', 'html view  ' + tablenameUp + '.java');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);
}

function generaterConfig(payload) {
  var urlsConfig = {
    dbname: payload[3],
    url: payload[4],
    port: payload[7] ? payload[7] : 3306,
    dbusername: payload[5],
    dbpassword: payload[6]
  };
  var dest = process.cwd();

  var base = 'src/main';
  var resources_base = base + '/resources';

  var datas = {
    projname: payload[1].split('.').pop(),
    packagename: payload[1],
    appType: payload[2]
  };

  var template = (0, _utils.getTemplate)('pom.xml', 'server');
  var source = template(datas);
  var filePath = 'pom.xml';
  (0, _log.info)('create', filePath);
  var fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'pom.xml create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  template = (0, _utils.getTemplate)('makefile', 'server');
  source = template(urlsConfig);
  filePath = 'Makefile';
  (0, _log.info)('create', filePath);
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'Makefile create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  template = (0, _utils.getTemplate)('application.yml', 'server');
  source = template(urlsConfig);
  filePath = resources_base + '/application.yml';
  (0, _log.info)('create', 'appconfig application.yml');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);
}

function generaterMakefile(payload) {
  var urlsConfig = {
    dbname: payload[2],
    url: payload[3],
    port: payload[6] ? payload[6] : 3306,
    dbusername: payload[4],
    dbpassword: payload[5]
  };
  var dest = (0, _path.dirname)(process.cwd());
  var template = (0, _utils.getTemplate)('makefile', 'makefile');
  var source = template(urlsConfig);
  var filePath = 'Makefile';
  (0, _log.info)('create', filePath);
  var fileFullPath = (0, _path.join)(dest, filePath);
  // assert(!existsSync(filePath), 'makefile create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);
}

function generaterService(paylaod, dbname, packageName, themeName) {
  var dest = process.cwd();
  var base = 'src/main';
  var package_name = packageName ? packageName.replace(/\./g, '/') : 'com/mapath/' + dbname;
  var java_base = base + '/java/' + package_name;
  var html_base = base + '/resources/templates';
  var datas = {
    rows: paylaod,
    currentdate: new Date(),
    packagename: packageName
  };
  var template = (0, _utils.getTemplate)('service', 'server');
  var source = template(datas);
  var filePath = java_base + '/service/AdminService.java';
  (0, _log.info)('create', 'service AdminService.java');
  var fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);

  template = (0, _utils.getTemplate)('service.impl', 'server');
  source = template(datas);
  filePath = java_base + '/service/impl/AdminServiceImpl.java';
  (0, _log.info)('create', 'service impl AdminServiceIpml.java');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);

  /********* ApiController.java ***********/
  template = (0, _utils.getTemplate)('api.controller', 'server');
  source = template(datas);
  filePath = java_base + '/controller/ApiController.java';
  (0, _log.info)('create', 'controller  ApiController.java');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'controller create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  /********* LoginController.java ***********/
  template = (0, _utils.getTemplate)('LoginController.java', 'server');
  source = template(datas);
  filePath = java_base + '/controller/LoginController.java';
  (0, _log.info)('create', 'controller  LoginController.java');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);

  var utilsfile = ['Constants', 'DateUtil', 'JxlExcelUtil', 'StringUtil', 'RegexUtils', 'ValidatorGroup'];
  utilsfile.forEach(function (item, i) {
    template = (0, _utils.getTemplate)(item + '.java', 'server');
    source = template(datas);
    filePath = java_base + '/utils/' + item + '.java';
    (0, _log.info)('create', 'utils  ' + item + '.java');
    fileFullPath = (0, _path.join)(dest, filePath);
    (0, _utils.writeFile)(fileFullPath, source);
  });

  // utilsfile = ['DataGrid','PageInfo','PageResult','PageSupportPlugin'];
  // utilsfile.forEach(function(item,i) {
  //   template = getTemplate(`${item}.java`,'server');
  //   source = template(datas);
  //   filePath = `${java_base}/utils/pagination/${item}.java`;
  //   info('create', `utils->pagination  ${item}.java`);
  //   fileFullPath = join(dest, filePath);
  //   writeFile(fileFullPath, source);
  // });
  utilsfile = ['App', 'Swagger2'];
  utilsfile.forEach(function (item, i) {
    template = (0, _utils.getTemplate)(item + '.java', 'server');
    source = template(datas);
    filePath = java_base + '/' + item + '.java';
    (0, _log.info)('create', item + '.java');
    fileFullPath = (0, _path.join)(dest, filePath);
    (0, _utils.writeFile)(fileFullPath, source);
  });

  utilsfile = ['ServiceException', 'ExceptionHandler'];
  utilsfile.forEach(function (item, i) {
    template = (0, _utils.getTemplate)(item + '.java', 'server');
    source = template(datas);
    filePath = java_base + '/exception/' + item + '.java';
    (0, _log.info)('create', item + '.java');
    fileFullPath = (0, _path.join)(dest, filePath);
    (0, _utils.writeFile)(fileFullPath, source);
  });

  utilsfile = ['AuthorCheck', 'MvcConfig'];
  utilsfile.forEach(function (item, i) {
    template = (0, _utils.getTemplate)(item + '.java', 'server');
    source = template(datas);
    filePath = java_base + '/config/' + item + '.java';
    (0, _log.info)('create', item + '.java');
    fileFullPath = (0, _path.join)(dest, filePath);
    (0, _utils.writeFile)(fileFullPath, source);
  });

  /********* layout.html ***********/
  template = (0, _utils.getTemplate)('layout.html', 'server', themeName);
  source = template(datas);
  filePath = html_base + '/layout/layout.ftl';
  (0, _log.info)('create', 'layout views layout.ftl');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _utils.writeFile)(fileFullPath, source);
}