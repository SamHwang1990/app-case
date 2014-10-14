/**
 * Created by sam on 14-10-13.
 */

$(function(){
	initCallout();

	$('#essayContent').redactor({
		minHeight: 300,
		placeholder: '请输入文书内容',
		buttons:['html', 'formatting', 'bold', 'italic','underline', 'deleted',
			'unorderedlist', 'orderedlist', 'outdent', 'indent',
			'alignment', 'horizontalrule'],
		lang: 'zh_cn',
		buttonSource: true
	});

});
