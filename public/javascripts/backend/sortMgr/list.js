/**
 * Created by sam on 14-9-28.
 */
(function(){

	var buildTabContent = function($wrapEl, detailsData){
		var outputHtml = '';
		var message = '';
		_.forEach(detailsData, function(detailValue){
			var detailItem = detailValue.value.EduTypeItem;
			var detailItemOptions = detailValue.value.EduTypeItemOption;
			message =
				'<div class="sort_eduType_item ac_sortItem" >' +
				'<div class="row">' +
				'<div class="col-sm-3"><h3>' +
				'<p class="sort_eduType_item_name">' + detailItem.name +'</p>' +
				'<span class="sort_eduType_item_description">' + detailItem.description + '</span>' +
				'</h3></div>' +
				'<div class="col-sm-9 row">' +
					buildListEduTypeItemOptionsHtml(detailItemOptions) +
				'</div></div></div>';
			outputHtml += message;
		});

		return $wrapEl.html(outputHtml);
	};

	var buildListEduTypeItemOptionsHtml = function(optionsData){
		var outputHtml = '';
		var message = '';

		if(optionsData === null || optionsData.length <= 0)
			return '该分类下无任何选项，请先添加！';

		_.forEach(optionsData,function(optionData){
			message =
				'<div class="col-sm-6" >' +
					'<section class="cell-row">' +
						'<section class="cell-row-col cell-row-description">' +
						optionData.name +
						'</section>' +
					'</section>' +
				'</div>';
			outputHtml += message;
		});

		return outputHtml;
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
		var typeId = $(this).attr('data-id');

		//$(".ac_sortmgr_list").removeClass('active');
		//typeTabPane.addClass('active');

		$.ajax({
			type: 'GET',
			url: '/backend/SortMgr/EduTypeDetails/' + typeId,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				if(data === null || data.length <= 0)
					return $typeTabPane.text("该类型无分类信息，请添加！");
				else
					buildTabContent($typeTabPane, data);
			},
			error: function (data) {
				alert('获取数据失败');
			}
		})
	};

	var clickTypeRemoveLink = function(event){

	};

	var clickTypeEditLink = function(event){

	};

	$(function(){
		$('a.eduType_show').on("click",clickTypeShowLink);
		initListContent();
	})


})();