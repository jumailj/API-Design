// tours;
const express = require('express');
const app = express();

const morgan  = require('morgan');

 if ( process.env.NODE_ENV==='development') {
    console.log('\x1b[31mAPP is on Development\x1b[0m');
     app.use(morgan('dev'));
 } else {
    console.log('\x1b[31mAPP is on Production\x1b[0m');
 }


const AppError   = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


app.use(express.json()); //middle-ware
app.use(express.static(`${__dirname}/public`));

app.use((req,res,next)=>{
   req.requestTime = new Date().toISOString();
   // console.log(req.headers); // getting header details for authO
   next();
})


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);

// last -- route--- middleware-last;
app.all('*', (req,res,next)=>{
   // res.status(404).json({
   //    status: 'failed',
   //    message: `can't find ${req.originalUrl} on this server!`
   // })

   // const err = new Error(`can't find ${req.originalUrl} on this server!`);
   // err.status = 'fail';
   // err.statusCode = 404;

   // next(err); // automatically know it is an error;where erver we pass. it is going to earror, and stop middle ware

   next(new AppError(`can't find${req.originalUrl} on this server`, 404));
})

app.use(globalErrorHandler);


module.exports = app;