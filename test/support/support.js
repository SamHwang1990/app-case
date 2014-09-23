/**
 * Created by sam on 14-9-23.
 */

var User = require('../../proxy/user');

function randomInt() {
    return (Math.random() * 10000).toFixed(0);
}

exports.createUser = function (callback) {
    var key = new Date().getTime() + '_' + randomInt();
    User.newAndSave('sam' + key, 'sam' + key, 'pass', 'sam' + key + '@domain.com', '', false, callback);
};
