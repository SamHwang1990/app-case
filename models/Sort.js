/**
 * Created by sam on 14-9-16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var SortSchema = new Schema({
	name:{type:String},         //分类名称
	slug:{type:String},         //分类英文名
	grade:{type:Number},        //分类级别：0-留学类别,1-筛选类别,2-筛选内容
	description:{type:String},  //描述，前台页面展示
	remark:{type:String},       //后台备注之用
	ancestors:{type:[{}]},      //祖先分类数组
	parent_id:{type:ObjectId}   //父分类id

});

mongoose.model('Sort', SortSchema);