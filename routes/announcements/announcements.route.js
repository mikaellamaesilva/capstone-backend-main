const asyncHandler = require('express-async-handler');
const controller = require('~/controllers/announcements/announcements.controller');
const { auth } = require('~/middlewares/auth');
const prefix = '/announcements'

module.exports = (router) => {
  router.get(`${prefix}`, auth, asyncHandler(controller.getAll));
  router.get(`${prefix}/:id`, auth, asyncHandler(controller.get));
  router.post(`${prefix}`, auth, asyncHandler(controller.add));
  router.patch(`${prefix}/:id`, auth, asyncHandler(controller.update));
  router.delete(`${prefix}/:id`, auth, asyncHandler(controller.delete));
}