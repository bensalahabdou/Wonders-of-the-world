const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
 
require('dotenv').config();

const userRoute = require('./routes/user');
const { authenticateToken, userChecker } = require('./middleware/auth');

// set up express app 

const app = express();

// connect mongodb

mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true , useUnifiedTopology: true })
.then(result => app.listen(3000, () => {
    console.log('the server is running in port 3000')
}))
.catch(err => console.log(err));

mongoose.set('useCreateIndex', true)

// set up the template engine

app.set('view engine', 'ejs')


//Middleware

app.use(cookieParser());
app.use(express.json());

//Routing

app.use(userRoute)

app.get('*', userChecker)

app.get('/', (req,res)=>{
    res.render('pages/home', {title: "home"})
})
app.get('/home', (req,res)=>{
    res.render('pages/home', {title: "home"})
})


app.get('/wonders', authenticateToken, (req,res)=>{
    res.render('pages/marvels', {title: "seven wonders of the world"})
})


