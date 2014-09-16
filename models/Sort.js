/**
 * Created by sam on 14-9-16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SortSchema = new Schema({
    name:{type:String},         //分类名称
    name_slot:{type:String},    //分类小名，英文哦
    content:{type:[String]},    //分类的内容
    remark:{type:String}
});

mongoose.model('Sort', SortSchema);