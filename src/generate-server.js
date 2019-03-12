import {
  getTemplate,
  writeFile,
  readFile,
  removeFile,
} from './utils';
import { existsSync, unlinkSync } from 'fs';
import { info, error, success } from './log';
import assert from 'assert';
import { join, dirname } from 'path';
import camelize from 'camelizejs';

/**
* 生成server端代码
* create by ulongx on 2016/12/01
*/
export function generateServer(rows, tablename, tablecomment, dbname, packageName, themeName) {
  const dest = process.cwd();
  const base = 'src/main';
  const package_name = packageName ? packageName.replace(/\./g,'/') : `com/mapath/${dbname}`;
  const java_base = `${base}/java/${package_name}`;
  const html_base = `${base}/resources/templates`

  const datas = {
    tablename: tablename,
    rows:rows,
    currentdate: new Date(),
    tablecomment: tablecomment,
    packagename: packageName
  }

  var tablenameUp = camelize(tablename);

  /********* Model ***********/
  var template = getTemplate('model','server');
  var source = template(datas);
  var filePath = `${java_base}/model/${tablenameUp}.java`;
  info('create', `model ${tablenameUp}`);
  var fileFullPath = join(dest, filePath)
  writeFile(fileFullPath, source);

  /********* Mapper.xml ***********/
  template = getTemplate('mapper.xml','server');
  source = template(datas);
  filePath = `${java_base}/mapper/${tablenameUp}Mapper.xml`;
  info('create', `mapper ${tablenameUp}Mapper.xml`);
  fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);

  /********* Mapper.java ***********/
  template = getTemplate('mapper.java','server');
  source = template(datas);
  filePath = `${java_base}/mapper/${tablenameUp}Mapper.java`;
  info('create', `mapper ${tablenameUp}Mapper.java`);
  fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);

  /********* Page.java ***********/
  template = getTemplate('page.java','server');
  source = template(datas);
  filePath = `${java_base}/page/${tablenameUp}Page.java`;
  info('create', `page ${tablenameUp}Page.java`);
  fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);

  /********* view Html ***********/
  template = getTemplate('views.html','server',themeName);
  source = template(datas);
  filePath = `${html_base}/${camelize(tablename,false)}.html`;
  info('create', `html view  ${tablenameUp}.java`);
  fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);
}

export function generaterConfig(payload) {
  const urlsConfig = {
    dbname: payload[3],
    url: payload[4],
    port:payload[7]? payload[7]:3306,
    dbusername:payload[5],
    dbpassword:payload[6]
  }
  const dest = process.cwd();

  const base = 'src/main';
  const resources_base = `${base}/resources`;

  const datas = {
    projname:payload[1].split('.').pop(),
    packagename: payload[1],
    appType: payload[2]
  }

  var template = getTemplate('pom.xml','server');
  var source = template(datas);
  var filePath = 'pom.xml';
  info('create', filePath);
  var fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'pom.xml create: file exists');
  writeFile(fileFullPath, source);

  template = getTemplate('makefile','server');
  source = template(urlsConfig);
  filePath = 'Makefile';
  info('create', filePath);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'Makefile create: file exists');
  writeFile(fileFullPath, source);

  template = getTemplate('application.yml','server');
  source = template(urlsConfig);
  filePath = `${resources_base}/application.yml`;
  info('create', 'appconfig application.yml');
  fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);

}

export function generaterMakefile(payload) {
  const urlsConfig = {
    dbname: payload[2],
    url: payload[3],
    port:payload[6]? payload[6]:3306,
    dbusername:payload[4],
    dbpassword:payload[5]
  }
  const dest = dirname(process.cwd());
  var template = getTemplate('makefile','makefile');
  var source = template(urlsConfig);
  var filePath = 'Makefile';
  info('create', filePath);
  var fileFullPath = join(dest, filePath);
  // assert(!existsSync(filePath), 'makefile create: file exists');
  writeFile(fileFullPath, source);
}

export function generaterService(paylaod, dbname, packageName, themeName) {
  const dest = process.cwd();
  const base = 'src/main';
  const package_name = packageName ? packageName.replace(/\./g,'/') : `com/mapath/${dbname}`;
  const java_base = `${base}/java/${package_name}`;
  const html_base = `${base}/resources/templates`
  const datas = {
    rows:paylaod,
    currentdate: new Date(),
    packagename:packageName,
  }
  var template = getTemplate('service','server');
  var source = template(datas);
  var filePath = `${java_base}/service/AdminService.java`;
  info('create', `service AdminService.java`);
  var fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);

  template = getTemplate('service.impl','server');
  source = template(datas);
  filePath = `${java_base}/service/impl/AdminServiceImpl.java`;
  info('create', `service impl AdminServiceIpml.java`);
  fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);

  /********* ApiController.java ***********/
  template = getTemplate('api.controller','server');
  source = template(datas);
  filePath = `${java_base}/controller/ApiController.java`;
  info('create', `controller  ApiController.java`);
  fileFullPath = join(dest, filePath);
  assert(!existsSync(filePath), 'controller create: file exists');
  writeFile(fileFullPath, source);

  /********* LoginController.java ***********/
  template = getTemplate('LoginController.java','server');
  source = template(datas);
  filePath = `${java_base}/controller/LoginController.java`;
  info('create', `controller  LoginController.java`);
  fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);

  var utilsfile = ['Constants','DateUtil','JxlExcelUtil','StringUtil','RegexUtils','ValidatorGroup'];
  utilsfile.forEach(function(item,i) {
    template = getTemplate(`${item}.java`,'server');
    source = template(datas);
    filePath = `${java_base}/utils/${item}.java`;
    info('create', `utils  ${item}.java`);
    fileFullPath = join(dest, filePath);
    writeFile(fileFullPath, source);
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
  utilsfile.forEach(function(item,i) {
    template = getTemplate(`${item}.java`,'server');
    source = template(datas);
    filePath = `${java_base}/${item}.java`;
    info('create', `${item}.java`);
    fileFullPath = join(dest, filePath);
    writeFile(fileFullPath, source);
  });

  utilsfile = ['ServiceException', 'ExceptionHandler'];
  utilsfile.forEach(function(item,i) {
    template = getTemplate(`${item}.java`,'server');
    source = template(datas);
    filePath = `${java_base}/exception/${item}.java`;
    info('create', `${item}.java`);
    fileFullPath = join(dest, filePath);
    writeFile(fileFullPath, source);
  });

  utilsfile = ['AuthorCheck', 'MvcConfig'];
  utilsfile.forEach(function(item,i) {
    template = getTemplate(`${item}.java`,'server');
    source = template(datas);
    filePath = `${java_base}/config/${item}.java`;
    info('create', `${item}.java`);
    fileFullPath = join(dest, filePath);
    writeFile(fileFullPath, source);
  });

  /********* layout.html ***********/
  template = getTemplate('layout.html','server', themeName);
  source = template(datas);
  filePath = `${html_base}/layout/layout.ftl`;
  info('create', `layout views layout.ftl`);
  fileFullPath = join(dest, filePath);
  writeFile(fileFullPath, source);
}
