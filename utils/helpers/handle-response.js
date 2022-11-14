const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');

const handleSuccessResponse = (res, message, result) => {
  const jsonResponse = {
    status: HTTP_STATUS.Success,
    message: message,
    result: result
  };
  res.json(jsonResponse);
}

const handleErrorResponse = (res, err) => {
  const jsonResponse = {
    status: HTTP_STATUS.InternalServerError,
    ...ERROR_MESSAGE.ERR5001001
  };


  if (err && err.statusCode) {
    jsonResponse.status = err.statusCode;
    jsonResponse.message = err.message
  }

  res.status(jsonResponse.status).json(jsonResponse);
}

module.exports = { handleSuccessResponse, handleErrorResponse };