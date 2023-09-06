const router = require('express').Router();
const dbAuth = require('../db/dbAuth.js');
const {
    searchBusGetController,
    searchBusPostController,
    busSeatGetController,
    busSeatPostController,
    searchHotelGetController,
    trainSeatGetController,
    trainSeatPostController,
  
} = require('../controllers/searchController.js')
const {
    booknowController,
    transactionController
} = require('../controllers/bookingControllers');
router.get('/',searchBusGetController);
router.get('/bus/seat/:id',busSeatGetController);
router.post('/bus/seat/:id',busSeatPostController);
router.get('/train/seat/:id',trainSeatGetController);
router.post('/train/seat/:id',trainSeatPostController);
router.post('/',searchBusPostController);
router.get('/hotel',searchHotelGetController);

//booking
router.post('/transaction/:rid',transactionController);
router.post('/booknow/:id',booknowController);
module.exports = router;
