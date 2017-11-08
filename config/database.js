// config/database.js
module.exports = {
    'connection': {
        "socketPath": "/Applications/MAMP/tmp/mysql/mysql.sock",
        'user': 'root',
        'password': 'root'
    },
	'database': 'my_schema',
    'users_table': 'users',
    'posts_table':'posts',
};