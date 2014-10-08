/**
 * Created by sam on 14-10-8.
 */

$(function(){
	var buildEduTypeDetailsHtml = function($wrapEl, detailsData){
		//$wrapEl.text("dj");
		return $wrapEl.text("dj");
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
	})
});