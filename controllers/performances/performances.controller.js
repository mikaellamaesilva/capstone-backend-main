const service = require('~/services/performances/performances.service');
const { handleSuccessResponse, handleErrorResponse } = require('~/utils/helpers/handle-response');
const { SUCCESS_MESSAGE } = require('~/utils/constants/success-messages');

exports.getAll = async (req, res) => {
  try {
    const { user: userPayload, query: { hostId } } = req;
    const result = await service.getAll(userPayload, hostId, req.query);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001001, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.getToday = async (req, res) => {
  try {
    const { user: userPayload } = req;
    const result = await service.getToday(userPayload, req.body);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001001, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.get = async (req, res) => {
  try {
    const { user: userPayload, params: { id: performanceId } } = req;
    const result = await service.get(userPayload, performanceId);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001002, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.add = async (req, res) => {
  try {
    const { user: userPayload, body: performanceDetails } = req;
    const result = await service.add(userPayload, performanceDetails);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001003, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const { user: userPayload, params: { id: performanceId }, body: updatedPerformanceDetails } = req;
    const result = await service.update(userPayload, performanceId, updatedPerformanceDetails);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001004, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { user: userPayload, params: { id: performanceId } } = req;
    const result = await service.delete(userPayload, performanceId);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001005, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};
