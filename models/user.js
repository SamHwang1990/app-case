/**
 * Created by sam on 14-9-16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;
var utility = require('utility');

var UserSchema = new Schema({
    name:{type:String},
    name_en:{type:String},
    pass:{type:String},
    email:{type:String},
    url:{type:String},
    avatar:{type:String},
    is_block:{type:Boolean, default:false},
    create_date:{type:Date},
    last_login_date:{type:Date}
});

UserSchema.virtual('avatar_url').get(function(){
    var url = this.avatar || ('http://www.gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48');
    return url;
});

UserSchema.index({name:1});
UserSchema.index({email:1}, {unique:true});

mongoose.model('User', UserSchema);