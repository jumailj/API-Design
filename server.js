
// dotenv;
const mongoose = require('mongoose'); /*mongodb*/
const dotenv = require('dotenv');
dotenv.config({"path": "./config.env"});

process.on('uncaughtException', err=>{
   console.log('UNCAUGHT EXCEPTION, shutting down');
   console.log(err.name, err.message);
      process.exit(1);
}); // should be place top!

DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// if it's on dev- use local db;
if ( process.env.NODE_ENV==='development') {
    DB= process.env.DATABASE_LOCAL;
    console.log('local:DB');
   } else {
      console.log('online:DB');
   }
    // console.log('\x1b[33m%s\x1b[0m', DB);

// DB= process.env.DATABASE_LOCAL;
// no longer accpet a callback;
mongoose.connect(DB).then(()=>console.log('connected successfully to DB'));


const app = require('./index');

const server = app.listen(process.env.PORT,()=>{
   console.log(`looking for client ${process.env.PORT}`);
});


//handling rejections;
process.on('unhandledRejection', err=>{ // asynchronouse codes. will handel here;
   console.log('UNHANDLED REJECTION stutting down!')
   console.log(err.name, err.message);

   server.close(()=>{
      process.exit(1);
   });

});

