

const mongoose = require('mongoose'); /*mongodb*/
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'a tour mush have a name'], unique: true, trim:true, /*validate: [validator.isAlpha,'tour name must only conatin character'] */
    maxlength: [40,'a tour name must have less or equal than 40 character'],
    minlength: [10,'a tour name musth have more or equal than 10 character']},
    slug: String,
    duration: {type: Number, required:[true, 'a tour mush  have a duraiton']},
    maxGroupSize: {type:Number, required:[true, 'a tour must have a group size']},
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty.'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficult is either easy, medium, difficult.'
        }
    },
    ratingAverage: {type: Number, default:4.5, min: [1, 'Rating must be greater than 1.0'], max: [5, 'rating must be lesster than 5.0']},
    ratingQuantity: {type:Number, default:0},
    price: {type: Number, required:[true,' a tour mush have a price']},
    priceDiscount: {type: Number },
    summary: {type:String, trim: true, required: [true, 'A tour must have a descriptino']}, /*remove whiteshpaces - first and last*/
    description: {type:String, trim: true},
    imageCover: {type:String, required: [true, 'a tour must have a cover image']},
    images: {type: [String]},
    createdAt: {type:Date,select:false, default: Date.now()},
    startDates: {type: [Date]},
    secretTour: {type: Boolean, default:false}
 }, { toJSON: {virtuals: true}, toObject: {virutals:true}});

 tourSchema.virtual('durationWeeks').get(function(){  // array functions don't have this keyword
    return this.duration/7;
 }); // can't query;

 tourSchema.virtual('test-vir').get(function(){
    return this.price;
 })


tourSchema.pre(/^find/ , function(next){ // currenet query;
//query object
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();

     next();
})

tourSchema.post(/^find/, function(doc, next){ // currenet query;
    //query object
        console.log( 'time took for query: ', Date.now() - this.start);

       next();
});
    

// Aggregation middleware;

tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: {secretTour:{$ne: true}}}) // remove allt eh secret tour;
    console.log(this);
    next();
});
 

 const Tour = mongoose.model('Tour', tourSchema);
 module.exports = Tour;