/**
 * Created by sam on 14-9-28.
 */
(function(){

	var buildTabContent = function($wrapEl, detailDatas){

	};

	var initListContent = function(){
		var $sortTabs = $("#sort_list_tabs");
		if($sortTabs.length <= 0)
			return;

		var firstLi = $sortTabs.find('li.dropdown').eq(0);
		firstLi.addClass('active');

		var $eduTypeShowLink = firstLi.find('.eduType_show');
		$eduTypeShowLink.trigger('click');
	};

	//处理删除Sort的box
	var deleteBox = function($wrapEl, ajaxUrl){
		bootbox.dialog({
			className:'sort_delete_box',
			message: "Are you sure?",
			buttons: {
				default: {
					label: "No",
					className: "btn-default",
					callback: function() {
						alert('oh no, i don\'t want to delete!');
					}
				},
				danger: {
					label: "Yes",
					className: "btn-danger",
					callback: function() {
						/*
						* ToDo: DeleteBox
						* after delete doc in db,
						* the tab and tabPanel dom shall remove from document,
						* and if the rest tab length is 0, remove ui.sort_list_tabs and div.tab-content from document, and show h3.sortList_blank
						* if the rest tab length is bigger than 0, and the index of removed tab is not 0, nothing else, otherwise, initListContent again
						* */
					}
				}
			}
		});
	};

	/*
	* ToDo:
	* server method to get typedetails have not been written,
	* and have to check whether the ajax get code is corrected
	* */
	var clickTypeShowLink = function(event){
		var typeSlug = $(this).attr('href').slice(1);
		var $typeTabPane = $('#' + typeSlug);
		var typeName = $(this).attr('data-name');

		//$(".ac_sortmgr_list").removeClass('active');
		//typeTabPane.addClass('active');

		$.ajax({
			type: 'GET',
			url: '/backend/SortMgr/EduTypeDetails/' + typeName,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				buildTabContent($typeTabPane, data);
			},
			error: function (data) {
				alert('获取数据失败');
			}
		})
	};

	var clickTypeRemoveLink = function(event){

	};


})();