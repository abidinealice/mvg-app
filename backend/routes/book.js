const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sharp = require('../middlewares/sharp-config');

const bookCtrl = require('../controllers/book');

router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.bestThreeBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.ratingBook);

module.exports = router;