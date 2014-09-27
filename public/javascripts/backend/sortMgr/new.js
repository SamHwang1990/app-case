/**
 * Created by sam on 14-9-27.
 */

(function(){

	//组合Sort Info的编辑表单
	var genEditFormHtml = function(name, slug, description, remark){

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
	var editBox = function($wrapEl, ajaxUrl, sortId, sortGrade){

	};

	//更新SortItem的Dom内容
	var updateSortItemDom = function($wrapEl, updateData){

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

		});

		$('.sort_eduType_item_remove').on('click',function(event){
			var $itemEl = $(this).parents('.sort_eduType_item');
			var itemId = $itemEl.attr('data-id');
			var itemGrade = $itemEl.attr('data-grade');
			deleteBox($itemEl,'',itemId,itemGrade);
		});

		$('.sort_eduType_item_addOption').on('click',function(event){

		});

		$('.sort_eduType_item_editOption').on('click',function(event){

		});

		$('.sort_eduType_item_removeOption').on('click',function(event){
			var $optionEl = $(this).parents('.sort_eduType_item_option');
			var optionId = $optionEl.attr('data-id');
			var optionGrade = $optionEl.attr('data-grade');
			deleteBox($optionEl,'',optionId,optionGrade);
		});
	})

})();