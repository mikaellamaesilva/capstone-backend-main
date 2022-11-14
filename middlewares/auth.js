const Errors = require('http-errors');
const { handleErrorResponse } = require('~/utils/helpers/handle-response');
const { verifyToken } =  require('~/utils/helpers/jwt-functions')

const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');

async function auth (req, res, next) {
  try {
    req.user = await verifyToken(req);
    next();
  } catch (err) {
    console.log(`[Auth Middleware]: middlewares.auth - ERROR \n ${err.message} \n ${err.stack}`);
    
    if (err.name === 'TokenExpiredError') {
      err = new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001004);
    } else if (err.name === 'JsonWebTokenError') {
      err = new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001005);
    } 
    // ask kuya jeff about return next(err)
    handleErrorResponse(res, err)
  }
}

module.exports = { auth };