const AppError = require("./../utils/appError");

const handleCastErrorDB = err =>{
   const message = `Invalid ${err.path}: ${err.value}.`;
    const errx =  new AppError(`${message}`, 400);

    return errx;
}

const handleDuplicateFieldDB = err =>{
   console.log(err.message);
   const duplicatedFieldName =  err.message.match(/"([^"]*)"/gm);
   const message = `Duplicate field value: ${duplicatedFieldName}. Please use another value!`;

   const errx =  new AppError(message, 400);
   return errx;
}


const handleValidationErrorDB = err =>{
   const errors = Object.values(err.errors).map( el => el.message);
   // console.log(err['errors']['difficulty']['properties']['message']);
   const message = errors.join(', ');
  
   const errx = new AppError(`${message}`, 400);
   console.log('still triggerting the error');

   return errx;
}


const handleJWTError = ()=>{
   const errx = new AppError('Invalid token. plaese login again!', 401);
   return errx;
}

const handleJWTExpiredError = () =>{
   const errx = new AppError('Token Expired! login again', 401);
   return errx;   
}


const sendErrorDev = (err,res)=>{
   res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
   });
}

const sendErrorProd = (err,res)=>{
   // operatial, trusted error: send message to client;

   if(err.isOperational) {
      res.status(err.statusCode).json({
         status: err.status,
         message: err.message,
      })
   }else {
      // programming or other unknow error: don't leak error details;
      // 1) log error;
    //   console.error('ERROR:', err);
      // 2) send generic message
      res.status(500).json({
         status: 'error',
         message: ' something went wrong!'
      })
   }
}

module.exports = ((err, req, res, next)=>{   // automatically detect it is a error handling middleware
  //  console.log(err.stack); // stack trace.
    err.statusCode = err.statusCode || 500;
    err.status = err.status|| 'error';

    if ( process.env.NODE_ENV === 'development') {
      console.log(' error type' , err.name);


        sendErrorDev(err,res);

    }else if ( process.env.NODE_ENV === 'production'){

      
    let error = {...err, message: err.message};
   

      if(error.name === 'CastError') {
        error =  handleCastErrorDB(error);
      } 

      if (error.code === 11000)  {
         error = handleDuplicateFieldDB(error);
      }

      if(error.name === 'ValidationError') { 
        error =  handleValidationErrorDB(error);
      }

      if (error.name=== 'JsonWebTokenError') {
         error = handleJWTError(error);
      }

      if(error.name === 'TokenExpiredError') {
         error = handleJWTExpiredError(error);
      }


      console.log(error);

      sendErrorProd(error,res); 
    }
 });
