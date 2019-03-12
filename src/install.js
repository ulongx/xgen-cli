import which from 'which';

function runCmd(cmd, args, fn) {
  args = args || [];
  var runner = require('child_process').spawn(cmd, args, {
    // keep color
    stdio: "inherit"
  });
  runner.on('close', function (code) {
    if (fn) {
      fn(code);
    }
  });
}

function findNpm() {
  var npms = ['tnpm', 'cnpm', 'npm'];
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {
    }
  }
  throw new Error('please install npm');
}

export function clientInstall(done) {
  const npm = findNpm();
  runCmd(which.sync(npm), ['install'], function () {
    runCmd(which.sync(npm), ['install', 'dva', '--save'], function () {
      console.log(npm + ' install end');
      done();
    });
  });
};

function findMvn() {
    try {
      which.sync('mvn');
      console.log('use maven: mvn');
      return 'mvn';
    } catch (e) {
    }
  throw new Error('please install maven');
}

export function sereverInstall(done) {
  const mvn = findMvn();
  runCmd(which.sync(mvn), ['compile'], function () {
    console.log(mvn + ' compile end');
    done();
  });
};
