const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieparser = require('cookie-parser');
const {requireauth, check} = require('./middleware/authmiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieparser());


// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://hikmet:HuXUF55h1ptVMIbt@cluster0.p7xtcnm.mongodb.net/nodeJWT?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*',check);
app.get('/',requireauth, (req, res) => res.render('home'));
app.get('/smoothies', requireauth, (req, res) => res.render('smoothies'));
app.use(authRoutes);


// app.get('/set-cookies',(req,res)=>{
//   // res.setHeader('Set-cookie','newuser=true');

//   res.cookie('newuser',false);
//   res.send('cookies');
// });

// app.get('/read-cookies',(req,res)=>{

//   const cookies = req.cookies;
//   console.log(cookies);

//   res.json(cookies); 

// }); 