/**
 * Created by sam on 14-10-13.
 */

$(function(){
	initCallout();

	var options = {
		editor: document.getElementById('essayContent'), // {DOM Element} [required]
		class: 'pen_essayContent', // {String} class of the editor,
		debug: false, // {Boolean} false by default
		textarea: '', // fallback for old browsers
		list: ['blockquote', 'h2', 'h3', 'p', 'insertorderedlist', 'insertunorderedlist',
			'indent', 'outdent', 'bold', 'italic', 'underline', 'createlink'] // editor menu list
	};

	var editor = new Pen(options);


	$('form').on('submit',function(e){
		var $essayContent = $("#essayContent");
		var $inputEssayContent = $('#inputEssayContent');

		$inputEssayContent.val($essayContent.html());
	})

});
