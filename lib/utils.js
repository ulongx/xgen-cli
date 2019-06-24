'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplate = getTemplate;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.removeFile = removeFile;

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _handerHelper = require('./handerHelper');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _fs = require('fs');

var _fsExtra = require('fs-extra');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTemplate(name, type, themeName) {

  (0, _handerHelper.handlebarsInit)();

  var filePath = themeName ? (0, _path.join)(__dirname, '../boilerplates/handlebars/' + type + '/' + themeName + '/' + name + '.handlebars') : (0, _path.join)(__dirname, '../boilerplates/handlebars/' + type + '/' + name + '.handlebars');
  (0, _assert2.default)((0, _fs.existsSync)(filePath), 'getTemplate: file ' + name + ' not fould');
  var source = (0, _fs.readFileSync)(filePath, 'utf-8');
  return _handlebars2.default.compile(source);
}

function readFile(filePath) {
  return (0, _fs.readFileSync)(filePath, 'utf-8');
}

function writeFile(filePath, source) {
  (0, _fsExtra.outputFileSync)(filePath, source, 'utf-8');
}

function removeFile(filePath) {
  (0, _fsExtra.removeSync)(filePath);
}