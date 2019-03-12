var MessageBox={};
MessageBox.PNotify=function (title,text){
	
	new PNotify({
		title: title,
		text: text,
		icon: 'fa fa-envelope-o'
	});
	
}

MessageBox.warn=function (title,text){

	new PNotify({
		title: title,
		text: text
	});
}


MessageBox.info=function (title,text){
	
	new PNotify({
        title: title,
        text: text,
        type: 'info'
    });
	
}

MessageBox.success=function (title,text){
	
	new PNotify({
        title: title,
        text: text,
        type: 'success'
    });
	
}


MessageBox.error=function (title,text){
	
	new PNotify({
        title: title,
        text: text,
        type: 'error'
    });
	
}

function lockUI(){

	$.blockUI({
		css: {
			color: '#fff',
			border: '0',
			backgroundColor: 'transparent'
		},
		overlayCSS: {
			opacity: 0.7
		},
		baseZ:10001,
	});
	
}

function unLockUI(){
	$.unblockUI();
}

function showComfirm(title, execute){
    if(title != ''){
        $('.modal-content  .panel-body p').text(title);
    }
    $('#confirm_Modal').modal('show');
    $('#sure_delete').unbind();
    $('#sure_delete').on('click',execute);
};

function hideComfirm(){
    $('#confirm_Modal').modal('hide');
};

/**
 * 0 - 9个参数字符串formate
 * @param args
 * @returns {String}
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

/**
 * 公用的菊花效果
 * 使用方法和jquery一样，$('#id').showLoading();
 */
$.fn.showLoading = function () {
    this.empty();
    var htmlStr = '<div class="sk-circle">'+
        '<div class="sk-circle1 sk-child"></div>'+
        '<div class="sk-circle2 sk-child"></div>'+
        '<div class="sk-circle3 sk-child"></div>'+
        '<div class="sk-circle4 sk-child"></div>'+
        '<div class="sk-circle5 sk-child"></div>'+
        '<div class="sk-circle6 sk-child"></div>'+
        '<div class="sk-circle7 sk-child"></div>'+
        '<div class="sk-circle8 sk-child"></div>'+
        '<div class="sk-circle9 sk-child"></div>'+
        '<div class="sk-circle10 sk-child"></div>'+
        '<div class="sk-circle11 sk-child"></div>'+
        '<div class="sk-circle12 sk-child"></div>'+
        '</div>';
    this.html(htmlStr);
};