import {
  getTemplate,
  writeFile,
  readFile,
  removeFile,
} from './utils';
import { existsSync, unlinkSync, mkdirSync } from 'fs';
import { info, error, success } from './log';
import assert from 'assert';
import { join } from 'path';
var mysql = require('mysql');

function gclient({ args }) {

  //当前目录下
  const dest = process.cwd();
  const type = args[0];
  const tablename = args[1];
  connectMysqlFieldsGenerate(args,function(results) {
    const datas = {
      namespace: tablename,
      rows:results.rows,
      currentdate: new Date(),
      tablecomment: results.tablecomment
    }
    generates(type, datas, tablename, dest);
  });
}

function generates(type, idatas, namespace, dest) {
  const base = 'src';
  try {
    switch (type) {
      case 'model':
        gfiles(base,namespace,type,dest);
        break;
      case 'route':
        gfiles(base,namespace,type,dest);
        break;
      case 'service':
        gfiles(base,namespace,type,dest);
        break;
      case 'component':
        gfilesComponent(base,namespace,dest,idatas);
        break;
      case 'all':
        (() => {
          console.log('generate all client files');
          const types = ['model','route','service'];
          types.forEach((item,i) => {
            gfiles(base,namespace,item,dest);
          });
          gfilesComponent(base,namespace,dest,idatas);
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

function gfiles(base,namespace,type,dest) {
  var template = getTemplate(`${type}s`,'client');
  var source = template({namespace});
  var filePath = (type === 'route') ? `${base}/${type}s/${camelize(namespace,false)}.js` : `${base}/${type}s/${camelize(namespace,false)}.js`;
  info('create', `${type} ${namespace}`);
  var fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), `${type}s create: file exists`);
  writeFile(fileFullPath, source);
  if (type === 'model') {
    console.log(`please copy to indexjs files: app.model(require('./models/${camelize(namespace,false)}'));`);
  }else if (type === 'route') {
    console.log(`please copy to routejs files: import ${camelize(namespace,false)} from './routes/${camelize(namespace,false)}';`);
  }
}

function gfilesComponent(base,namespace,dest,idatas) {
  const componentDirPath = join(dest, `${base}/components/${camelize(namespace,false)}`);
  if (!existsSync(componentDirPath)) {
    mkdirSync(componentDirPath);
  }

  var template = getTemplate('componentsList','client');
  const datas = {
    namespace: namespace,
    rows:idatas.rows
  }
  var source = template(datas);
  var filePath = `${base}/components/${camelize(namespace,false)}s/${camelize(namespace,false)}List.js`;
  info('create', `components ${camelize(namespace,false)}List`);
  var fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'components create: file exists');
  writeFile(fileFullPath, source);

  template = getTemplate('componentsModal','client');
  source = template(datas);
  filePath = `${base}/components/${camelize(namespace,false)}s/${camelize(namespace,false)}Modal.js`;
  info('create', `components ${namespace}Modal`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'components create: file exists');
  writeFile(fileFullPath, source);

  template = getTemplate('componentsSearch','client');
  source = template({namespace});
  filePath = `${base}/components/${camelize(namespace,false)}s/${camelize(namespace,false)}Search.js`;
  info('create', `components ${camelize(namespace,false)}Search`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'components create: file exists');
  writeFile(fileFullPath, source);
}

function connectMysqlFieldsGenerate(args,callback) {
  const mysqlConfig = {
    host     : args[3],
    port     : args[6]? args[6]:3306,
    user     : args[4],
    password : args[5],
    database : 'information_schema'
  }
  const types = args[0];
  const tables = [];
  const dbname = args[2];
  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  connection.query('select table_schema,table_name,table_comment from TABLES where table_schema=? and table_name in (?)',[dbname,args[1].split(',')], function(err, rows) {
    if (err){
      error(err);
      connection.end();
      process.exit(1);
    };
    for (var i in rows) {
      const tablename = rows[i].table_name;
      const tablecomment = rows[i].table_comment;
      tables.push({tablename, tablecomment, dbname});
      if(types === 'component'){
        seachFieldsGenerate(connection, dbname, tablename, tablecomment, callback);
      }
      if (i == rows.length-1) {
        connection.end();
      }
    };
    if (types !== 'component') {
      callback({rows:tables});
    }
    if (rows.length == 0) {
      console.log('table is not found');
      connection.end();
    }
  });
}

function seachFieldsGenerate(connection, dbname, tablename, tablecomment,callback) {
  connection.query("select column_name,data_type,column_comment from columns where column_name <> 'id' and table_schema=? and table_name=?",[dbname,tablename], function(err, rows) {
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

export default gclient;
