import express from 'express';
import bcrypt from 'bcryptjs';
import {conn} from './dbConnection'
// import createError from 'http-errors'

const app = express();

app.use(express.json())

const PORT = 8000;
// Mock the User data for now
let users: any[] = []

app.get('/', (req,res) => res.send('Express + TypeScript Server'));

// ****** USER AUTH *******
/**
 * Login route
 */
app.post('/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(401).send({ message: 'Login Failed'})
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // return the user
            // Query the database for the user and return
            res.send({ user: { name: user.name, email: user.email }})
        } else {
            res.status(401).send({ message: 'unauthenticated'})
        }
    } catch {
        res.status(500).send()
    }
})

/**
 * Register route
 */
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // Save to db 
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.send({ message: 'did the thing'})
    } catch (err) {
        res.status(500).send(err)
    }
})

app.get('/dbconnect', async (req, res) => {

    conn
})


app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`)
})
