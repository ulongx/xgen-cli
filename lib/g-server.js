'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _fs = require('fs');

var _log = require('./log');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _camelizejs = require('camelizejs');

var _camelizejs2 = _interopRequireDefault(_camelizejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');

function gserver(args) {
  console.log(args);
  //当前目录下
  var packageName = args[3];
  var dest = process.cwd();
  var serverName = (0, _path.basename)(dest) || 'xbuild';
  var tableName = args[2].replace(new RegExp(/(,)/g), '');
  var typeName = args[1];
  var themeName = args[0];

  connectMysqlFieldsGenerate(args, function (results) {
    var datas = {
      tablename: tableName,
      rows: results.rows,
      currentdate: new Date(),
      tablecomment: results.tablecomment,
      packagename: packageName
    };
    generates(typeName, datas, dest, themeName);
  });
}

function generates(type, datas, dest, themeName) {
  //const base = 'src/main';
  //const java_base = `${base}/java/com/mapath/${serverNameParam}`;
  // const mapper_base = `${base}/resources/mapper`;
  var java_base = datas.packagename;
  try {
    switch (type) {
      case 'model':
        (function () {
          /********* Model ***********/
          var template = (0, _utils.getTemplate)('model', 'server');
          var source = template(datas);
          var filePath = java_base + '/model/' + (0, _camelizejs2.default)(datas.tablename) + '.java';
          (0, _log.info)('create', 'model ' + (0, _camelizejs2.default)(datas.tablename));
          var fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);

          /********* Mapper.xml ***********/
          template = (0, _utils.getTemplate)('mapper.xml', 'server');
          source = template(datas);
          filePath = java_base + '/mapper/' + (0, _camelizejs2.default)(datas.tablename) + 'Mapper.xml';
          (0, _log.info)('create', 'mapper xml ' + (0, _camelizejs2.default)(datas.tablename) + 'Mapper.xml');
          fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);

          /********* Mapper.java ***********/
          template = (0, _utils.getTemplate)('mapper.java', 'server');
          source = template(datas);
          filePath = java_base + '/mapper/' + (0, _camelizejs2.default)(datas.tablename) + 'Mapper.java';
          (0, _log.info)('create', 'mapper ' + (0, _camelizejs2.default)(datas.tablename) + 'Mapper.java');
          fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);

          /********* Page.java ***********/
          template = (0, _utils.getTemplate)('page.java', 'server');
          source = template(datas);
          filePath = java_base + '/page/' + (0, _camelizejs2.default)(datas.tablename) + 'Page.java';
          (0, _log.info)('create', 'page ' + (0, _camelizejs2.default)(datas.tablename) + 'Page.java');
          fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);

          /********* Service.java ***********/
          template = (0, _utils.getTemplate)('service.single', 'server');
          source = template(datas);
          filePath = java_base + '/service/' + (0, _camelizejs2.default)(datas.tablename) + 'Service.java';
          (0, _log.info)('create', 'service ' + (0, _camelizejs2.default)(datas.tablename) + 'Service.java');
          fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);

          /********* ServiceImpl.java ***********/
          template = (0, _utils.getTemplate)('service.impl.single', 'server');
          source = template(datas);
          filePath = java_base + '/service/impl/' + (0, _camelizejs2.default)(datas.tablename) + 'ServiceImpl.java';
          (0, _log.info)('create', 'service impl ' + (0, _camelizejs2.default)(datas.tablename) + 'ServiceImpl.java');
          fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);

          /********* views.html ***********/
          template = (0, _utils.getTemplate)('views.html', 'server', themeName);
          source = template(datas);
          filePath = java_base + '/html/' + (0, _camelizejs2.default)(datas.tablename, false) + '.html';
          (0, _log.info)('create', 'html ' + (0, _camelizejs2.default)(datas.tablename, false) + '.html');
          fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);

          /********* controller.java ***********/
          template = (0, _utils.getTemplate)('api.controller.single', 'server');
          source = template(datas);
          filePath = java_base + '/controller/' + (0, _camelizejs2.default)(datas.tablename) + 'Controller.java';
          (0, _log.info)('create', 'controller ' + (0, _camelizejs2.default)(datas.tablename) + 'Controller.java');
          fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);
        })();
        break;
      case 'service':
        (function () {
          var template = (0, _utils.getTemplate)('service.single', 'server');
          var source = template(datas);
          var filePath = java_base + '/service/' + (0, _camelizejs2.default)(datas.tablename) + 'Service.java';
          (0, _log.info)('create', 'service ' + (0, _camelizejs2.default)(datas.tablename) + 'Service.java');
          var fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);

          template = (0, _utils.getTemplate)('service.impl.single', 'server');
          source = template(datas);
          filePath = java_base + '/service/impl/' + (0, _camelizejs2.default)(datas.tablename) + 'ServiceImpl.java';
          (0, _log.info)('create', 'service impl ' + (0, _camelizejs2.default)(datas.tablename) + 'ServiceIpml.java');
          fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);
        })();
        break;
      case 'html':
        (function () {
          var template = (0, _utils.getTemplate)('views.html', 'server', themeName);
          var source = template(datas);
          var filePath = java_base + '/html/' + (0, _camelizejs2.default)(datas.tablename) + '.html';
          (0, _log.info)('create', 'html ' + (0, _camelizejs2.default)(datas.tablename) + '.html');
          var fileFullPath = (0, _path.join)(dest, filePath);
          (0, _utils.writeFile)(fileFullPath, source);
        })();
        break;
      default:
        (0, _log.error)('ERROR: \u672A\u77E5\u7684 type ' + type);
        break;
    }
  } catch (e) {
    (0, _log.error)(e.stack);
  }
}

function connectMysqlFieldsGenerate(args, callback) {
  var mysqlConfig = {
    host: args[5],
    port: args[8] ? args[8] : 3306,
    user: args[6],
    password: args[7],
    database: 'information_schema'
  };
  var types = args[1];
  var tables = [];
  var dbname = args[4];
  var packagename = args[3];
  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  connection.query('select table_schema,table_name,table_comment from TABLES where table_schema=? and table_name in (?)', [dbname, args[2].split(',')], function (err, rows) {
    if (err) {
      (0, _log.error)(err);
      connection.end();
      process.exit(1);
    };
    if (rows.length == 0) {
      console.log('table is not found');
      connection.end();
      process.exit(1);
    }
    for (var i in rows) {
      var tablename = rows[i].table_name;
      var tablecomment = rows[i].table_comment;
      tables.push({ tablename: tablename, tablecomment: tablecomment, packagename: packagename });
      if (types === 'model') {
        seachFieldsGenerate(connection, dbname, tablename, tablecomment, callback);
      }
      if (i == rows.length - 1) {
        connection.end();
      }
    };
    if (types === 'service') {
      callback({ rows: tables });
    }
  });
}

function seachFieldsGenerate(connection, dbname, tablename, tablecomment, callback) {
  connection.query("select column_name,data_type,column_comment from columns where table_schema=? and table_name=?", [dbname, tablename], function (err, rows) {
    if (err) {
      (0, _log.error)(err);
      connection.end();
      process.exit(1);
    };
    callback({ tablecomment: tablecomment, rows: rows });
  });
}

// function upFisrtCase(nstr) {
//   var nstrUp = nstr.toLowerCase();
//   nstrUp = nstrUp.replace(/\b(\w)|\s(\w)/g,function(m){
//    return m.toUpperCase();
//   });
//   return nstrUp;
// }

exports.default = gserver;
module.exports = exports['default'];