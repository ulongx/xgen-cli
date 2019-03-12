import {
  getTemplate,
  writeFile,
  readFile,
  removeFile,
} from './utils';
import { existsSync, mkdirSync } from 'fs';
import { info, error, success } from './log';
import assert from 'assert';
import { join } from 'path';
import camelize from 'camelizejs';


/**
* 生产antd client端代码
* create by ulongx on 2016/12/01
*/
export function generateClient(rows, namespace, gtype) {
  assert(namespace, '缺少 namespace');
  //当前目录
  const dest = process.cwd()+(gtype === 'c'? '':'-cli');
  const base = 'src';

  var namespaceUp = camelize(namespace,false);

  /********** model ***********/
  var template = getTemplate('models','client');
  var source = template({namespace});
  var filePath = `${base}/models/${namespaceUp}s.js`;
  info('create', `model ${namespaceUp}s`);
  var fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'models create: file exists');
  writeFile(fileFullPath, source);


  /********** services ***********/
  template = getTemplate('services','client');
  source = template({namespace});
  filePath = `${base}/services/${namespaceUp}s.js`;
  info('create', `services ${namespaceUp}s`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'services create: file exists');
  writeFile(fileFullPath, source);

  /********** routes ***********/
  template = getTemplate('routes','client');
  source = template({namespace});
  filePath = `${base}/routes/admin/${namespaceUp}.js`;
  info('create', `routes ${namespaceUp}`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'routes create: file exists');
  writeFile(fileFullPath, source);

  /********** components ***********/

  //component 创建组件目录
  const componentDirPath = join(dest, `${base}/components/${namespaceUp}s`);
  if (!existsSync(componentDirPath)) {
    mkdirSync(componentDirPath);
  }

  template = getTemplate('componentsList','client');
  const datas = {
    namespace: namespace,
    rows:rows
  }
  source = template(datas);
  filePath = `${base}/components/${namespaceUp}s/${namespaceUp}List.js`;
  info('create', `components ${namespaceUp}List`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'components create: file exists');
  writeFile(fileFullPath, source);

  // console.log('modal');
  template = getTemplate('componentsModal','client');
  source = template(datas);
  filePath = `${base}/components/${namespaceUp}s/${namespaceUp}Modal.js`;
  info('create', `components ${namespaceUp}Modal`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'components create: file exists');
  writeFile(fileFullPath, source);

  // console.log('Search');
  template = getTemplate('componentsSearch','client');
  source = template({namespace});
  filePath = `${base}/components/${namespaceUp}s/${namespaceUp}Search.js`;
  info('create', `components ${namespaceUp}Search`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'components create: file exists');
  writeFile(fileFullPath, source);

  /********** Mock data files ***********/
  template = getTemplate('mock.data','client');
  source = template(datas);
  filePath = `./mock/${namespaceUp}s.js`;
  info('create', `mock files ${namespaceUp}s`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'mock create: file exists');
  writeFile(fileFullPath, source);

}


export function generateIndexjs(payload, gtype) {
  const dest = process.cwd()+(gtype === 'c' ? '':'-cli');
  var template = getTemplate('index','client');
  var source = template({payload});
  var filePath = './src/index.js';
  info('create', 'indexjs file');
  var fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'index create: file exists');
  writeFile(fileFullPath, source);

  //router.js init
  template = getTemplate('router.js','client');
  source = template({payload});
  filePath = './src/router.js';
  info('create', 'routerjs file');
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'router create: file exists');
  writeFile(fileFullPath, source);

  //leftmenu.js init
  template = getTemplate('leftmenus','client');
  source = template({payload});
  filePath = './src/utils/menu.js';
  info('create', 'menus file');
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'menus create: file exists');
  writeFile(fileFullPath, source);
};

export function generaterMakefile(payload,dest) {
  const urlsConfig = {
    dbname: payload[0],
    url: payload[1],
    port:payload[4]? payload[4]:3306,
    dbusername:payload[2],
    dbpassword:payload[3]
  }
  var template = getTemplate('makefile','client');
  var source = template(urlsConfig);
  var filePath = 'Makefile';
  info('create', filePath);
  var fileFullPath = join(dest, filePath);
  // assert(!existsSync(filePath), 'makefile create: file exists');
  writeFile(fileFullPath, source);
};
