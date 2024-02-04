const ErrorHandler = require("../utils/errorhandler")


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal Server Error"

    //Wrong MongoDB ID error (casting error)
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    //Mongo duplicate user error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    //Wrong jwt error 
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid, please try again`
        err = new ErrorHandler(message, 400)
    }

    //Expired jwt error 
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is expired, please try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}