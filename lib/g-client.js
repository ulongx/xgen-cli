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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');

function gclient(_ref) {
  var args = _ref.args;


  //当前目录下
  var dest = process.cwd();
  var type = args[0];
  var tablename = args[1];
  connectMysqlFieldsGenerate(args, function (results) {
    var datas = {
      namespace: tablename,
      rows: results.rows,
      currentdate: new Date(),
      tablecomment: results.tablecomment
    };
    generates(type, datas, tablename, dest);
  });
}

function generates(type, idatas, namespace, dest) {
  var base = 'src';
  try {
    switch (type) {
      case 'model':
        gfiles(base, namespace, type, dest);
        break;
      case 'route':
        gfiles(base, namespace, type, dest);
        break;
      case 'service':
        gfiles(base, namespace, type, dest);
        break;
      case 'component':
        gfilesComponent(base, namespace, dest, idatas);
        break;
      case 'all':
        (function () {
          console.log('generate all client files');
          var types = ['model', 'route', 'service'];
          types.forEach(function (item, i) {
            gfiles(base, namespace, item, dest);
          });
          gfilesComponent(base, namespace, dest, idatas);
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

function gfiles(base, namespace, type, dest) {
  var template = (0, _utils.getTemplate)(type + 's', 'client');
  var source = template({ namespace: namespace });
  var filePath = type === 'route' ? base + '/' + type + 's/' + camelize(namespace, false) + '.js' : base + '/' + type + 's/' + camelize(namespace, false) + '.js';
  (0, _log.info)('create', type + ' ' + namespace);
  var fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), type + 's create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);
  if (type === 'model') {
    console.log('please copy to indexjs files: app.model(require(\'./models/' + camelize(namespace, false) + '\'));');
  } else if (type === 'route') {
    console.log('please copy to routejs files: import ' + camelize(namespace, false) + ' from \'./routes/' + camelize(namespace, false) + '\';');
  }
}

function gfilesComponent(base, namespace, dest, idatas) {
  var componentDirPath = (0, _path.join)(dest, base + '/components/' + camelize(namespace, false));
  if (!(0, _fs.existsSync)(componentDirPath)) {
    (0, _fs.mkdirSync)(componentDirPath);
  }

  var template = (0, _utils.getTemplate)('componentsList', 'client');
  var datas = {
    namespace: namespace,
    rows: idatas.rows
  };
  var source = template(datas);
  var filePath = base + '/components/' + camelize(namespace, false) + 's/' + camelize(namespace, false) + 'List.js';
  (0, _log.info)('create', 'components ' + camelize(namespace, false) + 'List');
  var fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'components create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  template = (0, _utils.getTemplate)('componentsModal', 'client');
  source = template(datas);
  filePath = base + '/components/' + camelize(namespace, false) + 's/' + camelize(namespace, false) + 'Modal.js';
  (0, _log.info)('create', 'components ' + namespace + 'Modal');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'components create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);

  template = (0, _utils.getTemplate)('componentsSearch', 'client');
  source = template({ namespace: namespace });
  filePath = base + '/components/' + camelize(namespace, false) + 's/' + camelize(namespace, false) + 'Search.js';
  (0, _log.info)('create', 'components ' + camelize(namespace, false) + 'Search');
  fileFullPath = (0, _path.join)(dest, filePath);
  (0, _assert2.default)(!(0, _fs.existsSync)(filePath), 'components create: file exists');
  (0, _utils.writeFile)(fileFullPath, source);
}

function connectMysqlFieldsGenerate(args, callback) {
  var mysqlConfig = {
    host: args[3],
    port: args[6] ? args[6] : 3306,
    user: args[4],
    password: args[5],
    database: 'information_schema'
  };
  var types = args[0];
  var tables = [];
  var dbname = args[2];
  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  connection.query('select table_schema,table_name,table_comment from TABLES where table_schema=? and table_name in (?)', [dbname, args[1].split(',')], function (err, rows) {
    if (err) {
      (0, _log.error)(err);
      connection.end();
      process.exit(1);
    };
    for (var i in rows) {
      var tablename = rows[i].table_name;
      var tablecomment = rows[i].table_comment;
      tables.push({ tablename: tablename, tablecomment: tablecomment, dbname: dbname });
      if (types === 'component') {
        seachFieldsGenerate(connection, dbname, tablename, tablecomment, callback);
      }
      if (i == rows.length - 1) {
        connection.end();
      }
    };
    if (types !== 'component') {
      callback({ rows: tables });
    }
    if (rows.length == 0) {
      console.log('table is not found');
      connection.end();
    }
  });
}

function seachFieldsGenerate(connection, dbname, tablename, tablecomment, callback) {
  connection.query("select column_name,data_type,column_comment from columns where column_name <> 'id' and table_schema=? and table_name=?", [dbname, tablename], function (err, rows) {
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

exports.default = gclient;
module.exports = exports['default'];