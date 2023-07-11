const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {body} = require('express-validator');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

router.put('/signup',[
    body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter valid email address')
    .normalizeEmail()
    .custom(async (value,{ req })=>{

        let user = await User.findOne({ email: value});
        console.log(user);
        if (user) {
            return new Promise.reject('User already exists');
        }
    }),
    body('password')
    .trim()
    .isLength({min:5})
    .withMessage('Please enter valid password'),

    body('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter a name'),


    
    
],authController.signup);


router.post("/login",authController.login);


router.get('/status',isAuth,authController.getUserStatus);

router.patch('/status',[
    body('status').trim().notEmpty()
  ],isAuth,authController.updateUserStatus);
module.exports = router;