/**
 * Created by sam on 14-10-12.
 */

var resetCallout = function(){
	var $acCallout = $('.ac_header_callout');
	$acCallout.addClass('hidden');
	$acCallout.find('p').text('');
};
var initCallout = function(){
	$('.ac_header_callout').each(function(){
		if($(this).find('p').text() !== ''){
			$(this).removeClass('hidden');
		}
	});
	setTimeout(function(){
		resetCallout();
	},3000)
};
var updateSuccessCallout = function(successMsg){
	resetCallout();
	$('.ac_header_callout.ac_callout_info').removeClass('hidden').find('p').text("成功：" + successMsg);
	setTimeout(function(){
		resetCallout();
	},3000)
};
var updateErrorCallout = function(errMsg){
	resetCallout();
	$('.ac_header_callout.ac_callout_danger').removeClass('hidden').find('p').text("错误：" + errMsg);
	setTimeout(function(){
		resetCallout();
	},3000)
};
