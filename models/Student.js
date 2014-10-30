/**
 * Created by sam on 14-9-16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    name:{type:String},

	profile_image: {type: String},      //个人照片
    resume_image:{type:String},         //申请摘要图片

    sort_content:{type:[]},             //分类信息列表
	edu_type:{type:String},

	essay_list:{type:[{}]},             //文书列表

    remark:{type:String},

	create_date:{type:String, default:Date(), get:function(val){
		return new Date(val);
	}},
    last_edit_date:{type:String, default:Date(), get:function(val){
	    return new Date(val);
    }}
});

StudentSchema.index({name:1});

mongoose.model('Student', StudentSchema);