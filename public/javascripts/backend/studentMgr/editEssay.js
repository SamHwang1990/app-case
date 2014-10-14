/**
 * Created by sam on 14-10-13.
 */

$(function(){
	$(document).delegate('.btnDeleteEssay','click',function(e){
		e.preventDefault();
		$(this).parents('.panel').remove();
	});
});
