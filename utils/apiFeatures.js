class APIFeatures {
    constructor(query, queryString){
       this.query = query;
       this.queryString = queryString; 
    }

    filter() {
                //1.filtering;
                const queryObj = {...this.queryString};
                const excludedFields = ['page', 'sort', 'limit', 'fields'];
                excludedFields.forEach(el => delete queryObj[el]);
        
                // 2.advance filtering; {advane query}
                let queryStr = String(JSON.stringify(queryObj));
                queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
     
                this.query =  this.query.find(JSON.parse(queryStr))
                // query = Tour.find(JSON.parse(queryStr));
                return this; //object;
    }


    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy);
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createAt');
        }

        return this; // entire object;
        
    }

    limitFields() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join('');
            // console.log(fields);
            this.query = this.query.select(fields);
        } else {
           this.query = this.query.select('-__v'); // exclude it; {- means exlude;}
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1 ;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page -1) * limit;

        this.query = this.query.skip(skip).limit(limit);

            return this;
    }

}
module.exports = APIFeatures;