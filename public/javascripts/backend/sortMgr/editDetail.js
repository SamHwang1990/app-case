/**
 * Created by sam on 14-10-10.
 */

var buildEduTypeDetailsHtml = function($wrapEl, detailsData){
	var outputHtml = '';
	var message = '';
	_.forEach(detailsData, function(detailValue){
		var detailItem = detailValue.EduTypeItem;
		var detailItemOptions = detailValue.EduTypeItemOptions;
		message =
			'<div class="sort_eduType_item ac_sortItem"' +
			'data-id="' + detailItem._id +
			'" data-name="' + detailItem.name +
			'" data-slug="' + detailItem.slug +
			'" data-description="' + detailItem.description +
			'" data-remark="' + detailItem.remark +
			'" data-grade="' + detailItem.grade + '" >' +
			'<div class="row">' +
			'<div class="col-sm-3"><h3>' +
			'<p class="sort_eduType_item_name">' + detailItem.name +'</p>' +
			'<span class="sort_eduType_item_description">' + detailItem.description + '</span>' +
			'<span>' +
			'<button class="sort_eduType_item_addOption btn btn-default btn-sm" title="增加选项">' +
			'<span class="glyphicon glyphicon-plus"></span>' +
			'</button>' +
			'<button class="sort_eduType_item_edit btn btn-default btn-sm" title="修改分类">' +
			'<span class="glyphicon glyphicon-pencil"></span>' +
			'</button>' +
			'<button class="sort_eduType_item_remove btn btn-default btn-sm" title="删除分类">' +
			'<span class="glyphicon glyphicon-trash"></span>' +
			'</button>' +
			'</span>' +
			'</h3></div>' +
			'<div class="col-sm-9 row">' +
			buildEduTypeItemOptionsHtml(detailItemOptions) +
			'</div></div></div>';
		outputHtml += message;
	});

	return $wrapEl.html(outputHtml);
};

var buildEduTypeItemOptionsHtml = function(optionsData){
	var outputHtml = '';
	var message = '';

	if(optionsData === null || optionsData.length <= 0)
		return '该分类下无任何选项，请先添加！';

	_.forEach(optionsData,function(optionData){
		message =
			'<div class="sort_eduType_item_option col-sm-6"' +
			'data-id="' + optionData._id +
			'" data-name="' + optionData.name +
			'" data-slug="' + optionData.slug +
			'" data-description="' + optionData.description +
			'" data-remark="' + optionData.remark +
			'" data-grade="' + optionData.grade + '" >' +
			'<section class="cell-row">' +
			'<section class="sort_eduType_item_option_name cell-row-col cell-row-description">' +
			optionData.name + '&nbsp;(' + optionData.slug + ')' +
			'</section>' +
			'<div class="cell-row-right-arrow">' +
			'<a class="sort_eduType_item_removeOption">' +
			'<span class="glyphicon glyphicon-trash"></span>' +
			'</a>&nbsp;' +
			'<a class="sort_eduType_item_editOption">' +
			'<span class="glyphicon glyphicon-pencil"></span>' +
			'</a>' +
			'</div>' +
			'</section>' +
			'</div>';
		outputHtml += message;
	});

	return outputHtml;
};

var loadEduTypeDetails = function(typeId, $listWrapEl){
	$.ajax({
		type: 'GET',
		url: '/backend/SortMgr/EduTypeDetails/' + typeId,
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			if(data === null || data.length <= 0)
				return $listWrapEl.text("该类型无分类信息，请添加！");
			else
				buildEduTypeDetailsHtml($listWrapEl, data);
		},
		error: function (data) {
			alert('获取数据失败');
		}
	})
};

$(function(){
	var $sortMgrList = $('.ac_sortmgr_list');
	//sort_eduType_item_add click event bind
	$(".sort_eduType_item_add").on('click',function(event){
		event.preventDefault();
		var grade = 1;
		var ajaxUrl = '/backend/SortMgr/NewEduTypeItemOrOption';
		var parentId = $(this).attr('data-parentId');
		var eduTypeId = parentId;
		newBox($sortMgrList,ajaxUrl,eduTypeId,parentId,grade);
	});

	$sortMgrList.delegate('.sort_eduType_item_edit','click',function(event){
		event.preventDefault();
		var $itemWrapEl = $(this).parents('.sort_eduType_item');
		var ajaxUrl = '/backend/SortMgr/EditEduTypeItemOrOption';
		var typeId = $sortMgrList.attr('data-eduTypeId');
		var sortId = $itemWrapEl.attr('data-id');
		editBox($itemWrapEl,$sortMgrList,ajaxUrl,sortId,typeId);
	});
	$sortMgrList.delegate('.sort_eduType_item_remove','click',function(event){
		event.preventDefault();
		var $itemWrapEl = $(this).parents('.sort_eduType_item');
		var ajaxUrl = '/backend/SortMgr/removeEduTypeItem';
		var typeId = $sortMgrList.attr('data-eduTypeId');
		var sortId = $itemWrapEl.attr('data-id');
		deleteBox($sortMgrList,ajaxUrl,sortId,typeId);
	});

	$sortMgrList.delegate('.sort_eduType_item_addOption','click',function(event){
		event.preventDefault();
		var $itemWrapEl = $(this).parents('.sort_eduType_item');
		var ajaxUrl = '/backend/SortMgr/NewEduTypeItemOrOption';
		var parentId = $itemWrapEl.attr('data-id');
		var eduTypeId = $sortMgrList.attr('data-eduTypeId');
		var grade = '2';
		newBox($sortMgrList,ajaxUrl,eduTypeId,parentId,grade);
	});
	$sortMgrList.delegate('.sort_eduType_item_removeOption','click',function(event){
		event.preventDefault();
		var $itemWrapEl = $(this).parents('.sort_eduType_item_option');
		var ajaxUrl = '/backend/SortMgr/removeEduTypeItemOption';
		var typeId = $sortMgrList.attr('data-eduTypeId');
		var sortId = $itemWrapEl.attr('data-id');
		deleteBox($sortMgrList,ajaxUrl,sortId,typeId);
	})
	$sortMgrList.delegate('.sort_eduType_item_editOption','click',function(event){
		event.preventDefault();
		var $eduTypeItemList = $(".ac_sortmgr_list");
		var $itemWrapEl = $(this).parents('.sort_eduType_item_option');
		var ajaxUrl = '/backend/SortMgr/EditEduTypeItemOrOption';
		var typeId = $eduTypeItemList.attr('data-eduTypeId');
		var sortId = $itemWrapEl.attr('data-id');
		editBox($itemWrapEl,$eduTypeItemList,ajaxUrl,sortId,typeId);
	})

	initCallout();
	loadEduTypeDetails($sortMgrList.attr('data-eduTypeId'),$sortMgrList)

});
