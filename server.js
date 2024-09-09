const express = require('express')
const app = express();
const port =3000
const cors = require('cors');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});





const user_details = require('./routes/user_details');
app.use('/user_details', user_details);


app.listen(port,()=>{
    console.log(`server is running on this port , ${port}`)
})