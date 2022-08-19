import * as mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.DB_HOST || '0.0.0.0',
    user: process.env.DB_USER || 'root',
    database: process.env.DATABASE || 'test_db',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 2107,
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
        console.error("result: ", result)
        return[]
        //throw new Error('Post with this id was not found')
    }
    return result[0][0]
}

export async function getUserById(id: number): Promise<any> {
    const query = 'SELECT * FROM library_user WHERE id = ?'
    const result: any = await pool.query(query, [id])
    if (result[0].length < 1) {
        console.error("result: ", result)
        return[]
        // throw new Error('Post with this id was not found')
    }
    return result[0][0]
}

export async function insertUser(userObject: any): Promise<void> {
    const query = 'INSERT INTO library_user SET name = ?, email = ?, password = ?'
    const result = await pool.query(query, [userObject.name, userObject.email, userObject.password])
    console.log(result)
    console.log(result[0])
}


/**
* MASTER BOOK QUERIES
*/
export async function getMasterBookList(): Promise<any> {
    const query = 'SELECT * FROM master_book'
    const result: any = await pool.query(query)
    if (result[0].length < 1) {
        console.error("result: ", result)
        return []
        //throw new Error('No Master books')
    }
    return result[0]
}

export async function addMasterBook(masterBook: any): Promise<any> {
    const query = `INSERT INTO master_book SET lccn = ?, isbn = ?, title = ?, 
        author = ?, publishDate = ?`
    return await pool.query(query,
        [masterBook.lccn, masterBook.isbn, masterBook.title, masterBook.author,
        masterBook.publishDate])
}

export async function getAllBooks(): Promise<any> {
    const query = `SELECT 
        book_inventory.id,
        book_inventory.master_id,
        book_inventory.location_id,
        master_book.author,
        master_book.title,
        master_book.lccn,
        master_book.isbn,
        master_book.publishDate
        FROM book_inventory INNER JOIN master_book 
        on book_inventory.master_id = master_book.id;`
    
    const result: any = await pool.query(query)
    if (result[0].length < 1) {
        console.error("result: ", result)
        return []
    }
    return result[0]
}

export async function getBookById(id: any): Promise<any> {
    const query = `SELECT * FROM master_book as mb 
        INNER JOIN book_inventory as ib
        ON ib.master_id = mb.id
        WHERE ib.id = ?;
    `
    const result: any = await pool.query(query, [id])
    if (result[0].length < 1) {
        console.error('result: ', result)
        return []
    }
    return result[0][0]
}

export async function addToInventoryByMasterId(id: any): Promise<any> {
    const query = `INSERT INTO book_inventory SET master_id = ?`
    await pool.query(query, [id])
}

export async function editBookInventoryLocation(bookId: any, inventoryLocationId: any): Promise<any> {
    const query = `UPDATE book_inventory SET location_id = ? WHERE id = ?`
    const result: any = await pool.query(query, [inventoryLocationId, bookId])
    if (result[0].length < 1) {
        console.error("result: ", result)
        return []
    }
    return result[0]
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
        console.error("result: ", result)
        return []
    }
    return result[0]
}

export async function getAvailableBook(id: any): Promise<any> {
    const query: string = 'SELECT * FROM book_inventory WHERE id = ?'
    const result: any = await pool.query(query, [id])
    if (result[0].length < 1) {
        return null
    }
    return result[0][0]
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

export async function addInventoryLocation(inventoryLocation: any): Promise<any> {
    const query = `INSERT INTO inventory_location SET location_name = ?;`
    return await pool.query(query, [inventoryLocation.locationName])
}

export async function setInventoryLocationActive(inventoryLocation: any): Promise<any> {
    const query = `UPDATE inventory_location SET active = ? WHERE id = ?;`
    return await pool.query(query, [inventoryLocation.active, inventoryLocation.id])
}

export async function getInventoryLocations(): Promise<any> {
    const query = `SELECT * FROM inventory_location;`

    const result: any = await pool.query(query)
    if (result[0].length < 1) {
        console.error("result: ", result)
        console.error("No Inventory To get")
        return []
    }
    return result[0]
}

export async function deleteInventoryLocation(inventoryLocation: any): Promise<any> {
    const query = `DELETE FROM inventory_location WHERE id = ?;`
    const result: any = await pool.query(query, [inventoryLocation.id])
    if (result[0].length < 1) {
        console.error("result: ", result)
        console.error("id not found")
        return []
    }
    return result[0]

}