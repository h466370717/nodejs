var express = require('express');
var bodyParser = require('body-parser');//用来获取post参数的
var multer = require('multer');//用来获取post参数的
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var multiparty = require('multiparty');
var fs = require('fs');

var ueditor = require("ueditor");


var router = express.Router();

router.use(session({
	name:'sessionTest',
    secret: 'hubwiz app', //secret的值建议使用随机字符串
    cookie: {maxAge: 60 * 1000 * 30} // 过期时间（毫秒）
}));

router.use(bodyParser.urlencoded({extended:false}));//预防bodyParser过期问题

//引用控制器文件
var IndexCtroller = require('../controller/controller').IndexCtroller;

/* GET home page. */
router.get('/', function(req, res, next) {
	
	//使用控制器
	IndexCtroller.show(req,res);

});

router.use("/ueditor/ue", ueditor(path.join(__dirname, '../public'), function (req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        var img_url = 'uploadImages/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));


router.get('/signup', function(req, res, next) {
	// req.session.abc = 'sessionabc'; 
	// console.log(req.session.abc);
	res.render('signup', { title:req.session.username});

});

router.post('/signup', function(req, res, next) {

	IndexCtroller.insUser(req,res,req.body);

});

router.get('/login', function(req, res, next) {

	res.render('login', { title:'登陆'});

});

router.post('/login', function(req, res, next) {
	IndexCtroller.login(req,res,req.body);
});

router.get('/admin', function(req, res, next) {

	IndexCtroller.checkLogin(req,res,req.session.username,function(){
		res.render('admin');
	})
});
router.post('/admin', function(req, res, next) {
	IndexCtroller.checkLogin(req,res,req.session.username,function(){
		IndexCtroller.addArticle(req,res,req.body);
	})

});

router.post('/upload',function(req,res){
	var form = new multiparty.Form({uploadDir: '../public/uploadFile/'});
	IndexCtroller.upImage(req,res,form,fs);
	// console.log(req.files)
})

module.exports = router;