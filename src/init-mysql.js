import { info, error, success } from './log';
import { generateServer, generaterService } from './generate-server';
import { generateClient, generateIndexjs } from './generate-client';
var mysql = require('mysql');
import camelize from 'camelizejs';


function initmysql(args, type, gtype) {
  const mysqlConfig = {
    host     : args[4],
    port     : args[7]? args[7]:3306,
    user     : args[5],
    password : args[6],
    database : 'information_schema'
  }
  const dbname = args[3];
  const packageName = args[1];
  const themeName = args[0];
  const tables = [];

  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  connection.query('select table_schema,table_name,table_comment from TABLES where table_schema=?',[dbname], function(err, rows) {
    if (err){
      error(err);
      connection.end();
      process.exit(1);
    };
    for (var i in rows) {
      const tablename = rows[i].table_name;
      const tablecomment = rows[i].table_comment;
      tables.push({tablename, tablecomment, dbname,packagename:packageName});
      seachFieldsGenerate(connection, dbname, tablename, tablecomment, type, gtype, packageName, themeName);
       if (i == rows.length-1) {
         connection.end();
       }
    };
    if (type === 'client') {
      generateIndexjs(tables, gtype);
    }
    if (type === 'server') {
      generaterService(tables, dbname, packageName, themeName);
    }
  });
}

function seachFieldsGenerate(connection, dbname, tablename, tablecomment, type, gtype, packageName, themeName) {
  connection.query("select column_name,data_type,column_comment,is_nullable from columns where table_schema=? and table_name=?",[dbname,tablename], function(err, results) {
     if (err){
       error(err);
       connection.end();
       process.exit(1);
     };
     if (type === 'client') {
       generateClient(results, tablename, gtype);
     }else if(type === 'server'){
       generateServer(results, tablename, tablecomment, dbname, packageName, themeName);
     }
   });
}

export default initmysql;
