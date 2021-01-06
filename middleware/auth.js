const jwt = require('jsonwebtoken');
const User = require('../models/users');


function authenticateToken(req, res, next) {

    const token = req.cookies.jwt

    if(!token){
        res.redirect('/signin')
    }else{
       jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      
        if (err){
            res.redirect('/signin')
        }else{
            next()
        }
    })
  }
}
const userChecker = (req, res, next) => {

    const token = req.cookies.jwt
    
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      
            if (err){
                res.locals.user = null;
                next()
            }else{
                const user = User.findById(decoded.id)
                res.locals.user = user;
                next()
            }
        })
   
    }else{
        res.locals.user = null;
        next()
    }
}



module.exports = {
    authenticateToken,
    userChecker
};