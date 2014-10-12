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
				'<option>请选择分类选项</option>';
		_.forEach(options, function(option){
			message =
				'<option data-eduTypeItemOptionId="' + option._id + '">' + option.name + '</option>';
			outputHtml += message;
		});
		outputHtml += '</select>';
	}

	return outputHtml;
};

$(function(){
	$('[data-toggle=tooltip]').tooltip();

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
});