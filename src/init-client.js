import { join, basename } from 'path';
import vfs from 'vinyl-fs';
import { renameSync } from 'fs';
import through from 'through2';
import { sync as emptyDir } from 'empty-dir';
import { info, error, success } from './log';
import { clientInstall } from './install';
import { generaterMakefile } from './generate-client';

function initcilent({args,install},type) {

  const cwd_cilent = join(__dirname, '../boilerplates', 'client');

  //当前目录下
  const dest = process.cwd()+(type === 'c' ? '':'-cli');

  const clientName = basename(dest);
  const serverName = args[0];

  if (!emptyDir(dest)) {
    error('当前目录非空，请在一个空的目录里面执行命令!');
    process.exit(1);
  }

  console.log(`client at ${dest}.`);
  console.log();

  vfs.src(['**/*', '!node_modules/**/*'], {cwd: cwd_cilent, cwdbase: true, dot: true})
    .pipe(template(dest, cwd_cilent))
    .pipe(vfs.dest(dest))
    .on('end', function() {
      require('./init-mysql')(args,'client',type);
      info('rename', 'gitignore -> .gitignore');
      renameSync(join(dest, 'gitignore'), join(dest, '.gitignore'));
      generaterMakefile(args,dest);
      if (type === 'c') {
        if (install) {
          info('run', 'npm install');
          clientInstall(printSuccess);
        } else {
          printSuccess();
        }
      }
    })
    .resume();

    function printSuccess() {
      success(`
        Success! Created ${clientName} at ${dest}.

        在该目录中，您可以运行几个命令:
        * npm start: 启动开发服务器.
        * npm run build: 编译打包应用程序.
        * npm test: 运行测试.

        我们建议你首先输入:
        cd ${dest}
        npm start

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

export default initcilent;
