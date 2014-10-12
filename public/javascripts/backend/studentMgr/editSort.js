/**
 * Created by sam on 14-10-11.
 */

var renderDetails = function($wrapEl,details,eduTypeId){
	$wrapEl.find('.studentEditSort_itemWrap').remove();
	var outputHtml = '';
	var message = '';

	_.forEach(details, function(detail){
		var eduTypeItem = detail.EduTypeItem;
		var eduTypeItemOptions = detail.EduTypeItemOptions;
		message =
			'<div class="col-sm-3 studentEditSort_itemWrap"><div>' +
			'<h3>' + eduTypeItem.name + '&nbsp;<small>' + eduTypeItem.description + '</small></h3>' +
			renderOptions(eduTypeItemOptions,eduTypeId) +
			'</div></div>';
		outputHtml += message;
	});

	$wrapEl.append(outputHtml);
};

var renderOptions = function(options,eduTypeId){
	var outputHtml = '';
	var message = '';
	if(options === null || options.length <= 0){
		outputHtml =
			'<p>该分类下无选项，请先<a href="/backend/SortMgr/EditDetails/' + eduTypeId + '" title="添加筛选分类">添加</a>！</p>';
	}else{
		outputHtml =
			'<select class="form-control" data-eduTypeItemId="' + eduTypeId + '">' +
				'<option value="">请选择分类选项</option>';
		_.forEach(options, function(option){
			message =
				'<option value="' + option._id + '">' + option.name + '</option>';
			outputHtml += message;
		});
		outputHtml += '</select>';
	}

	return outputHtml;
};

var initStudentSort = function(){
	var $IsSignEduType = $('.IsSignEduType');
	if($IsSignEduType.val() === 'false')
		return;

	var $StudentDetailsLength = $('.EduTypeDetailsLength');
	if($StudentDetailsLength.val() === '0')
		return;

	var ajaxUrl = '/backend/StudentMgr/GetSortContent/' + $StudentDetailsLength.attr('data-studentId');
	$.ajax({
		type: 'GET',
		url: ajaxUrl,
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			if (data.AjaxResult === true) {
				_.forEach(data.StudentOptions,function(option){
					$('option[value="' + option + '"]').prop('selected', true);
				})
			}
			else {
				updateErrorCallout(data.msg);
			}
		},
		error: function (data) {
			$('.studentEditSort_itemList').find('.studentEditSort_itemWrap').remove();
			alert('获取数据失败');
		}
	})

};

$(function(){
	$('[data-toggle=tooltip]').tooltip();

	initStudentSort();

	var $EduTypeList = $('.eduTypeList');
	$EduTypeList.delegate('.btnEduType','click',function(e){
		e.preventDefault();
		if($(this).hasClass('btn-success'))
			return;
		else{
			$EduTypeList.find('.btnEduType.btn-success').removeClass('btn-success');
			$(this).addClass('btn-success');
			$('.noEduTypeSelect').addClass("hidden");

			var eduTypeId = $(this).attr('data-typeId');
			var ajaxUrl = '/backend/SortMgr/EduTypeDetails/' + eduTypeId;
			$.ajax({
				type: 'GET',
				url: ajaxUrl,
				dataType: 'json',
				contentType: 'application/json; charset=utf-8',
				success: function (data) {
					if (data === null || data.length <= 0) {
						$('.noEduTypeDetails').removeClass('hidden').find('a').attr('href','/backend/SortMgr/EditDetails/' + eduTypeId);
						$('.studentEditSort_itemList').find('.studentEditSort_itemWrap').remove();
					}
					else {
						$('.noEduTypeDetails').addClass('hidden');
						renderDetails($('.studentEditSort_itemList'),data,eduTypeId);
					}
				},
				error: function (data) {
					$('.studentEditSort_itemList').find('.studentEditSort_itemWrap').remove();
					alert('获取数据失败');
				}
			})
		}
	});

	var $btnSubmitSort = $('.submitSort');
	$btnSubmitSort.on('click',function(e){
		e.preventDefault();
		var studentId = $(this).attr('data-studentId');
		var eduTypeId = '';

		var $IsSignEduType = $('.IsSignEduType');
		if($IsSignEduType.val() === 'false'){
			if($EduTypeList.find('.btnEduType.btn-success').length <= 0){
				return updateErrorCallout('请先选择留学类型。')
			}else{
				eduTypeId = $EduTypeList.find('.btnEduType.btn-success').attr('data-typeId');
			}
		}else{
			eduTypeId = $IsSignEduType.attr('data-typeId');
		}

		var optionList = [];
		var $itemWrapList = $('.studentEditSort_itemWrap');
		$itemWrapList.each(function(){
			if($(this).find('select').length > 0){
				var optionId = $(this).find('select').val();
				if(optionId !== '')
					optionList.push(optionId);
			}
		});

		var ajaxData = {
			optionList:optionList,
			studentId:studentId,
			eduTypeId:eduTypeId
		};

		var ajaxUrl = '/backend/StudentMgr/EditSort/' + studentId;

		$.ajax({
			type: 'POST',
			url: ajaxUrl,
			data:JSON.stringify(ajaxData),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				if (data.EditResult) {
					window.location = '/backend/StudentMgr/List';
				}
				else {
					updateErrorCallout(data.msg);
				}
			},
			error: function (data) {
				$('.studentEditSort_itemList').find('.studentEditSort_itemWrap').remove();
				$EduTypeList.find('.btnEduType.btn-success').removeClass('btn-success');
				alert('获取数据失败');
			}
		})

	})
});