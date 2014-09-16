/**
 * Created by sam on 14-9-16.
 */

var path = require('path');
var pkg = require('./package.json');

var debug = true;

var config = {
    //debug 为 true 时，用于本地调试
    debug:debug,

    mini_assets:!debug, //是否启用静态文件的合并压缩

    name:'AppCase',     //程序名字
    description:'App Case 是用 Node.js 开发的公司案例程序',    //程序描述

    // 添加到 html head 中的信息
    site_headers:[
        '<meta name="author" content = "sam@app" />',
    ],
    site_logo:'<img src="/public/images/logo.png" title="申博成功案例|专业的留学申请机构" />', //default is 'name'
    site_icon:'public/images/app_icon_32.png',
    // 社区的域名
    host: 'localhost',

    // mongodb 配置
    db: 'mongodb://127.0.0.1/app_case_dev',
    db_name: 'app_case_dev',

    session_secret: 'app_case', // 务必修改

    // 程序运行的端口
    port: 3000,

    // 案例列表显示的数量
    list_case_count: 20,

    // site links
    site_links: [
        {
            'text': 'APP 官网',
            'url': 'http://www.appedu.org/'
        },
        {
            text: 'APP CRM',
            url: '192.168.1.100'
        },
        {
            text: 'Top Offer 官网',
            url: 'http://www.topoffer.cn/'
        },
    ],

    // 邮箱配置
    mail_opts: {
        host: 'mail.appedu.org',
        auth: {
            user: 'service1@appedu.org',
            pass: 'service1408458'
        }
    },

    // admin 可进入后台管理
    admins: { user_login_name: true },

    //文件上传配置
    //注：如果填写 7牛access，侧会上传到 7牛，以下配置无效
    upload: {
        path: path.join(__dirname, 'public/upload/'),
        url: '/public/upload/'
    }
};

module.exports = config;
module.exports.config = config;