const service = require('~/services/hosts/hosts.service');
const { handleSuccessResponse, handleErrorResponse } = require('~/utils/helpers/handle-response');
const { SUCCESS_MESSAGE } = require('~/utils/constants/success-messages');

exports.getAll = async (req, res) => {
  try {
    const { user: userPayload, query } = req;
    const result = await service.getAll(userPayload, query);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001001, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.get = async (req, res) => {
  try {
    const { user: userPayload, params: { id: hostId } } = req;
    const result = await service.get(userPayload, hostId);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001002, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.add = async (req, res) => {
  try {
    const { user: userPayload, body: hostDetails, files } = req;
    const result = await service.add(userPayload, hostDetails, files);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001003, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const { user: userPayload, params: { id: hostId }, body: updatedHostDetails, files } = req;
    const result = await service.update(userPayload, hostId, updatedHostDetails, files);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001004, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { user: userPayload, params: { id: hostId } } = req;
    const result = await service.delete(userPayload, hostId);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001005, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};
