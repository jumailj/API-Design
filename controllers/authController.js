const {promisify} = require('util');
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel');
const CatchAsync = require('./../utils/catchAsync');
const bcrypt = require('bcryptjs');


const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { decode } = require('punycode');

const signToken = id =>{
    return  jwt.sign({ id: id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN
    });
}

exports.signup = CatchAsync(  async(req,res,next)=>{
    // const newUser = await User.create(req.body);  security issues
    const newUser= await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAT: req.body.passwordChangedAT
    });

    const token = signToken(newUser._id);


    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

const correctPassword = async (realpass, userPass)=>{
        return  await bcrypt.compare(realpass, userPass);
}

exports.login = CatchAsync( async (req,res,next)=>{
    const {email,password} = req.body;

    //1) check if email and password exist
    if(!email|| !password){
       return next(new AppError("please provide email and password", 400));
    }
    //2) check if user exists && password is correct
    const user = await User.findOne({email: email}).select('+password');
   // const correct = await User.correctPassword(password, user.password);


    if(!user || !(await correctPassword(password, user.password))) {
        return next(new AppError('incorrect email or password', 401));
    }

    //  console.log(user);
    //3) if everyhitng okay , send token to client;
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token: token,
        user: user
    });
});

exports.protect = CatchAsync( async(req,res,next)=>{

    let token;

    //1) getting token and check of it's there
    if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
    }

    //2) verification token 
    if(!token) {
        return next(new AppError('You are not logged in! Please login to get access', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // this functill will retuion if toke is valid or not
    console.log(decoded);


    //3) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to theis token no loger exist',401));
    }
   

    //4) Check if user changed password after the JWT-token was issued
    if( currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('user recently chagned password! please login again!',401));
    }

    req.user = currentUser; //future use;

    next(); // grand acces to protected route;
});
