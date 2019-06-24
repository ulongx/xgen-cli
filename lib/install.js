'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clientInstall = clientInstall;
exports.sereverInstall = sereverInstall;

var _which = require('which');

var _which2 = _interopRequireDefault(_which);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      _which2.default.sync(npms[i]);
      console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {}
  }
  throw new Error('please install npm');
}

function clientInstall(done) {
  var npm = findNpm();
  runCmd(_which2.default.sync(npm), ['install'], function () {
    runCmd(_which2.default.sync(npm), ['install', 'dva', '--save'], function () {
      console.log(npm + ' install end');
      done();
    });
  });
};

function findMvn() {
  try {
    _which2.default.sync('mvn');
    console.log('use maven: mvn');
    return 'mvn';
  } catch (e) {}
  throw new Error('please install maven');
}

function sereverInstall(done) {
  var mvn = findMvn();
  runCmd(_which2.default.sync(mvn), ['compile'], function () {
    console.log(mvn + ' compile end');
    done();
  });
};