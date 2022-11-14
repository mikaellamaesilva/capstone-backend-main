const asyncHandler = require('express-async-handler');
const controller = require('~/controllers/reports/reports.controller');
const { auth } = require('~/middlewares/auth');
const prefix = '/reports'

module.exports = (router) => {
  router.get(`${prefix}`, auth, asyncHandler(controller.get));
}