const express = require('express')
const app = express();
const connectDb = require('./config/db')
const cors = require('cors')
// connect db
connectDb()

// init middleware
app.use(express.json({ extended: false }))
app.use(cors())
app.get('/', (req, res) => {
    res.send("api running")
})

// Define Routes
app.use('/api/users', require('./routes/api/user'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})