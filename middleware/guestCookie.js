// libraries
const jwt = require('jsonwebtoken');

// my modules
const dbAuth = require('../db/dbAuth');

function guest(req, res, next){
    
    // check if user has cookie token
    if(req.cookies==null){
        const payload = {
            id: -1
        };
        let token = jwt.sign(payload, 'secret');
       
        // set token in cookie
        let options = {
            maxAge: 90000000,
            httpOnly: true
        }
        res.cookie('sessionToken', token, options);
        console.log('guest cookie created');
         next();
        
    }
    else{
        next();
    }
   
               
   
}



module.exports = {
   guest
};