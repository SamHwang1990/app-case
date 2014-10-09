/**
 * Created by sam on 14-10-8.
 */

var buildEduTypeDetailsHtml = function($wrapEl, detailsData){
	var outputHtml = '';
	var message = '';
	_.forEach(detailsData, function(detailValue){
		var detailItem = detailValue.value.EduTypeItem;
		var detailItemOptions = detailValue.value.EduTypeItemOption;
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
			optionData.name +
			'</section>' +
			'<div class="cell-row-right-arrow">' +
			'<a class="sort_eduType_item_removeOption" href="#">' +
			'<span class="glyphicon glyphicon-trash"></span>' +
			'</a>&nbsp;' +
			'<a class="sort_eduType_item_editOption" href="#">' +
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
	//sort_eduType_editForm submit event bind
	$('.sort_eduType_editForm').on('submit',function(event){
		event.preventDefault();
		var ajaxUrl = $(this).attr('action');
		var _id = $(this).find('input[name="eduTypeId"]').val();
		var name = $(this).find('input[name="name"]').val();
		var slug = $(this).find('input[name="slug"]').val();
		var description = $(this).find('input[name="description"]').val();
		var remark = $(this).find('textarea[name="remark"]').val();

		var ajaxData = {
			_id:_id,
			name:name,
			slug:slug,
			description:description,
			remark:remark
		};

		$.ajax({
			type: 'POST',
			url: ajaxUrl,
			data: JSON.stringify(ajaxData),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				if(data.SaveResult){
					updateSuccessCallout(data.SuccessMsg);
					toggleNavTab();
					loadEduTypeDetails(_id,$(".ac_sortmgr_list"))
				}else{
					updateErrorCallout(data.ErrorMsg);
				}
			},
			error: function (data) {
				alert('提交数据失败');
			}
		})
	});

	//sort_eduType_item_add click event bind
	$(".sort_eduType_item_add").on('click',function(event){
		event.preventDefault();
		var $eduTypeItemList = $(".ac_sortmgr_list");
		var grade = 1;
		var ajaxUrl = '/backend/SortMgr/NewEduTypeItemOrOption';
		var parentId = $(this).attr('data-parentId');
		var eduTypeId = parentId;
		newBox($eduTypeItemList,ajaxUrl,eduTypeId,parentId,grade);
	});

	$('.ac_sortmgr_list').delegate('.sort_eduType_item_edit','click',function(event){
		event.preventDefault();
		var $eduTypeItemList = $(".ac_sortmgr_list");
		var $itemWrapEl = $(this).parents('.sort_eduType_item');
		var ajaxUrl = '/backend/SortMgr/EditEduTypeItemOrOption';
		var typeId = $eduTypeItemList.attr('data-eduTypeId');
		var sortId = $itemWrapEl.attr('data-id');
		editBox($itemWrapEl,$eduTypeItemList,ajaxUrl,sortId,typeId);
	});

	$('.ac_sortmgr_list').delegate('.sort_eduType_item_addOption','click',function(event){
		event.preventDefault();
	});
});