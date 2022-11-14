const asyncHandler = require('express-async-handler');
const controller = require('~/controllers/audits/audits.controller');
const { auth } = require('~/middlewares/auth');
const prefix = '/audits'

module.exports = (router) => {
  router.get(`${prefix}`, auth, asyncHandler(controller.getAll));
}