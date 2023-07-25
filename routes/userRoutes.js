const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup); //special cases; don't need update, patch anyting..
router.post('/login',authController.login);

router.route('/')
.get(userController.getAllUser);



router.route('/:id')
.get(userController.getUserById);


module.exports = router;