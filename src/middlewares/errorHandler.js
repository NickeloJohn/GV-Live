const config = require("../config/config");
const { debugLogger } = require("../utils/functions");
const ErrorResponse = require("./../utils/response");

const errorHandler = (err, req, res, next) => {
    let newError
    if (config.env === "local") console.log(err);
    // if (process.env.NODE_ENV !== "production") console.warn(newError);
    // if (process.env.NODE_ENV === "production") console.info(JSON.stringify(req.setLog));

    // if (process.env.NODE_ENV === "development") {
    //     console.log(`${err.message}`.red);
    // }
    
    let errorData = { 
        statusCode: err?.statusCode,
        message: err?.message
     }; // if a custom error object, error.statusCode is present

    let message;
    // MongoServerError with code 2
    if (err.code === 2) {
        errorData.message =
            "Some or all parameters included in sort params are not valid index for sorting";
        error = new ErrorResponse(400, message);
    }

    // MongoServerError with code 1100
    if (err.code === 11000) {
        // when a document already exists based on unique field
        errorData.message = "Record already exists";
        error = new ErrorResponse(400, message);
    }

    switch (err.name) {
        case "CastError":
            //  When a document does not exists in DB
            // errorData.message = `Record not found`;
            error = new ErrorResponse(400, message);
            break;
        case "ValidationError":
            // When a required field in req.body is missing
            // console.log(error.errors);
            errorData.message = Object.values(err.errors).map((val) => val.message);
            error = new ErrorResponse(400, message);
            break;
    }

    debugLogger({
        ...req.logRequest,
        errorResponse: JSON.stringify(errorData)
    })


    res.status(errorData.statusCode || 500).json({
        c: errorData.statusCode || 500,
        m: newError || errorData.message || err.message || "Server Error",
        d: {},
    });
};

module.exports = errorHandler;
