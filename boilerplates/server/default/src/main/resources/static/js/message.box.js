var MessageBox={};
MessageBox.PNotify=function (title,text){
	
	new PNotify({
		title: title,
		text: text,
		icon: 'fa fa-envelope-o'
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

