import * as mysql from 'mysql'
export const conn = mysql.createConnection({
    host: '0.0.0.0',
    user: 'principle',
    password: 'my-secret-pw',
    database: 'test_db',
    port: 24156
});

conn.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully!');
});
module.exports = conn;
