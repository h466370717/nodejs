//引用model文件
var IndexCtroller = require('../model/indexModel').IndexModel;

IndexCtroller.show = function(req,res){

	this.conn.query('select * from articles order by id desc limit 6',function(err,results){

		data = results;

		res.render('index',{ data:data,user:req.session.username});

		data = [];
	});

}

IndexCtroller.checkUser = function(req,res,json,fn=null,fn2=null){
	this.conn.query('select * from user where username = ?',json['username'],function(err,results){
		if (results.length<1) {
			fn();
		}else{
			if (fn2) {
				if (results[0].password==json['password']) {
					fn2();//用来设置session
				}else{
					res.end('账号密码错误');
				}
			}else{
				res.end('用户已存在');
			}
		}
	})
}

IndexCtroller.insUser = function(req,res,json){
	var obj = this;
	obj.checkUser(req,res,json,function(){
		obj.conn.query('insert into user set ?',json,function(err,results){
			if (err) {
				res.end('注册失败，请重试');
			}
			if (results) {
				res.end('注册成功！');
			};
		})
	})

}
IndexCtroller.login = function(req,res,json){
	this.checkUser(req,res,json,null,function(){
		req.session.username = json['username'];
		res.end('登陆成功');
	})
}
IndexCtroller.addArticle = function(req,res,json){
	this.conn.query('insert into articles set ?',json,function(err,results){
		if (err) {
			res.end('发表失败，请重试');
		}
		if (results) {
			res.end('发表成功！');
		};
	})
}
IndexCtroller.upImage = function(req,res,obj,fs){
	//生成multiparty对象，并配置上传目标路径
	 
	  //上传完成后处理
	  obj.parse(req, function(err, fields, files) {
	    var filesTmp = JSON.stringify(files,null,2);
	    console.log(files);
	    if(err){
	      console.log('parse error: ' + err);
	    } else {
	      console.log('parse files: ' + filesTmp);
	      var inputFile = files.file[0];
	      var uploadedPath = inputFile.path;
	      var imgPath = '/uploadFile/files/'+inputFile.originalFilename;//引用图片路径
	      var dstPath = '../public/uploadFile/files/' + inputFile.originalFilename;//上传图片路径
	      //重命名为真实文件名
	      fs.rename(uploadedPath, dstPath, function(err) {
	        if(err){
	          console.log('rename error: ' + err);
	        } else {
	        	// fs.unlink(uploadedPath);
	          	console.log('rename ok');
	        }
	      });
	    }
	    res.end(imgPath);
	 });
}

IndexCtroller.checkLogin = function(req,res,json,fn){
	if (json) {
		fn();
	}else{
		res.render('login')
	}
}

IndexCtroller.init = function(req,res){
	var obj = this.conn;
	var data = {username:'admin',password:'admin'};
	var user = 'user';
	var article = 'articles';
	obj.query('create table '+user+' (id int not null primary key auto_increment,username varchar(15) not null,password varchar(15) not null)',function(){
		obj.query('insert into user set ?',data);
		obj.query('create table '+article+' (id int not null primary key auto_increment,title varchar(15) not null,date varchar(15) not null,body text not null,author varchar(15) not null,pic varchar(40) not null)',function(err,results){
			res.render('index');
		})
	});
	
}
//传出控制器
exports.IndexCtroller = IndexCtroller;