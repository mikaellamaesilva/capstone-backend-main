const service = require('~/services/auth/auth.service');
const { handleSuccessResponse, handleErrorResponse } = require('~/utils/helpers/handle-response');

const loginAdmin = async (req, res) => {
  try {
    const { email, password, auditDetails } = req.body;
    const result = await service.loginAdmin(email, password, req);
    handleSuccessResponse(res, '', result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const loginHost = async (req, res) => {
  try {
    const { email, password, auditDetails } = req.body;
    const result = await service.loginHost(email, password, req);
    handleSuccessResponse(res, '', result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await service.verifyEmail(token);
    handleSuccessResponse(res, '', result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
}; 

const sendGeneralEmail = async (req, res) => {
  try {
    const { body: emailPayload } = req;

    const result = await service.sendGeneralEmail(emailPayload);
    handleSuccessResponse(res, '', result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
}; 

const setupDatabase = async (req, res) => {
  try {
    const result = await service.setupDatabase();
    handleSuccessResponse(res, '', result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
}; 

module.exports = {
  loginAdmin,
  loginHost,
  verifyEmail,
  sendGeneralEmail,
  setupDatabase
}