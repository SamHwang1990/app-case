/**
 * Created by sam on 14-9-27.
 */

(function(){

	//组合Sort Info的编辑表单
	var genEditFormHtml = function(sortId, name, slug, description, remark){
		var message =
		'<div class="row">  ' +
		'<div class="col-md-12"> ' +
		'<form role="form" class="sort_editForm" method="post"> ' +
		'<div class="form-group"> ' +
		'<label for="name">1. 留学类型名</label>' +
		'<input type="hidden" class="form-control" name="sort_id" value="'+ sortId + '" />' +
		'<input type="text" class="form-control" name="name" placeholder="留学类型名" value="'+ name + '" />' +
		'</div> ' +
		'<div class="form-group"> ' +
		'<label for="slug">2. 留学类型英文名</label>' +
		'<input type="text" class="form-control" name="slug" placeholder="留学类型英文名" value="'+ slug + '" />' +
		'</div> ' +
		'<div class="form-group"> ' +
		'<label for="description">3. 留学类型描述</label>' +
		'<input type="text" class="form-control" name="description" placeholder="留学类型描述，前台展示所用" value="'+ description + '" />' +
		'</div> ' +
		'<div class="form-group"> ' +
		'<label for="remark">4. 留学类型备注</label>' +
		'<textarea class="form-control" name="remark" placeholder="留学类型备注，管理人员所用">'+ remark + '</textarea>' +
		'</div> ' +
		'</form> </div>  </div>';
		return message
	};

	var genEditData = function(wrapEl){
		return {
			id:wrapEl.attr('data-id'),
			name:wrapEl.attr('data-name'),
			slug:wrapEl.attr('data-slug'),
			description:wrapEl.attr('data-description'),
			grade:wrapEl.attr('data-grade'),
			remark:wrapEl.attr('data-remark')
		}
	};

	var toggleNavTab = function(){
		var tabs = $(".sort_edit_tabs");
		var tabEduType = tabs.find('[data-href="#sort_eduType"]');
		var tabEduTypeDetail = tabs.find('[data-href="#sort_eduType_detail"]');

		var tabPaneEduType = $('#sort_eduType');
		var tabPaneEduTypeDatail = $('#sort_eduType_detail');

		tabEduType.parent('li').removeClass('active').addClass('disabled');
		tabEduType.removeAttr('href').attr('data-toggle','');
		tabPaneEduType.removeClass('active');

		tabEduTypeDetail.parent('li').removeClass('disabled').addClass('active');
		tabEduTypeDetail.attr('href',tabEduTypeDetail.attr('data-href')).attr('data-toggle','tab');
		tabPaneEduTypeDatail.addClass('active');
	};

	var resetCallout = function(){
		var $acCallout = $('.ac_callout');
		$acCallout.addClass('hidden');
		$acCallout.find('p').text('');
	};
	var updateSuccessCallout = function(successMsg){
		resetCallout();
		$('.ac_callout_info p').text("成功：" + successMsg);
		setTimeout(function(){
			resetCallout();
		},3000)
	};
	var updateErrorCallout = function(errMsg){
		resetCallout();
		$('.ac_callout_danger p').text("错误：" + errMsg);
		setTimeout(function(){
			resetCallout();
		},3000)
	};

	//处理删除Sort的box
	var deleteBox = function($wrapEl, ajaxUrl, sortId, sortGrade){
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
						alert('yes, i want to delete!/n SortId: ' + sortId + ', SortGrade: ' + sortGrade);
						$wrapEl.remove();
					}
				}
			}
		});
	};

	//处理编辑Sort的box
	var editBox = function($wrapEl, ajaxUrl){
		var editData = genEditData($wrapEl);
		bootbox.dialog({
			className:'sort_edit_box',
			message: genEditFormHtml(editData.id, editData.name, editData.slug, editData.description, editData.remark),
			buttons: {
				default: {
					label: "No",
					className: "btn-default",
					callback: function() {
						alert('cencel edit');
					}
				},
				primary: {
					label: "Yes",
					className: "btn-primary",
					callback: function() {
						alert('edit done');
						if(editData.grade === '1'){
							updateSortItemDom($wrapEl,editData);
						}else if(editData.grade === '2'){
							updateSortItemOptionDom($wrapEl,editData);
						}
					}
				}
			}
		});
	};

	//更新SortItem的Dom内容
	var updateSortItemDom = function($wrapEl, updateData){
		$wrapEl.find('.sort_eduType_item_name').text(updateData.name);
	};

	//更新SortItem-Option的Dom内容
	var updateSortItemOptionDom = function($wrapEl, updateData){

	};

	//插入新的SortItem
	var insertSortItemDom = function(insertData){

	};

	//插入新的SortItem-Option
	var insertSortItemOptionDom = function(insertData){

	};

	//移除SortItem的Dom
	var deleteSortItemDom = function($wrapEl){

	};

	//移除SortItem-Option的Dom
	var deleteSortItemOptionDom = function($wrapEl){

	};

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
	})

})();