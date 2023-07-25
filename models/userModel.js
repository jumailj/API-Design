const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name 
//email
//photo-string
//password;
//password confirm;

const userSchema = new mongoose.Schema({
    name:     
    {
        type: String,
        require: [true, 'please tell us your name']
    },
    email:
    {
        type: String,
        require: [true, 'please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    photo:
    {
        type: String
    },
    password:
    {
        type: String,
        require: [true, 'please provide a password'],
        minlenght: 8,
        select: false
    },
    passwordConfirm:
    {
        type: String,
        require: [true, 'please confirm your password'],
        validate: 
        {
            validator: function(el)
            {
                return el === this.password; // only work on create/save; not on update;
            },
            message: "passwords are not the same"
        }
    },
    passwordChangedAT: 
    {
        type:Date
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return next();
    } 

    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;

    next();
});

//instance method;- avaliable on all document; { this-> current document}
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return  await bcrypt.compare(candidatePassword, userPassword); // someproblem, i jsut create new on there.
}


userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
    if(this.passwordChangedAT) {
        const changedTimestamp = parseInt(this.passwordChangedAT.getTime()/1000 ,10);
     
        console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp < changedTimestamp;
    }

    
    //false means not changed;
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;

