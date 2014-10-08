/**
 * Created by sam on 14-9-27.
 */

//Dom Ready
$(function(){
	//sort_eduType_item btn series
	$('.sort_eduType_item_add').on('click',function(event){

	});

	$('.sort_eduType_item_edit').on('click',function(event){
		event.preventDefault();
		var $itemEl = $(this).parents('.sort_eduType_item');
		editBox($itemEl,'');
	});

	$('.sort_eduType_item_remove').on('click',function(event){
		event.preventDefault();
		var $itemEl = $(this).parents('.sort_eduType_item');
		var itemId = $itemEl.attr('data-id');
		var itemGrade = $itemEl.attr('data-grade');
		deleteBox($itemEl,'',itemId,itemGrade);
	});

	$('.sort_eduType_item_addOption').on('click',function(event){

	});

	$('.sort_eduType_item_editOption').on('click',function(event){
		event.preventDefault();
		var $optionEl = $(this).parents('.sort_eduType_item_option');
		editBox($optionEl,'');
	});

	$('.sort_eduType_item_removeOption').on('click',function(event){
		event.preventDefault();
		var $optionEl = $(this).parents('.sort_eduType_item_option');
		var optionId = $optionEl.attr('data-id');
		var optionGrade = $optionEl.attr('data-grade');
		deleteBox($optionEl,'',optionId,optionGrade);
	});

	//sort_eduType_editForm submit event bind
	$('.sort_eduType_editForm').on('submit',function(event){
		event.preventDefault();
		var ajaxUrl = $(this).attr('action');
		var name = $(this).find('input[name="name"]').val();
		var slug = $(this).find('input[name="slug"]').val();
		var description = $(this).find('input[name="description"]').val();
		var remark = $(this).find('textarea[name="remark"]').val();

		var ajaxData = {
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
				}else{
					updateErrorCallout(data.ErrorMsg);
				}
			},
			error: function (data) {
				alert('提交数据失败');
			}
		})
	})
});