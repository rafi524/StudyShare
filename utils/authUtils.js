// libraries
const jwt = require('jsonwebtoken');

// my modules
const dbAuthuth = require('../db/dbAuth.js');

// function to login user into a session
async function userLogin(res, ID){
    // create token
    const payload = {
        id: ID
    };
    let token = jwt.sign(payload, 'secret');
   
    // set token in cookie
    let options = {
        maxAge: 90000000, 
        httpOnly: true
    }
    res.cookie('sessionToken', token, options);
}

async function loginAdmin(res, ID){
    // create token
    const payload = {
        id: ID
    };
    let token = jwt.sign(payload, 'secret');
   
    // set token in cookie
    let options = {
      expiresIn: 1,
        httpOnly: true
    }
    res.cookie('adminSessionToken', token, options);
}

module.exports = {
    userLogin
    
}