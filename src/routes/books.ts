import { randomUUID } from 'crypto'
import express from 'express'

export const bookRouter = express.Router()

// book information
let masterBooks: any[] = []
// Book quantity and checkout
let bookInventory: any[] = []

bookRouter.get('/find', (req, res) => {
    const masterBook = masterBooks.find(book => book.title === req.body.title)
    if (masterBook == null) {
        return res.status(400).send({ message: 'book not found'})
    }

    const inventoryCount = bookInventory.filter(book => book.master_book_id === masterBook.id).length
    masterBook.qty = inventoryCount

    res.send({ book: masterBook })
})

// Need to think about these two things ito how these queries will work.
// Do we want to pull just the entire book list and then just the inventory
// or combine those queries in to one big pull of info? Or Something else?
bookRouter.get('/masterBookList', (req, res) => {
    if (masterBooks.length === 0) {
        return res.send({ message: 'No master books'})
    }
    res.send({ masterBooksList: masterBooks })
})

bookRouter.get('/allInventory', (req, res) => {
    if (bookInventory.length === 0) {
        return res.send({ message: 'No books'})
    }
    res.send({ books: bookInventory})
})

/**
 * Finds all books that are currently available
 */
bookRouter.get('/available', (req, res) => {
    const availableBooks = bookInventory.filter(book => book.checked_out_to_user_id === null)
    if (availableBooks.length === 0) {
        return res.send({ message: 'No books available'})
    }
    res.send({ books: availableBooks })
})

/**
 * Takes an object of:
 * @param lccn - string
 * @param isbn - string
 * @param title - string
 * @param author - string
 * @param publishDate - Date
 */
bookRouter.post('/addMaster', (req, res) => {
    // add to db
    masterBooks.push({
        id: randomUUID(),
        lccn: req.body.lccn,
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate,
    })
    res.send({ message: 'book added'})
})

/**
 * Takes the id of the master book list
 */
bookRouter.post('/addInventory', (req, res) => {
    const book = masterBooks.find(book => book.id === req.body.id)
    if (book == null) {
        res.send({ message: 'no master book found by that Id'})
    }
    bookInventory.push({
        id: randomUUID(),
        master_book_id: req.body.id,
        checked_out_to_user_id: null,
    })
    res.send({ message: 'book added to inventory '})
})


bookRouter.post('/checkout', (req, res) => {
    // In real app we will grab by ID because front end will have this information
    const availableBookIndex = bookInventory 
        .findIndex(book => book.checked_out_to_user_id === null && book.id === req.body.id)
    const availableBook = bookInventory[availableBookIndex]
    if (availableBook == null) {
        return res.send({ message: 'Book cant be checked out'})
    }

    availableBook.checked_out_to_user_id = req.body.userId
    bookInventory[availableBookIndex] = availableBook
    res.send({ message: `book checked out by ${req.body.userId}`})
})