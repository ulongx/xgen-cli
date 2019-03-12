import {
  getTemplate,
  writeFile,
  readFile,
  removeFile,
} from './utils';
import { existsSync, unlinkSync } from 'fs';
import { info, error, success } from './log';
import assert from 'assert';
import { join, basename } from 'path';
import camelize from 'camelizejs';
var mysql = require('mysql');

function gserver( args ) {
  console.log(args);
  //当前目录下
  const packageName = args[3];
  const dest = process.cwd();
  const serverName = basename(dest) || 'xbuild';
  const tableName = args[2].replace(new RegExp(/(,)/g),'');
  const typeName = args[1];
  const themeName = args[0];

  connectMysqlFieldsGenerate(args,function(results) {
    const datas = {
      tablename: tableName,
      rows:results.rows,
      currentdate: new Date(),
      tablecomment: results.tablecomment,
      packagename: packageName
    }
    generates(typeName, datas, dest, themeName);
  });

}

function generates(type, datas, dest, themeName) {
  //const base = 'src/main';
  //const java_base = `${base}/java/com/mapath/${serverNameParam}`;
  // const mapper_base = `${base}/resources/mapper`;
  const java_base = datas.packagename;
  try {
    switch (type) {
      case 'model':
        (() => {
          /********* Model ***********/
          var template = getTemplate('model','server');
          var source = template(datas);
          var filePath = `${java_base}/model/${camelize(datas.tablename)}.java`;
          info('create', `model ${camelize(datas.tablename)}`);
          var fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);

          /********* Mapper.xml ***********/
          template = getTemplate('mapper.xml','server');
          source = template(datas);
          filePath = `${java_base}/mapper/${camelize(datas.tablename)}Mapper.xml`;
          info('create', `mapper xml ${camelize(datas.tablename)}Mapper.xml`);
          fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);

          /********* Mapper.java ***********/
          template = getTemplate('mapper.java','server');
          source = template(datas);
          filePath = `${java_base}/mapper/${camelize(datas.tablename)}Mapper.java`;
          info('create', `mapper ${camelize(datas.tablename)}Mapper.java`);
          fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);

          /********* Page.java ***********/
          template = getTemplate('page.java','server');
          source = template(datas);
          filePath = `${java_base}/page/${camelize(datas.tablename)}Page.java`;
          info('create', `page ${camelize(datas.tablename)}Page.java`);
          fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);

          /********* Service.java ***********/
          template = getTemplate('service.single','server');
          source = template(datas);
          filePath = `${java_base}/service/${camelize(datas.tablename)}Service.java`;
          info('create', `service ${camelize(datas.tablename)}Service.java`);
          fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);

          /********* ServiceImpl.java ***********/
          template = getTemplate('service.impl.single','server');
          source = template(datas);
          filePath = `${java_base}/service/impl/${camelize(datas.tablename)}ServiceImpl.java`;
          info('create', `service impl ${camelize(datas.tablename)}ServiceImpl.java`);
          fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);

          /********* views.html ***********/
          template = getTemplate('views.html','server', themeName);
          source = template(datas);
          filePath = `${java_base}/html/${camelize(datas.tablename,false)}.html`;
          info('create', `html ${camelize(datas.tablename,false)}.html`);
          fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);

          /********* controller.java ***********/
          template = getTemplate('api.controller.single','server');
          source = template(datas);
          filePath = `${java_base}/controller/${camelize(datas.tablename)}Controller.java`;
          info('create', `controller ${camelize(datas.tablename)}Controller.java`);
          fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);
        })();
        break;
      case 'service':
        (() => {
          var template = getTemplate('service.single','server');
          var source = template(datas);
          var filePath = `${java_base}/service/${camelize(datas.tablename)}Service.java`;
          info('create', `service ${camelize(datas.tablename)}Service.java`);
          var fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);

          template = getTemplate('service.impl.single','server');
          source = template(datas);
          filePath = `${java_base}/service/impl/${camelize(datas.tablename)}ServiceImpl.java`;
          info('create', `service impl ${camelize(datas.tablename)}ServiceIpml.java`);
          fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);
        })();
        break;
      case 'html':
        (() => {
          var template = getTemplate('views.html','server', themeName);
          var source = template(datas);
          var filePath = `${java_base}/html/${camelize(datas.tablename)}.html`;
          info('create', `html ${camelize(datas.tablename)}.html`);
          var fileFullPath = join(dest, filePath);
          writeFile(fileFullPath, source);
        })();
        break;
      default:
        error(`ERROR: 未知的 type ${type}`);
        break;
    }
   } catch (e) {
     error(e.stack);
   }
}

function connectMysqlFieldsGenerate(args,callback) {
  const mysqlConfig = {
    host     : args[5],
    port     : args[8]? args[8]:3306,
    user     : args[6],
    password : args[7],
    database : 'information_schema'
  }
  const types = args[1];
  const tables = [];
  const dbname = args[4];
  const packagename = args[3];
  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  connection.query('select table_schema,table_name,table_comment from TABLES where table_schema=? and table_name in (?)',[dbname,args[2].split(',')], function(err, rows) {
    if (err){
      error(err);
      connection.end();
      process.exit(1);
    };
    if (rows.length == 0) {
      console.log('table is not found');
      connection.end();
      process.exit(1);
    }
    for (var i in rows) {
      const tablename = rows[i].table_name;
      const tablecomment = rows[i].table_comment;
      tables.push({tablename, tablecomment, packagename});
      if(types === 'model'){
        seachFieldsGenerate(connection, dbname, tablename, tablecomment, callback);
      }
      if (i == rows.length-1) {
        connection.end();
      }
    };
    if (types === 'service') {
      callback({rows:tables});
    }

  });
}

function seachFieldsGenerate(connection, dbname, tablename, tablecomment,callback) {
  connection.query("select column_name,data_type,column_comment from columns where table_schema=? and table_name=?",[dbname,tablename], function(err, rows) {
     if (err){
       error(err);
       connection.end();
       process.exit(1);
     };
     callback({tablecomment,rows});
   });
}

// function upFisrtCase(nstr) {
//   var nstrUp = nstr.toLowerCase();
//   nstrUp = nstrUp.replace(/\b(\w)|\s(\w)/g,function(m){
//    return m.toUpperCase();
//   });
//   return nstrUp;
// }

export default gserver;
