var mysql = require('mysql');
var connection;

if (process.env.JAWSDB_URL) {
	connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
	connection = mysql.createConnection({
		socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
		port: 3306,
		user: 'root',
		password: 'root',
		database: 'my_schema'
	});
};

connection.connect();
module.exports  = connection;