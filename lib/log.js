'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
exports.error = error;
exports.success = success;

var _leftPad = require('left-pad');

var _leftPad2 = _interopRequireDefault(_leftPad);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info(type, message) {
  console.log(_chalk2.default.green.bold((0, _leftPad2.default)(type, 12)) + '  ' + message);
}

function error(message) {
  console.error(_chalk2.default.red(message));
}

function success(message) {
  console.error(_chalk2.default.green(message));
}