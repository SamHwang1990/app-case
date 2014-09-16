/**
 * Created by sam on 14-9-16.
 * 留学类型：高中、本科、研究生
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EduTypeSchema = new Schema({
    name:{type:String},
    name_slog:{type:String},
    sort_id_list:{type:[ObjectId]},
    remark:{type:String}
});

mongoose.model('EduType', EduTypeSchema);
