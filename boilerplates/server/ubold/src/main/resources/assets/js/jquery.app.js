/**
* Module/App: Main Js
*/

!function($) {
    "use strict";

    var Sidemenu = function() {
        this.$body = $("body"),
        this.$openLeftBtn = $(".open-left"),
        this.$menuItem = $("#sidebar-menu a")
    };
    Sidemenu.prototype.openLeftBar = function() {
      $("#wrapper").toggleClass("enlarged");
      $("#wrapper").addClass("forced");

      if($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")) {
        $("body").removeClass("fixed-left").addClass("fixed-left-void");
      } else if(!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")) {
        $("body").removeClass("fixed-left-void").addClass("fixed-left");
      }
      
      if($("#wrapper").hasClass("enlarged")) {
        $(".left ul").removeAttr("style");
      } else {
        $(".subdrop").siblings("ul:first").show();
      }
      
      toggle_slimscroll(".slimscrollleft");
      $("body").trigger("resize");
    },
    //menu item click
    Sidemenu.prototype.menuItemClick = function(e) {
       if(!$("#wrapper").hasClass("enlarged")){
        if($(this).parent().hasClass("has_sub")) {
          e.preventDefault();
        }   
        if(!$(this).hasClass("subdrop")) {
          // hide any open menus and remove all other classes
          $("ul",$(this).parents("ul:first")).slideUp(350);
          $("a",$(this).parents("ul:first")).removeClass("subdrop");
          $("#sidebar-menu .pull-right i").removeClass("md-remove").addClass("md-add");
          
          // open our new menu and add the open class
          $(this).next("ul").slideDown(350);
          $(this).addClass("subdrop");
          $(".pull-right i",$(this).parents(".has_sub:last")).removeClass("md-add").addClass("md-remove");
          $(".pull-right i",$(this).siblings("ul")).removeClass("md-remove").addClass("md-add");
        }else if($(this).hasClass("subdrop")) {
          $(this).removeClass("subdrop");
          $(this).next("ul").slideUp(350);
          $(".pull-right i",$(this).parent()).removeClass("md-remove").addClass("md-add");
        }
      } 
    },

    //init sidemenu
    Sidemenu.prototype.init = function() {
      var $this  = this;
      //bind on click
      $(".open-left").click(function(e) {
        e.stopPropagation();
        $this.openLeftBar();
      });

      // LEFT SIDE MAIN NAVIGATION
      $this.$menuItem.on('click', $this.menuItemClick);

      // NAVIGATION HIGHLIGHT & OPEN PARENT
      $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");
    },

    //init Sidemenu
    $.Sidemenu = new Sidemenu, $.Sidemenu.Constructor = Sidemenu
    
}(window.jQuery),


function($) {
    "use strict";

    var FullScreen = function() {
        this.$body = $("body"),
        this.$fullscreenBtn = $("#btn-fullscreen")
    };

    //turn on full screen
    // Thanks to http://davidwalsh.name/fullscreen
    FullScreen.prototype.launchFullscreen  = function(element) {
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    },
    FullScreen.prototype.exitFullscreen = function() {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
    //toggle screen
    FullScreen.prototype.toggle_fullscreen  = function() {
      var $this = this;
      var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
      if(fullscreenEnabled) {
        if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          $this.launchFullscreen(document.documentElement);
        } else{
          $this.exitFullscreen();
        }
      }
    },
    //init sidemenu
    FullScreen.prototype.init = function() {
      var $this  = this;
      //bind
      $this.$fullscreenBtn.on('click', function() {
        $this.toggle_fullscreen();
      });
    },
     //init FullScreen
    $.FullScreen = new FullScreen, $.FullScreen.Constructor = FullScreen
    
}(window.jQuery),



//main app module
 function($) {
    "use strict";
    
    var App = function() {
        this.VERSION = "1.1.0", 
        this.AUTHOR = "Coderthemes", 
        this.SUPPORT = "xuyunlong@mapath.com",
        this.pageScrollElement = "html, body", 
        this.$body = $("body")
    };
    
     //on doc load
    App.prototype.onDocReady = function(e) {
      FastClick.attach(document.body);
      resizefunc.push("initscrolls");
      resizefunc.push("changeptype");

      $('.animate-number').each(function(){
        $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-duration"))); 
      });
    
      //RUN RESIZE ITEMS
      $(window).resize(debounce(resizeitems,100));
      $("body").trigger("resize");

      // right side-bar toggle
      $('.right-bar-toggle').on('click', function(e){
          e.preventDefault();
          $('#wrapper').toggleClass('right-bar-enabled');
      });

      // 分页事件代码
        $('#pagUl').on('click', 'a', function () {
            var target = $(this);
            var toPage = target.attr("toPage");
            if(typeof(toPage)!="undefined") {
                var htmlEle = '<input type="hidden" name="pageInfo.page" id="pageNo" value="'+toPage+'"><input type="hidden" name="pageInfo.totalPage" id="totalPage" value="${pagination.pageCount}">'
                $('#searchForm').append(htmlEle);
                $('#searchForm').submit();
            }
        });
        $('.input-daterange').datepicker();
        $('.datePicker').datepicker();
      
    },
    //initilizing 
    App.prototype.init = function() {
        var $this = this;
        //document load initialization
        $(document).ready($this.onDocReady);
        //init side bar - left
        $.Sidemenu.init();
        //init fullscreen
        $.FullScreen.init();
    },

    $.App = new App, $.App.Constructor = App

}(window.jQuery),


//initializing main application module
function($) {
    "use strict";
    $.App.init();
}(window.jQuery),


// MessageBox info
function($) {
    "use strict";

    var Message = function () {
        this.$body = $("body");
    };

    Message.prototype.success = function (msgstr,direction) {
        var dire = direction ? direction : "right";
        $.Notification.notify('success','top '+dire, '成功了', msgstr)
    };

    Message.prototype.warning = function (msgstr,direction) {
        var dire = direction ? direction : "right";
        $.Notification.notify('warning','top '+dire, '警告', msgstr)
    };
    Message.prototype.error = function (msgstr,direction) {
        var dire = direction ? direction : "right";
        $.Notification.notify('error','top '+dire, 'error!', msgstr)
    };
    Message.prototype.info = function (msgstr,direction) {
        var dire = direction ? direction : "right";
        $.Notification.notify('info','top '+dire, '提示', msgstr)
    };
    $.Message = new Message, $.Message.Constructor = Message

}(window.jQuery);



/* ------------ some utility functions ----------------------- */
//this full screen
var toggle_fullscreen = function () {

};

function executeFunctionByName(functionName, context /*, args */) {
  var args = [].slice.call(arguments).splice(2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(this, args);
}
var w,h,dw,dh;
var changeptype = function(){
    w = $(window).width();
    h = $(window).height();
    dw = $(document).width();
    dh = $(document).height();

    if(jQuery.browser.mobile === true){
        $("body").addClass("mobile").removeClass("fixed-left");
    }

    if(!$("#wrapper").hasClass("forced")){
      if(w > 990){
        $("body").removeClass("smallscreen").addClass("widescreen");
          $("#wrapper").removeClass("enlarged");
      }else{
        $("body").removeClass("widescreen").addClass("smallscreen");
        $("#wrapper").addClass("enlarged");
        $(".left ul").removeAttr("style");
      }
      if($("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left")){
        $("body").removeClass("fixed-left").addClass("fixed-left-void");
      }else if(!$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void")){
        $("body").removeClass("fixed-left-void").addClass("fixed-left");
      }

  }
  toggle_slimscroll(".slimscrollleft");
};


var debounce = function(func, wait, immediate) {
  var timeout, result;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};

function resizeitems(){
  if($.isArray(resizefunc)){  
    for (i = 0; i < resizefunc.length; i++) {
        window[resizefunc[i]]();
    }
  }
}

function initscrolls(){
    if(jQuery.browser.mobile !== true){
      //SLIM SCROLL
      $('.slimscroller').slimscroll({
        height: 'auto',
        size: "5px"
      });

      $('.slimscrollleft').slimScroll({
          height: 'auto',
          position: 'right',
          size: "5px",
          color: '#dcdcdc',
          wheelStep: 5
      });
  }
}
function toggle_slimscroll(item){
    if($("#wrapper").hasClass("enlarged")){
      $(item).css("overflow","inherit").parent().css("overflow","inherit");
      $(item). siblings(".slimScrollBar").css("visibility","hidden");
    }else{
      $(item).css("overflow","hidden").parent().css("overflow","hidden");
      $(item). siblings(".slimScrollBar").css("visibility","visible");
    }
}

var wow = new WOW({
    boxClass: 'wow', // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset: 50, // distance to the element when triggering the animation (default is 0)
    mobile: false        // trigger animations on mobile devices (true is default)
  });
wow.init();


// 给所有ajax加上Loading效果
// $(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
$.fn.select2.defaults.set( "theme", "bootstrap" );
// 处理select2 搜索框获取不到焦点问题
$.fn.modal.Constructor.prototype.enforceFocus = function () { };

/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 */
Array.prototype.contains = function ( needle ) {
    for (var i in this) {
        if (this[i] == needle) return true;
    }
    return false;
};

/** select2 extend **/
//select2 init by code table
(function ($) {
    "use strict";

    /***
     * 根据codetable内容初始化select2内容
     * @param options
     */
    $.fn.select2InitByCodeTable = function(options) {
        // default options
        var defaults = {
               width : '100%',
               url : '',
            codetype : ''
        };
        options = $.extend(defaults, options);
        this.select2({
            allowClear: true,
            minimumInputLength: 0,
            width: options.width,
            ajax: {
                url: options.url,
                dataType: "json",
                type: "POST",
                data: function (params) {
                    return {
                        "name": params.term,
                        "codeType": options.codetype
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.obj
                    };
                }
            }
        });
    };

    /***
     * 分页加载select2 内容
     * @param options
     */
    $.fn.initSelect2PageData = function(options) {
        // default options
        var defaults = {
            width: '100%',
            url: '',
            minimumInputLength: 0,
            cache: true,
            delay: 300,
            data: {}
        };
        var megerJson = function (jsonObj1, jsonObj2) {
            var rjo={};
            for(var key in jsonObj1){
                rjo[key]=jsonObj1[key];
            }
            for(var key in jsonObj2){
                rjo[key]=jsonObj2[key];
            }
            return rjo;
        };
        options = $.extend(defaults, options);
        this.select2({
            allowClear: true,
            width: options.width,
            minimumInputLength: options.minimumInputLength,
            ajax: {
                url: options.url,
                dataType: 'json',
                delay: options.delay,
                type: 'POST',
                data: function (params) {
                    var parms = {
                        "pageInfo.rows": 10,
                        "keyword": params.term,
                        "pageInfo.page": params.page
                    };
                    if (options.data){
                        parms = megerJson(parms,options.data);
                    }
                    return parms;
                },
                processResults: function (data, params) {
                    params.page = params.page || 1;
                    return {
                        results: data.obj,
                        pagination: {
                            more: data.obj.length >= 10
                        }
                    };
                },
                cache: options.cache
            }
        });

    };
})(window.jQuery),

//edit table global js
(function () {
    "use strict";
    $.fn.numericInput = function (options) {
        // * 相乘 + 相加 - 相减
        var defaults = {
            columns: [],   //需要计算的列
            totalColIndex: -1, //汇总列
            type: '*'
        };

        options = $.extend(defaults, options);

        var element = $(this),
            footer = element.find('tfoot tr'),
            dataRows = element.find('tbody tr'),
            initialTotal = function () {
                var column,total,totalSum;
                if(!options.columns.length) {
                    for (column = 1; column < footer.children().size(); column++) {
                        total = 0;
                        dataRows.each(function () {
                            var row = $(this);
                            total += parseFloat(row.children().eq(column).text());
                        });
                        footer.children().eq(column).text(total);
                    }
                } else {
                    for (var x in options.columns) {
                        total = 0, totalSum = 0;
                        dataRows.each(function () {
                            var row = $(this);
                            total += parseFloat(row.children().eq(options.columns[x]).text());
                            if (options.totalColIndex !== -1){
                                totalSum += parseFloat(row.children().eq(options.totalColIndex).text());
                            }
                        });
                        footer.children().eq(options.columns[x]).text(total);
                        if (options.totalColIndex !== -1){
                            footer.children().eq(options.totalColIndex).text(totalSum);
                        }
                    }
                }

            };

        element.find('td').on('change', function (evt) {
            var cell = $(this),
                column = cell.index(),
                total = 0,
                totalSum = 0,
                totalSumEnd = 0;
            // if (options.columns.length && $.inArray(column,options.columns) === -1) {
            //     $.Message.info('本单元不可编辑');
            //     return false;
            // }
            if (options.columns.length && options.totalColIndex !== -1){
                var parentTr = cell.parent().children();
                options.columns.map(function (item, i) {
                    switch(options.type){
                        case '*':
                            if (totalSum === 0){
                                totalSum = parseFloat(parentTr.eq(item).text());
                            } else {
                                totalSum *= parseFloat(parentTr.eq(item).text());
                            }
                            break;
                        case '+':
                            totalSum += parseFloat(parentTr.eq(item).text());
                            break;
                        case '-':
                            totalSum -= parseFloat(parentTr.eq(item).text());
                            break;
                        default:
                            break;
                    }

                });
                parentTr.eq(options.totalColIndex).text(totalSum);
            }

            element.find('tbody tr').each(function () {
                var row = $(this);
                total += parseFloat(row.children().eq(column).text());
                if (options.totalColIndex !== -1) {
                    totalSumEnd += parseFloat(row.children().eq(options.totalColIndex).text());
                }
            });

            // $('.alert').hide();
            footer.children().eq(column).text(total);
            if (options.totalColIndex !== -1) {
                footer.children().eq(options.totalColIndex).text(totalSumEnd);
            }

        }).on('validate', function (evt, value) {
            var cell = $(this),
                column = cell.index();
            if (column === 0) {
                return !!value && value.trim().length > 0;
            } else {
                return !isNaN(parseFloat(value)) && isFinite(value);
            }
        });
        initialTotal();
        return this;
    };
})(window.jQuery);


