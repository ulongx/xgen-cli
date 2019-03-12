import Handlebars from 'handlebars';
import camelize from 'camelizejs';


export function handlebarsInit() {
  Handlebars.registerHelper("switch", function(value, options) {
    this._switch_value_ = value;
    var html = options.fn(this);
    delete this._switch_value_;
    return html;
  });

  Handlebars.registerHelper("case", function(value, options) {
    if (value == this._switch_value_) {
      return options.fn(this);
    }
  });

  Handlebars.registerHelper("toUpCase", function(value, options) {
     return camelize(value);
  });
  Handlebars.registerHelper("toUpCaseF", function(value, options) {
     return camelize(value,false);
  });
  Handlebars.registerHelper("eachlist", function(value, options) {
     var ret = '', len = value.length, citem = {};
     value.forEach(function(item,i) {
       citem = {
         columnname:item.column_name +' '+camelize(item.column_name,false) + (i != (len - 1)? ',':'')
       }
       ret = ret + options.fn(citem);
     });
     return ret;
  });
  Handlebars.registerHelper("eachlistInst", function(value, options) {
    var ret = '', len = value.length, citem = {};
     value.forEach(function(item,i) {
       citem = {
         columnname:item.column_name + (i != (len - 1)? ',':'')
       }
       ret = ret + options.fn(citem);
     });
     return ret;
  });

  Handlebars.registerHelper("eachlistWhere", function(value, options) {
     var ret = '';
     var len = value.length;
     var citem = {};
     value.forEach(function(item,i) {
         citem = {
           content: stringFormatWhereParam(item)
         }
       ret = ret + options.fn(citem);
     });
     return ret;
  });

  Handlebars.registerHelper("eachlistparam", function(value, options) {
     var ret = '', len = value.length, citem = {};
     value.forEach(function(item,i) {
       citem = {
         columnname: stringFormatUpdateParam(item, len, i)
       }
       ret = ret + options.fn(citem);
     });
     return ret;
  });

  Handlebars.registerHelper("eachlistinsert", function(value, options) {
     var ret = '', len = value.length, citem = {};
     value.forEach(function(item,i) {
       citem = {
         columnname:`#{${camelize(item.column_name,false)}}`+ (i != (len - 1)? ',':'')
       }
       ret = ret + options.fn(citem);
     });
     return ret;
  });

  Handlebars.registerHelper("listTable", function(value, options) {
     var ret = '', citem = {};
     value.forEach(function(item,i) {
       citem = {
         columnname:camelize(item.column_name,false),
         columncomment:item.column_comment? item.column_comment : camelize(item.column_name,false),
       }
       ret = ret + options.fn(citem);
     });
     return ret;
  });

  Handlebars.registerHelper("eachKeywordWhere", function(value, options) {
    var ret = '', len = value.length, citem = {};
     value.forEach(function(item,i) {
         citem = {
           content: stringFormatKeywordParam(item, len, i)
         }
       ret = ret + options.fn(citem);
     });
     return ret;
  });

  Handlebars.registerHelper("isDelete", function(value, options) {
      var delCloumnName = '';
      value.forEach(function(item,i) {
        if (item.column_name.indexOf('del') > 0) {
          delCloumnName = `t.${item.column_name} = '0'`
        }
      });
     return delCloumnName;
  });

  Handlebars.registerHelper('addTwo', function (value) {
    return (value + 2);
  });
};

//格式化查询条件参数
function stringFormatWhereParam(item) {
  var pxmlStr = `<if test="${camelize(item.column_name,false)} != null and ${camelize(item.column_name,false)} != ''">
                and t.${item.column_name} = trim(#{${camelize(item.column_name,false)}})
                </if>`;
  if (item.data_type == 'date' || item.data_type == 'timestamp' || item.data_type == 'datetime') {
    pxmlStr = `<if test="${camelize(item.column_name,false)} != null">
              and t.${item.column_name} = trim(#{${camelize(item.column_name,false)}})
              </if>`;
  }
  return new Handlebars.SafeString(pxmlStr);
}

//格式化更新语句参数
function stringFormatUpdateParam(item, len, i) {
  var pxmlStr = `<if test="${camelize(item.column_name,false)} != null and ${camelize(item.column_name,false)} != ''">
                ${item.column_name}=#{${camelize(item.column_name,false)}}${(i != (len - 1)? ',':'')}
                </if>`;
  if (item.data_type == 'date' || item.data_type == 'timestamp' || item.data_type == 'datetime') {
    pxmlStr = `<if test="${camelize(item.column_name,false)} != null">
              ${item.column_name}=#{${camelize(item.column_name,false)}}${(i != (len - 1)? ',':'')}
              </if>`;
  }
  return new Handlebars.SafeString(pxmlStr);
}
//格式化keyword查询条件参数
function stringFormatKeywordParam(item, len, i) {
  var pxmlStr = `(t.${item.column_name} like CONCAT('%',trim(#{keyword}),'%'))` + (i != (len - 1)? ' ||' :'');
  if (item.data_type == 'date' || item.data_type == 'timestamp' || item.data_type == 'datetime') {
    pxmlStr = '';
  }
  return new Handlebars.SafeString(pxmlStr)
}
