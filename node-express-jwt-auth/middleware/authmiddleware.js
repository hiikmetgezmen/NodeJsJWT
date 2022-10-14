const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireauth = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token)
    {
        jwt.verify(token,'jwt',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
};


const check = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token)
    {
        jwt.verify(token,'jwt',async (err,decodedToken)=>{
            if(err)
            {
                console.log(err.message);
                next();
                res.locals.user =null;
            }
            else
            {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }
};

module.exports = {requireauth,check};