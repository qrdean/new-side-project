import * as mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: '0.0.0.0',
    user: 'root',
    database: 'test_db',
    port: 1234,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// TODO: Create models for input and output
/**
* USER QUERIES 
*/

// Gets the User by the email. Uses the above pool
export async function getUserByEmail(email: string): Promise<any> {
    const query = 'SELECT * FROM library_user WHERE email = ?'
    const result: any = await pool.query(query, [email])
    if (result[0].length < 1) {
        throw new Error('Post with this id was not found')
    }
    return result[0][0]
}

export async function getUserById(id: number): Promise<any> {
    const query = 'SELECT * FROM library_user WHERE id = ?'
    const result: any = await pool.query(query, [id])
    if (result[0].length < 1) {
        throw new Error('Post with this id was not found')
    }
    return result[0][0]
}

export async function insertUser(userObject: any): Promise<void> {
    const query = 'INSERT INTO library_user SET name = ?, email = ?, password = ?'
    await pool.query(query, [userObject.name, userObject.email, userObject.password])
}


/**
* MASTER BOOK QUERIES
*/
export async function getMasterBookList(): Promise<any> {
    const query = 'SELECT * FROM master_book'
    const result: any = await pool.query(query)
    if (result[0].length < 1) {
        throw new Error('No Master books')
    }
    return result[0]
}

export async function addMasterBook(masterBook: any): Promise<any> {
    const query = `INSERT INTO master_book SET lccn = ?, isbn = ?, title = ?, 
        author = ?, publishDate = ?`
    await pool.query(query,
        [masterBook.lccn, masterBook.isbn, masterBook.title, masterBook.author,
        masterBook.publishDate])
}

export async function addToInventoryByMasterId(id: any): Promise<any> {
    const query = `INSERT INTO book_inventory SET master_id = ?`
    await pool.query(query, [id])
}

export async function getAvailableBooks(): Promise<any> {
    const query: string = `
        SELECT * FROM master_book as mb
        INNER JOIN book_inventory as ib
        ON ib.master_id = mb.id
        WHERE ib.user_id IS NULL;
    `
    const result: any = await pool.query(query)
    if (result[0].length < 1) {
        throw new Error('No available Books')
    }
    return result[0]
}

export async function checkoutBookToUser(inventoryBookId: any, userId: any): Promise<any> {
    const query: string = `
        UPDATE book_inventory
        SET user_id = ?
        WHERE id = ?;
    `
    await pool.query(query, [userId, inventoryBookId])
}

export async function checkInBook(inventoryBookId: any): Promise<any> {
    const query: string = `
        UPDATE book_inventory
        SET user_id = NULL
        WHERE id = ?;
    `
    await pool.query(query, [inventoryBookId])
}
