const router = require('express').Router();
const { body } = require('express-validator');
const { 
    signupcompanyGetController,
    signupcompanyPostController,
} = require('../controllers/authenController');

const { 
    chomeGetController,
    chomePostController,
    vehiclesGetontroller,
} = require('../controllers/companyController');

router.get('/',chomeGetController);
router.post('/', chomePostController,)
router.get('/signup', signupcompanyGetController);
router.post('/signupcompany', signupcompanyPostController);
router.get('/vehicles',vehiclesGetontroller);


module.exports = router;