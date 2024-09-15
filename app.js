const express = require('express')
const cors = require('cors')
require('dotenv').config();

const verifyToken = require('./middleware/verifyToken');
const UserRoutes = require('./routes/user')
const LoanRoutes = require('./routes/loan')
const ApplicantRoutes =require('./routes/applicants')



const app = express()
const PORT = process.env.PORT  || 5000


app.use(cors());
app.use(express.json())

app.use('/users', UserRoutes);
app.use('/loans', LoanRoutes);
app.use('/applicants', ApplicantRoutes);


app.use('/uploads', express.static('path/to/your/uploads/directory'));




app.get("/", (req, res)=>{
    res.send('Hello world')
})










app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})