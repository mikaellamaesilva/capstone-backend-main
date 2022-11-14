const asyncHandler = require('express-async-handler');
const controller = require('~/controllers/performances/performances.controller');
const { auth } = require('~/middlewares/auth');
const prefix = '/performances'

module.exports = (router) => {
  router.post(`${prefix}-today`, auth, asyncHandler(controller.getToday));
  router.get(`${prefix}`, auth, asyncHandler(controller.getAll));
  router.get(`${prefix}/:id`, auth, asyncHandler(controller.get));
  router.post(`${prefix}`, auth, asyncHandler(controller.add));
  router.patch(`${prefix}/:id`, auth, asyncHandler(controller.update));
  router.delete(`${prefix}/:id`, auth, asyncHandler(controller.delete));
}