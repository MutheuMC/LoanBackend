const express = require('express')
const cors = require('cors')
require('dotenv').config();

const verifyToken = require('./middleware/verifyToken');
const UserRoutes = require('./routes/user')
const LoanRoutes = require('./routes/loan')



const app = express()
const PORT = process.env.PORT  || 5000


app.use(cors());
app.use(express.json())

app.use('/users', UserRoutes);
app.use('/loans', LoanRoutes);


app.get("/", (req, res)=>{
    res.send('Hello world')
})










app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})