class AppError extends Error{
    constructor(message, statusCode){
        super(message); //parrent class; message properyt;

        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

}

module.exports = AppError;