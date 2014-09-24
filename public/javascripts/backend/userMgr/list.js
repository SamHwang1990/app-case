/**
 * Created by sam on 14-9-24.
 */

$(document).ready(function () {
	$("#userlist_table").bootstrapTable({
		method: 'get',
		url: '/backend/UserMgr/ajaxList',
		cache: false,
		height: 400,
		striped: true,
		pagination: true,
		sidePagination:"client",
		pageSize: 10,
		pageList: [10, 25, 50, 100, 200],
		showColumns: true,
		showRefresh: true,
		minimumCountColumns: 2,
		queryParams:function(params) {
			return {
				limit: params.pageSize,
				offset: params.pageSize * (params.pageNumber - 1)
			};
		},
		columns: [{
			field: 'state',
			checkbox: true
		}, {
			field: 'name',
			title: '中文名',
			align: 'left',
			halign: 'center',
			valign: 'middle'
		}, {
			field: 'name_en',
			title: '英文',
			align: 'left',
			halign: 'center',
			valign: 'middle'
		}, {
			field: 'email',
			title: 'Email',
			align: 'left',
			halign: 'center',
			valign: 'middle'
		}, {
			field: 'create_date',
			title: '创建时间',
			align: 'left',
			halign: 'center',
			valign: 'middle'
		},{
			field: 'last_login_date',
			title: '上次登录时间',
			align: 'left',
			halign: 'center',
			valign: 'middle'
		}]
	})
});
