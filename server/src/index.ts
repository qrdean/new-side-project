import express from 'express';
import passport from 'passport'

// import { createConnection, connect, disconnect } from './dbConnection'
import { getUserByEmail, checkInBook } from './db/dbPool'
import { userRouter } from './routes/user';
import { bookRouter } from './routes/books'

const app = express();

app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE")
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/user', userRouter)
app.use('/book', bookRouter)
app.use(passport.initialize())


app.get('/', (req, res) => res.send('Express + TypeScript Server'));

// FIXME: remove this! not going to be an actual route.
// Just for testing. Need to add jest
app.get('/dbconnect', async (req, res) => {

    const masterBookObj = {
        lccn: "1234-1234",
        isbn: "12345",
        title: 'test_title1',
        author: 'test_author',
        publishDate: new Date('10/10/2020')
    }

    const result = await getUserByEmail('test@test.com')
    res.send(result)
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`)
})
