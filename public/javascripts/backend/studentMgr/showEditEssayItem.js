/**
 * Created by sam on 14-10-14.
 */

$(function(){
	initCallout();

	$('#essayContent').redactor({
		minHeight: 300,
		buttons:['html', 'formatting', 'bold', 'italic','underline', 'deleted',
			'unorderedlist', 'orderedlist', 'outdent', 'indent',
			'alignment', 'horizontalrule'],
		lang: 'zh_cn',
		buttonSource: true
	});

});
