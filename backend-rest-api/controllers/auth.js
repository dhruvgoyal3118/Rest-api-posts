const User = require('../models/user');
const{validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




exports.signup  = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log('Signup first fail')
        const error = new Error('Validation failed kutte');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    console.log('Signup second',req.body);
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            email:email,
            name:name,
            password:hashedPassword
        });
        return  user.save();
    }).then(result => {
        return res.status(201).json({message:'User Created', userId: result._id});
    })
    .catch(err=>{
        if(!err.statusCode)
        err.statusCode=500;
        next(err);
    })


}; 

exports.login=(req, res,next) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser ;
    User.findOne({email:email})
    .then(user=>{
        if(!user)
        {
            const error = new Error('User not found');
            error.statusCode=401;
            throw error;
        }
        loadedUser=user;
        return bcrypt.compare(password,loadedUser.password)

    })
    .then(doMatch=>{
        if(!doMatch)
        {
            const error = new Error('Wrong password');
            error.statusCode=401;
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString(),
        },'somesupersecretkey',{expiresIn:'1h'});
        
        return res.status(200).json({
            token: token,
            userId: loadedUser._id.toString(),
        });
    })
    .catch(err=>{
        if(!err.statusCode)
        err.statusCode=500;

        next(err);
    })
};

exports.getUserStatus=(req, res,next) => {
    console.log('getUserStatus');
    User
    .findById(req.userId)
    .then(user=>{
        if(!user)
        {
            const error = new Error('No such user');
            error.statusCode=404;
            throw error;
        }
        // console.log(user.status)
        return res.status(200).json({status: user.status});
    })
    .catch(err=>{
        if(!err.statusCode)
        err.statusCode=500;
        next(err);
    })
};

exports.updateUserStatus=(req,res,next)=>{
    const newStatus = req.body.status;
    User
    .findById(req.userId)
    .then(user=>{
        if(!user)
        {
            const error = new Error('No such user');
            error.statusCode=404;
            throw error;
        }
        user.status = newStatus;
        return user.save();

    }).then(result=>{
        return res.status(200).json({message:'UseStatus updated'});
    })
    .catch(err=>{
        if(!err.statusCode)
        err.statusCode=500;

        next(err);
    })
};