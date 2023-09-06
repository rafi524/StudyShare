const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth').auth;
const {
    signupGetController,
    signupPostController,
    signupcompanyGetController,
    signupcompanyPostController,
    signinGetController,
    signinPostController,
    logoutController
} = require('../controllers/authenController')
/*
const signupValidator = [
    body('username')
        .isLength({ min: 2, max: 20 })
        .withMessage('User name must be between 2 to 20 characters')
        .custom(async username => {
            uid =await dbAuth.getUIDByUserName(username);
            if (uid) {return Promise.reject('User Name already used');}
        }).trim
    ,
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .custom(async email => {
            uid = await dbAuth.getUIDByEmail(email);
            if (uid) {return Promise.reject('Email already used');}
        })
        .normalizeEmail()
    ,
    body('password')
    .isLength({min:6}).withMessage('Password must be at least 6 characters')
    ,
    body('cpassword')
    .custom((cpassword,{req})=>{
        if(cpassword!=req.body.password)
        throw new Error('Password does not match') 
    })
]
*/
router.get('/signup', signupGetController);
router.post('/signup',signupPostController);
router.get('/signupcompany', signupcompanyGetController);
router.post('/signupcompany', signupcompanyPostController);
router.get('/signin',signinGetController);
router.post('/signin', signinPostController);
router.get('/logout',auth ,logoutController);

module.exports = router;

