// libraries
const jwt = require('jsonwebtoken');

// my modules
const dbAuth = require('../db/dbAuth');

function auth(req, res, next){
    req.user = null;
    req.currUrl=req.originalUrl;
    // check if user has cookie token
   
    if(req.cookies==null){
        console.log('cookie null bruh!');
         next();
    }
   else if(req.cookies.sessionToken!=null){
    
    console.log(req.cookies.sessionToken);

        let token = req.cookies.sessionToken;
        // verify token was made by server
        jwt.verify(token, 'secret', async (err, decoded) =>{
            if(err){
                console.log("ERROR at verifying token: " + err.message);
                next();
            } else {
                // get user prompt (id, handle, message count) from id
               
                const decodedId = decoded.id;
                
                let results = await dbAuth.getLoginInfoByID(decodedId);
                
                // if no such user or token doesn't match, do nothing
               if(results.length == 0){
               
                  
                
                
                console.log('auth: invalid cookie');

                }
                else{
                    // set prompt in reqest object
                    let time = new Date();
                  //  await DB_auth.updateLoginTimeById(decodedId, time);

                    req.user = {
                        id: decodedId,
                        userType:results[0].User_Type
                       
                    }
                }
                next();
            }
        });
    } else {
       
        next();
    }   
}

function adminAuth(req, res, next){
    req.admin = null;
    // check if user has cookie token
    if(req.cookies.adminSessionToken){
        let token = req.cookies.adminSessionToken;
        // verify token was made by server
        jwt.verify(token, 'secret', async (err, decoded) =>{
            if(err){
                console.log("ERROR at verifying token: " + err.message);
                next();
            } else {
                // get user prompt (id, handle, message count) from id
                const decodedId = decoded.superid;

                //let results = await DB_auth.getLoginInfoByID(decodedId);

                // if no such user or token doesn't match, do nothing
                if(decodedId !== 7){
                    //console.log('auth: invalid cookie');
                }else{

                    req.admin = {
                        NAME: 'Admin',
                    }
                }
                next();
            }
        });
    } else {
        next();
    }
}

module.exports = {
    auth,
    adminAuth
};