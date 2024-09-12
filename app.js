const express = require('express')
const cors = require('cors')
require('dotenv').config();
const UserRoutes = require('../Loan/routes/user')



const app = express()
const PORT = process.env.PORT  || 5000


app.use(cors());
app.use(express.json())

app.use('/users', UserRoutes);

app.get("/", (req, res)=>{
    res.send('Hello world')
})










app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})