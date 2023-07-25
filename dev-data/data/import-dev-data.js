// dotenv;
const fs = require('fs');
const mongoose = require('mongoose'); /*mongodb*/
const dotenv = require('dotenv');
dotenv.config({"path": "../../config.env"});

const Tour = require('../../models/tourModels');

DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// if it's on dev- use local db;
if ( process.env.NODE_ENV==='development') {
    DB= process.env.DATABASE_LOCAL;
}

// DB= process.env.DATABASE_LOCAL;
console.log('DB-url:', DB);
// no longer accpet a callback;
mongoose.connect(DB).then(()=> { 
    console.log('connected successfully');
    //importData();
   //   deleteData();

}
    ).catch((err)=>{
   console.log(err);
});

//read json fils;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')); 


// import data to db
const importData = async ()=>{
    try{
        await Tour.create(tours);
        console.log('data successfully loaded!');
        
    }catch(err) {
        console.log(err);
    }

    process.exit();
}

// delte all data from collection;
const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        console.log('data successfully delete!');
        
    }catch(err) {
        console.log(err);
    }
    process.exit();
}

if( process.argv[2] === '--import') {
    importData();
} else if ( process.argv[2] === '--delete') {
    deleteData();
}


console.log(process.argv);