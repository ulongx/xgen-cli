import { join, basename } from 'path';
import vfs from 'vinyl-fs';
import { renameSync, rename } from 'fs';
import through from 'through2';
import { sync as emptyDir } from 'empty-dir';
import { info, error, success } from './log';
import { generaterConfig, generaterMakefile } from './generate-server';
import { sereverInstall } from './install';

function initserver({args,install},type,themes) {
  info('Mysql',args);

  const cwd_server = join(__dirname, '../boilerplates', 'server',themes);

  //当前目录下
  const dest = process.cwd();
  const serverName = basename(dest);

  if (!emptyDir(dest)) {
    error('当前目录非空，请在一个空的目录里面执行命令!');
    process.exit(1);
  }

  info('server at',dest);
  console.log();

  let paramArgs = args;
  if (themes === 'default') {
    paramArgs.unshift('default');
  }

  vfs.src(['**/*', '!node_modules/**/*'], {cwd: cwd_server, cwdbase: true, dot: true})
    .pipe(template(dest, cwd_server))
    .pipe(vfs.dest(dest))
    .on('end', function() {
      info('package', args[1]);
      require('./init-mysql')(paramArgs,'server');
      info('rename', 'gitignore -> .gitignore');
      renameSync(join(dest, 'gitignore'), join(dest, '.gitignore'));
      generaterConfig(paramArgs);
        //generaterMakefile(args);
        // if (type === 's') {
        //   if (install) {
        //     info('run', 'mvn clean compile');
        //     sereverInstall(printSuccess);
        //   } else {
        //      printSuccess();
        //   }
        // }
      // })
    }).resume();

    function printSuccess() {
      success(`
        Success! Created ${serverName} at ${dest}.

        在该目录中，您可以运行几个命令:
        * mvn clean compile: 编译打包应用程序..
        * mvn clean install: 安装应用程序包.
        * mvn tomcat:run: 运行应用程序.

        我们建议你首先输入:
        cd ${dest}
        mvn tomcat:run

        工作愉快,ulongx!`);
    }
    return true;
}


function template(dest, cwd) {
  return through.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }
    info('create', file.path.replace(cwd + '/', ''));
    this.push(file);
    cb();
  });
}

export default initserver;
