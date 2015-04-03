/**
 * Created by sam on 14-9-28.
 */
(function(){

	var buildTabContent = function($wrapEl, detailsData){
		var outputHtml = '';
		var message = '';
		_.forEach(detailsData, function(detailValue){
			var detailItem = detailValue.EduTypeItem;
			var detailItemOptions = detailValue.EduTypeItemOptions;
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
						optionData.name + '&nbsp;(' + optionData.slug + ')' +
						'</section>' +
					'</section>' +
				'</div>';
			outputHtml += message;
		});

		return outputHtml;
	};

	var initListContent = function(){
		var $sortTabs = $("#sort_list_tabs");
		if($sortTabs.length <= 0 || $sortTabs.find('li.dropdown').size() <= 0) {
			$('.sortList_blank').removeClass('hidden');
			return;
		}

		var firstLi = $sortTabs.find('li.dropdown').eq(0);
		firstLi.addClass('active');

		var $eduTypeShowLink = firstLi.find('.eduType_show');
		$eduTypeShowLink.trigger('click');
	};

	//处理删除Sort的box
	var typeDeleteBox = function(ajaxUrl, sortId, $dropdownLi, $tapPanel){
		bootbox.dialog({
			className:'sort_delete_box',
			message: "Are you sure?",
			buttons: {
				default: {
					label: "No",
					className: "btn-default"
				},
				danger: {
					label: "Yes",
					className: "btn-danger",
					callback: function() {
						var ajaxData = {
							sortId:sortId
						};

						$.ajax({
							type: 'POST',
							url: ajaxUrl,
							data: JSON.stringify(ajaxData),
							dataType: 'json',
							contentType: 'application/json; charset=utf-8',
							success: function (data) {
								if(data.RemoveResult){
									updateSuccessCallout(data.SuccessMsg);
									$dropdownLi.remove();
									$tapPanel.remove();
									initListContent();
								}else{
									updateErrorCallout(data.ErrorMsg);
								}
							},
							error: function (data) {
								alert('提交数据失败');
							}
						})
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
		event.preventDefault();
		var typeId = $(this).attr('data-id');
		var ajaxUrl = $(this).attr('href');
		var slug = $(this).attr('data-slug');
		var $dropdownLi = $(this).parents('li.dropdown');
		var $tapPanel = $("#"+ slug);
		typeDeleteBox(ajaxUrl,typeId,$dropdownLi,$tapPanel);
	};

	$(function(){
		$('a.eduType_show').on("click",clickTypeShowLink);
		$('a.eduType_remove').on('click',clickTypeRemoveLink);
		initListContent();
	})


})();