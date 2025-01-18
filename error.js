const createError = (status,message) =>{
    const err = new Error();
    err.status = status
    err.message = message 
    return err
}

const errorHandler = (err,req,res,next) =>{
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        message:message,
    })
}


module.exports = {createError,errorHandler}