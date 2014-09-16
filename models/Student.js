/**
 * Created by sam on 14-9-16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    name:{type:String},
    name_en:{type:String},
    email:{type:String},
    url:{type:String},
    avatar:{type:String},

    profile_image_url: {type: String},      //个人照片
    resume_image_url:{type:String},         //申请摘要图片

    sort_content:{type:[{}]},               //分类信息列表
    essay_list:{type:[{}]},                 //文书列表

    remark:{type:String},

    is_block:{type:Boolean, default:false}
});

StudentSchema.index({name:1});
StudentSchema.index({name_en:1});
StudentSchema.index({email:1}, {unique:true});

mongoose.model('Student', StudentSchema);