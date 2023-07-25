const fs = require('fs');
const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures');

const AppError = require('./../utils/appError');
const CatchAsync = require('./../utils/catchAsync');


// let tour = fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8');
// tour = JSON.parse(tour);

//id middle ware;
exports.checkId  = (req,res,next,val)=>{
    // if ( req.params.id >= tour.length) {
    //     return res.status(202).json({"status":"faild", "reason": "invalid ID"});
    // }
    // next();
}

//middleware: for cheap-5-tours;
exports.aliasTopTours = (req,res,next)=>{
    req.query.limit = '5';
    req.query.sort = 'ratingAverage,-price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}


exports.getAllTours = CatchAsync (async (req,res,next)=>{

        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;

        //send response;

        res.status(200).json( 
            {"status": "success",
             result : tours.length,
           data: { 
               tours
           }
           });
});



exports.createTour = CatchAsync (async (req,res,next)=>{

    const newTour =  await Tour.create(req.body);
            
    res.status(200).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });

    // try{

    // }catch(err){
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
});


exports.getTourById = CatchAsync (async(req,res,next)=>{ // paramid name: varaible name;

       const id = req.params.id;
       console.log(typeof(id));
       const tour =  await Tour.findById(id) 


     //  console.log(tour);

     // if it's not a valid id then trigger this fuciont(correct frmat must needed for id);

    if(!tour) {
      return   next(new AppError('no valid tour is found on this ID', 404));
    }


       res.status(200).json({
        "status":"success",
        tour:{
            tour}
    });

});

exports.updateTour =  CatchAsync (async (req,res,next) =>{

       const tour =  await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators:true
        });

        if(!tour) {
            return   next(new AppError('no valid tour is found on this ID', 404));
        }

        res.status(200).json({
            status: "success",
            tour
        })

});

exports.deleteTour = CatchAsync (async (req,res,next)=>{

         const tour =  await Tour.findByIdAndDelete(req.params.id);

        if(!tour){
            return next(new AppError('no tour fond with this id', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {tour}
        })
});

exports.getTourStats= CatchAsync( async (req,res,next)=>{

        const stats  = await Tour.aggregate([  //.find-> return query, return aggrate;
            { $match: 
                    {
                        price: { $gte: 10 } 
                    }
            },
            { $group: 
                    {   
                        _id: '$difficulty', 
                        numTours: {$sum: 1},
                        avgRating: {$avg : '$ratingAverage'},
                        avgPricing: {$avg: '$price'},
                        avgMaxGroupSize: {$avg: '$maxGroupSize'}
                    }
            },
            { $sort: 
                    {
                        avgPricing: -1
                    }
            }
        ]);
            console.log(stats);
            res.status(200).json({
            status: 'success', 
            data: {
                stats
            }
        });

});


exports.getMonthlyPlan =  CatchAsync (async(req,res,next) =>{

        const year = req.params.year * 1; // 2021
        const plan = await Tour.aggregate([
           {$unwind:                 
                        '$startDates'             
           },
           {$match: 
                    {
                        startDates: {$gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`)}
                    }
            },
           {$group:  
                    {
                        _id: {$month: '$startDates'}, numTourStarts: {$sum: 1}, tours:{ $push: '$name'}
                    }
            },
            {$addFields: 
                    {
                        month: '$_id'
                    }
            },
           {$project: 
                    {
                        id: 0
                    }
            },
           {$sort: 
                {
                    numTourStarts: -1
                }
            },
           {$limit: 12
           }
            
        ]);

        res.status(200).json({
            status: "success",
            size : plan.length,
            data: {
                plan
            }
        })

});

exports.getmontlyData = CatchAsync (async (req,res,next)=>{

        console.log(req.params.year);
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
                {$unwind: '$startDates'},

                {$match: 
                        {
                            startDates: {$gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`)},
                            price: {$lte: 1000}
                        }
                },

                {$project: 
                        {
                            _id: -1
                        }
                },

                {$limit: 1
                }

        ]);

        console.log('yera ', year);

        res.status(200).json({
            status: 'success',
            result: plan.length,
            data: {plan}
        })

});