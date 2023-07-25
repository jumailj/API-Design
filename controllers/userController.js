const User = require('./../models/userModel');
const CatchAsync = require('./../utils/catchAsync');

exports.getAllUser = CatchAsync( async (req,res)=>{

    const users = await User.find();

    //send response;

    res.status(200).json( 
        {"status": "success",
         result : users.length,
       data: { 
           users
       }
       });
    
});

exports.getUserById = (req,res)=>{

    res.status(200).json({
        "status": "sucess",
        "data" : 1,
        "api-" : "api not supported"
    });
}

