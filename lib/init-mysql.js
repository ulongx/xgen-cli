'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _log = require('./log');

var _generateServer = require('./generate-server');

var _generateClient = require('./generate-client');

var _camelizejs = require('camelizejs');

var _camelizejs2 = _interopRequireDefault(_camelizejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');


function initmysql(args, type, gtype) {
  var mysqlConfig = {
    host: args[4],
    port: args[7] ? args[7] : 3306,
    user: args[5],
    password: args[6],
    database: 'information_schema'
  };
  var dbname = args[3];
  var packageName = args[1];
  var themeName = args[0];
  var tables = [];

  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  connection.query('select table_schema,table_name,table_comment from TABLES where table_schema=?', [dbname], function (err, rows) {
    if (err) {
      (0, _log.error)(err);
      connection.end();
      process.exit(1);
    };
    for (var i in rows) {
      var tablename = rows[i].table_name;
      var tablecomment = rows[i].table_comment;
      tables.push({ tablename: tablename, tablecomment: tablecomment, dbname: dbname, packagename: packageName });
      seachFieldsGenerate(connection, dbname, tablename, tablecomment, type, gtype, packageName, themeName);
      if (i == rows.length - 1) {
        connection.end();
      }
    };
    if (type === 'client') {
      (0, _generateClient.generateIndexjs)(tables, gtype);
    }
    if (type === 'server') {
      (0, _generateServer.generaterService)(tables, dbname, packageName, themeName);
    }
  });
}

function seachFieldsGenerate(connection, dbname, tablename, tablecomment, type, gtype, packageName, themeName) {
  connection.query("select column_name,data_type,column_comment,is_nullable from columns where table_schema=? and table_name=?", [dbname, tablename], function (err, results) {
    if (err) {
      (0, _log.error)(err);
      connection.end();
      process.exit(1);
    };
    if (type === 'client') {
      (0, _generateClient.generateClient)(results, tablename, gtype);
    } else if (type === 'server') {
      (0, _generateServer.generateServer)(results, tablename, tablecomment, dbname, packageName, themeName);
    }
  });
}

exports.default = initmysql;
module.exports = exports['default'];