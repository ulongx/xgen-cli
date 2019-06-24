'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlebarsInit = handlebarsInit;

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _camelizejs = require('camelizejs');

var _camelizejs2 = _interopRequireDefault(_camelizejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handlebarsInit() {
  _handlebars2.default.registerHelper("switch", function (value, options) {
    this._switch_value_ = value;
    var html = options.fn(this);
    delete this._switch_value_;
    return html;
  });

  _handlebars2.default.registerHelper("case", function (value, options) {
    if (value == this._switch_value_) {
      return options.fn(this);
    }
  });

  _handlebars2.default.registerHelper("toUpCase", function (value, options) {
    return (0, _camelizejs2.default)(value);
  });
  _handlebars2.default.registerHelper("toUpCaseF", function (value, options) {
    return (0, _camelizejs2.default)(value, false);
  });
  _handlebars2.default.registerHelper("eachlist", function (value, options) {
    var ret = '',
        len = value.length,
        citem = {};
    value.forEach(function (item, i) {
      citem = {
        columnname: item.column_name + ' ' + (0, _camelizejs2.default)(item.column_name, false) + (i != len - 1 ? ',' : '')
      };
      ret = ret + options.fn(citem);
    });
    return ret;
  });
  _handlebars2.default.registerHelper("eachlistInst", function (value, options) {
    var ret = '',
        len = value.length,
        citem = {};
    value.forEach(function (item, i) {
      citem = {
        columnname: item.column_name + (i != len - 1 ? ',' : '')
      };
      ret = ret + options.fn(citem);
    });
    return ret;
  });

  _handlebars2.default.registerHelper("eachlistWhere", function (value, options) {
    var ret = '';
    var len = value.length;
    var citem = {};
    value.forEach(function (item, i) {
      citem = {
        content: stringFormatWhereParam(item)
      };
      ret = ret + options.fn(citem);
    });
    return ret;
  });

  _handlebars2.default.registerHelper("eachlistparam", function (value, options) {
    var ret = '',
        len = value.length,
        citem = {};
    value.forEach(function (item, i) {
      citem = {
        columnname: stringFormatUpdateParam(item, len, i)
      };
      ret = ret + options.fn(citem);
    });
    return ret;
  });

  _handlebars2.default.registerHelper("eachlistinsert", function (value, options) {
    var ret = '',
        len = value.length,
        citem = {};
    value.forEach(function (item, i) {
      citem = {
        columnname: '#{' + (0, _camelizejs2.default)(item.column_name, false) + '}' + (i != len - 1 ? ',' : '')
      };
      ret = ret + options.fn(citem);
    });
    return ret;
  });

  _handlebars2.default.registerHelper("listTable", function (value, options) {
    var ret = '',
        citem = {};
    value.forEach(function (item, i) {
      citem = {
        columnname: (0, _camelizejs2.default)(item.column_name, false),
        columncomment: item.column_comment ? item.column_comment : (0, _camelizejs2.default)(item.column_name, false)
      };
      ret = ret + options.fn(citem);
    });
    return ret;
  });

  _handlebars2.default.registerHelper("eachKeywordWhere", function (value, options) {
    var ret = '',
        len = value.length,
        citem = {};
    value.forEach(function (item, i) {
      citem = {
        content: stringFormatKeywordParam(item, len, i)
      };
      ret = ret + options.fn(citem);
    });
    return ret;
  });

  _handlebars2.default.registerHelper("isDelete", function (value, options) {
    var delCloumnName = '';
    value.forEach(function (item, i) {
      if (item.column_name.indexOf('del') > 0) {
        delCloumnName = 't.' + item.column_name + ' = \'0\'';
      }
    });
    return delCloumnName;
  });

  _handlebars2.default.registerHelper('addTwo', function (value) {
    return value + 2;
  });
};

//格式化查询条件参数
function stringFormatWhereParam(item) {
  var pxmlStr = '<if test="' + (0, _camelizejs2.default)(item.column_name, false) + ' != null and ' + (0, _camelizejs2.default)(item.column_name, false) + ' != \'\'">\n                and t.' + item.column_name + ' = trim(#{' + (0, _camelizejs2.default)(item.column_name, false) + '})\n                </if>';
  if (item.data_type == 'date' || item.data_type == 'timestamp' || item.data_type == 'datetime') {
    pxmlStr = '<if test="' + (0, _camelizejs2.default)(item.column_name, false) + ' != null">\n              and t.' + item.column_name + ' = trim(#{' + (0, _camelizejs2.default)(item.column_name, false) + '})\n              </if>';
  }
  return new _handlebars2.default.SafeString(pxmlStr);
}

//格式化更新语句参数
function stringFormatUpdateParam(item, len, i) {
  var pxmlStr = '<if test="' + (0, _camelizejs2.default)(item.column_name, false) + ' != null and ' + (0, _camelizejs2.default)(item.column_name, false) + ' != \'\'">\n                ' + item.column_name + '=#{' + (0, _camelizejs2.default)(item.column_name, false) + '}' + (i != len - 1 ? ',' : '') + '\n                </if>';
  if (item.data_type == 'date' || item.data_type == 'timestamp' || item.data_type == 'datetime') {
    pxmlStr = '<if test="' + (0, _camelizejs2.default)(item.column_name, false) + ' != null">\n              ' + item.column_name + '=#{' + (0, _camelizejs2.default)(item.column_name, false) + '}' + (i != len - 1 ? ',' : '') + '\n              </if>';
  }
  return new _handlebars2.default.SafeString(pxmlStr);
}
//格式化keyword查询条件参数
function stringFormatKeywordParam(item, len, i) {
  var pxmlStr = '(t.' + item.column_name + ' like CONCAT(\'%\',trim(#{keyword}),\'%\'))' + (i != len - 1 ? ' ||' : '');
  if (item.data_type == 'date' || item.data_type == 'timestamp' || item.data_type == 'datetime') {
    pxmlStr = '';
  }
  return new _handlebars2.default.SafeString(pxmlStr);
}