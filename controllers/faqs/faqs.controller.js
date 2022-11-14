const service = require('~/services/faqs/faqs.service');
const { handleSuccessResponse, handleErrorResponse } = require('~/utils/helpers/handle-response');
const { SUCCESS_MESSAGE } = require('~/utils/constants/success-messages');

exports.getAll = async (req, res) => {
  try {
    const { user: userPayload } = req;
    const result = await service.getAll(userPayload);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001001, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.get = async (req, res) => {
  try {
    const { user: userPayload, params: { id: faqId } } = req;
    const result = await service.get(userPayload, faqId);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001002, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.add = async (req, res) => {
  try {
    const { user: userPayload, body: faqDetails } = req;
    const result = await service.add(userPayload, faqDetails);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001003, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const { user: userPayload, params: { id: faqId }, body: updatedFaqDetails } = req;
    const result = await service.update(userPayload, faqId, updatedFaqDetails);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001004, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { user: userPayload, params: { id: faqId } } = req;
    const result = await service.delete(userPayload, faqId);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001005, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};
