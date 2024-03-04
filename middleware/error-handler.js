const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Something went wrong please try again later'
  }

  // validation error check that user has provided all the required fields
  if (err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(', ')
    customError.statusCode = 400
  }

  // duplicate email error
  if (err.code && err.code === 11000) {
    //here we want to check if the error exist and the erro code is 11000
    //we want to hadle the duplicate email
    customError.msg = `The ${Object.keys(
      err.keyValue
    )} entered already exist, please choose another value`;
    customError.statusCode = 400;
  }

  // if id provided is not a valid 
  if(err.name === 'CastError'){
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({msg:customError.msg})
}

module.exports = errorHandlerMiddleware
