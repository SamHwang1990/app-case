/**
 * Created by sam on 14-10-10.
 */

$(function(){
	$("#studentlist_table").bootstrapTable({
		method: 'get',
		url: '/backend/StudentMgr/ajaxList',
		cache: false,
		striped: true,
		pagination: true,
		sidePagination:"client",
		pageSize: 10,
		pageList: [10, 25, 50, 100, 200],
		showColumns: true,
		showRefresh: true,
		showToggle:true,
		minimumCountColumns: 2,
		toolbar:"#studentlist_table_toolbar",
		formatLoadingMessage:function(){
			return '数据加载中，请稍后！'
		},
		formatRecordsPerPage:function(pageNumber){
			return pageNumber + '&nbsp;条每页';
		},
		formatShowingRows:function(pageFrom, pageTo, totalRows){
			//Showing %s to %s of %s rows
			return '第&nbsp;' + pageFrom + '&nbsp;条到第&nbsp;' + pageTo + '&nbsp;条&nbsp;共&nbsp;' + totalRows + '&nbsp;条&emsp;';
		},
		formatNoMatches:function(){
			return '没有找到符合条件的记录！'
		},
		columns: [{
			field: 'name',
			title: '中文名',
			align: 'left',
			halign: 'left',
			valign: 'middle',
			sortable: true
		}, {
			field: 'create_date',
			title: '创建时间',
			align: 'left',
			halign: 'left',
			valign: 'middle',
			sortable: true
		},{
			field: 'last_edit_date',
			title: '上次修改时间',
			align: 'left',
			halign: 'left',
			valign: 'middle',
			sortable: true
		},{
			field: '_id',
			title: '操作',
			align:'center',
			valign:'middle',
			switchable:false,
			formatter: function (value) {
				if (!value) {
					return '-';
				}
				var execArray = [];
				execArray.push('<a href="/backend/StudentMgr/Edit/' +
					value +
					'" title="' +
					value +
					'">修改信息</a>');

				execArray.push('<a href="/backend/StudentMgr/EditSort/' +
					value +
					'" title="' +
					value +
					'">修改分类</a>');

				execArray.push('<a href="/backend/StudentMgr/EditResume/' +
					value +
					'" title="' +
					value +
					'">修改案例</a>');

				execArray.push('<a href="/backend/StudentMgr/EssayList/' +
					value +
					'" title="' +
					value +
					'">查看文书</a>');

				execArray.push('<a href="/backend/StudentMgr/Delete/' +
					value +
					'" title="' + value +
					'">删除学生</a>');
				return execArray.join('&emsp;');
			}
		}]
	})
});
