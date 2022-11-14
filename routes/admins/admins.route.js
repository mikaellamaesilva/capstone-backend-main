const asyncHandler = require('express-async-handler');
const controller = require('~/controllers/admins/admins.controller');
const { auth } = require('~/middlewares/auth');
const prefix = '/admins'

module.exports = (router) => {
  router.get(`${prefix}`, auth, asyncHandler(controller.getAll));
  router.get(`${prefix}/:id`, auth, asyncHandler(controller.get));
  router.post(`${prefix}`, auth, asyncHandler(controller.add));
  router.patch(`${prefix}/:id`, auth, asyncHandler(controller.update));
  router.delete(`${prefix}/:id`, auth, asyncHandler(controller.delete));
}