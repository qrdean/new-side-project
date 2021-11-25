import express from 'express'

import { auth } from '../auth/auth'
import {
    getMasterBookList,
    addMasterBook,
    addToInventoryByMasterId,
    getAvailableBooks,
    getAvailableBook,
    checkoutBookToUser,
    checkInBook
} from '../db/dbPool'

export const bookRouter = express.Router()

// Need to think about these two things ito how these queries will work.
// Do we want to pull just the entire book list and then just the inventory
// or combine those queries in to one big pull of info? Or Something else?
bookRouter.get('/masterBookList', auth.optional, async (req, res) => {
    const masterBooks = await getMasterBookList()

    if (masterBooks.length === 0) {
        return res.send({ message: 'No master books' })
    }
    res.send({ masterBooksList: masterBooks })
})

/**
 * Finds all books that are currently available
 */
bookRouter.get('/available', async (req, res) => {
    const availableBooks = await getAvailableBooks()
    if (availableBooks.length === 0) {
        return res.send({ message: 'No books available' })
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
bookRouter.post('/addMaster', async (req, res) => {
    try {
        await addMasterBook({
            lccn: req.body.lccn,
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            publishDate: new Date(req.body.publishDate),
        })

        res.send({ message: 'Book Added' })
    } catch (err) {
        res.status(500).send({ message: "Error Adding Book" })
    }

})

/**
 * Takes the id of the master book list
 */
bookRouter.post('/addInventory', async (req, res) => {
    // Need a DB Call to check for the master book
    try {
        await addToInventoryByMasterId(req.body.master_id)
        res.send({ message: 'book added to inventory' })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Book not added to inventory' })
    }
})

bookRouter.post('/checkout', async (req, res) => {
    // In real app we will grab by ID because front end will have this information
    try {
        const availableBook = await getAvailableBook(req.body.id)
        if (availableBook == null) {
            console.log('Book is unavailable for checkout')
            res.status(400).send({ message: 'Book is unavailable for checkout' })
        }

        await checkoutBookToUser(req.body.id, req.body.userId)

        res.send({ message: `book checked out by ${req.body.userId}` })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Something went wrong' })
    }

})

bookRouter.post('/checkin', async (req, res) => {
    try {
        await checkInBook(req.body.id)
        res.send({ message: 'Book checked in' })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Something went wrong' })
    }
})
