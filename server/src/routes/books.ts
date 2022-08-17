import express from 'express'

import { auth } from '../auth/auth'
import {
    getMasterBookList,
    getAllBooks,
    addMasterBook, 
    addInventoryLocation,
    addToInventoryByMasterId,
    getAvailableBooks,
    getAvailableBook,
    checkoutBookToUser,
    checkInBook,
    setInventoryLocationActive, 
    deleteInventoryLocation,   
    getInventoryLocations,
    editBookInventoryLocation
} from '../db/dbPool'

export const bookRouter = express.Router()

// Need to think about these two things ito how these queries will work.
// Do we want to pull just the entire book list and then just the inventory
// or combine those queries in to one big pull of info? Or Something else?
bookRouter.get('/masterBookList', auth.optional, async (req, res) => {
    const masterBooks = await getMasterBookList()

    if (masterBooks.length === 0) {
        return res.send({ books: [], message: 'No master books' })
    }
    res.send({ books: masterBooks })
})

/**
 * Finds all books that are currently available
 */
bookRouter.get('/available', auth.optional, async (req, res) => {
    const availableBooks = await getAvailableBooks()
    if (availableBooks.length === 0) {
        return res.send({ books: [], message: 'No books available' })
    }
    res.send({ books: availableBooks })
})

bookRouter.get('/all', auth.optional, async (req, res) => {
    const books = await getAllBooks()
    if (books.length === 0) {
        return res.status(400).send({ books: [], message: 'No Books'})
    }

    res.send({ books: books })
})

/**
 * Takes an object of:
 * @param lccn - string
 * @param isbn - string
 * @param title - string
 * @param author - string
 * @param publishDate - Date
 */
bookRouter.post('/addMaster', auth.optional, async (req, res) => {
    try {
        let dbResponse = await addMasterBook({
            lccn: req.body.lccn,
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            publishDate: new Date(req.body.publishDate),
        })

        if (dbResponse.length === 0) {
            res.status(500).send({ message: "Error Adding Book" })
            return
        }

        let masterId = dbResponse[0].insertId
        if (!masterId) {
            res.status(500).send({ message: "Error Adding To Inventory" })
        }
        await addToInventoryByMasterId(masterId)

        res.send({ message: 'Book Added' })
    } catch (err) {
        res.status(500).send({ message: "Error Adding Book" })
    }
})

bookRouter.post('/editBookInventoryLocation', auth.optional, async (req, res) => {
    try {
        let dbResponse = await editBookInventoryLocation(req.body.bookId, req.body.inventoryLocationId)

        if (dbResponse.length === 0) {
            res.status(500).send({ message: "Error Editing Book Location" })
            return
        }

        res.send({ message: 'Book Location Edited' })
    } catch (err) {
        res.status(500).send({ message: "Error Editing Book Location" })
    }
})

/**
 * Takes an object of:
 * @param locationName - String
 */
bookRouter.post('/addInventoryLocation', auth.optional, async (req, res) => {
    try {
        let dbResponse = await addInventoryLocation({ locationName: req.body.locationName })

        if (dbResponse.length === 0) {
            res.status(500).send({ message: "Error Adding Inventory Location" })
            return
        }

        res.send({ message: 'Inventory Location Added' })
    } catch (err) {
        res.status(500).send({ message: "Error Adding Inventory Location" })
    }
})

bookRouter.post('/editInventoryLocation', auth.optional, async (req, res) => {
    try {
        let dbResponse = await setInventoryLocationActive({ id: req.body.id, active: req.body.active })

        if (dbResponse.length === 0) {
            res.status(500).send({ message: "Error Editing Inventory Location" })
            return
        }

        res.send({ message: 'Inventory Location Edited' })
    } catch (err) {
        res.status(500).send({ message: "Error Editing Inventory Location" })
    }
})

bookRouter.get('/getInventoryLocations', auth.optional, async (req, res) => {
    try {
        let dbResponse = await getInventoryLocations()

        if (dbResponse.length === 0) {
            res.status(500).send({ message: "Error Getting Inventory Location" })
            return
        }

        res.send({ inventoryLocations: dbResponse, message: "Inventory Location List" })
    } catch (err) {
        res.status(500).send({ message: "Error Getting Inventory Location" })
    }
})

bookRouter.post('/deleteInventoryLocation', auth.optional, async (req, res) => {
    try {
        let dbResponse = await deleteInventoryLocation({ id: req.body.id })

        if (dbResponse.length === 0) {
            res.status(500).send({ message: "Error Removing Inventory Location"})
            return
        }

        res.send({ message: 'Inventory Location Removed'})
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: "Error Removing Inventory Location" })
    }
})


// TODO: Not implemented on the front end

// Checks the book to see if it is available
// if available sends the users id back
// id: Inventory Book id
// userId: id of the user
bookRouter.post('/checkout', async (req, res) => {
    // In real app we will grab by ID because front end will have this information
    try {
        const availableBook = await getAvailableBook(req.body.id)
        if (availableBook == null) {
            res.status(400).send({ message: 'Book is unavailable for checkout' })
        }

        await checkoutBookToUser(req.body.id, req.body.userId)

        res.send({ bookId: req.body.id, userId: req.body.userId, message: `book checked out by ${req.body.userId}` })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Something went wrong' })
    }
})

// check in the book
// id: id of the book_inventory
bookRouter.post('/checkin', async (req, res) => {
    try {
        await checkInBook(req.body.id)
        res.send({ bookId: req.body.id, message: 'Book checked in' })
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Something went wrong' })
    }
})
