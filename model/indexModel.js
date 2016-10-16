data = [];

function indexModel(){

	this.mysql = require('mysql');

	this.conn = this.mysql.createConnection({

		host : 'localhost',

		user : 'root',

		password : ''

	});

	this.database = 'library_db';

	this.conn.query('use '+this.database);

}

var IndexModel = new indexModel();
//传出model文件
exports.IndexModel = IndexModel;