const asyncHandler = require('express-async-handler');
const controller = require('~/controllers/pending-hosts/pending-hosts.controller');
const { auth } = require('~/middlewares/auth');
const prefix = '/pending-hosts'

module.exports = (router) => {
  router.get(`${prefix}`, auth, asyncHandler(controller.getAll));
  router.get(`${prefix}/:id`, auth, asyncHandler(controller.get));
  router.post(`${prefix}`, asyncHandler(controller.add));
  router.patch(`${prefix}/:id`, auth, asyncHandler(controller.update));
  router.delete(`${prefix}/:id`, auth, asyncHandler(controller.delete));
}