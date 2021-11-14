import express from 'express';
import passport from 'passport'

import { createConnection, connect, disconnect } from './dbConnection'
import { userRouter } from './routes/user';
import { bookRouter } from './routes/books'

const app = express();

app.use(express.json())

app.use('/user', userRouter)
app.use('/book', bookRouter)
app.use(passport.initialize())

app.get('/', (req,res) => res.send('Express + TypeScript Server'));

// FIXME: remove this! not going to be an actual route.
// Just for testing. Need to add jest
app.get('/dbconnect', async (req, res) => {
    // create connection object
    let conn = createConnection()
    // connect to db
    connect(conn)
    
    setTimeout(() => {
        disconnect(conn)
        res.send({ message: 'Done'})
    }, 3000);

})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`)
})
