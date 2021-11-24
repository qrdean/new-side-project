import * as mysql from 'mysql'

/**
 * Creates the connection to the database. 
 * TODO: put into environment variables 
 * @returns mysql.Connection
 */
export function createConnection(): mysql.Connection {
    return mysql.createConnection({
        host: '0.0.0.0',
        user: 'principle',
        password: 'my-secret-pw',
        database: 'test_db',
        port: 24156
    });
}

/**
 * makes a database connection and returns that mysql.Connection
 * @param conn - mysql.Connection
 */
export function connect(conn: mysql.Connection): void {
    conn.connect(function(err) {
        if (err) throw err;
        console.log('Database is connected successfully!');
    });
}

/**
 * disconnects the current connection
 * @param conn - mysql.Connection
 */
export function disconnect(conn: mysql.Connection): void {
    conn.end((err) => {
        if (err) throw err;
        console.log('Database disconnected successfully!')
    })

}

export function makeACall(conn: mysql.Connection): void {

}
