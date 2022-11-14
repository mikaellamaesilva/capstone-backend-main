const asyncHandler = require('express-async-handler');
const controller = require('~/controllers/auth/auth.controller');
const prefix = '/auth'

module.exports = (router) => {
  router.post(`${prefix}/loginAdmin`, asyncHandler(controller.loginAdmin));
  router.post(`${prefix}/loginHost`, asyncHandler(controller.loginHost));
  router.get(`${prefix}/verify-email`, asyncHandler(controller.verifyEmail));
  router.get(`${prefix}/setup-database`, asyncHandler(controller.setupDatabase));
  router.post(`${prefix}/send-email`, asyncHandler(controller.sendGeneralEmail));
}