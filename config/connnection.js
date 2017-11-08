var mysql = require('mysql');
var connection;


	connection = mysql.createConnection(process.env.JAWSDB_URL);


connection.connect();
module.exports  = connection;