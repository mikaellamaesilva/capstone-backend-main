const service = require('~/services/calendar-activities/calendar-activities.service');
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
    const { user: userPayload, params: { id: calendarActivityId } } = req;
    const result = await service.get(userPayload, calendarActivityId);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001002, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.add = async (req, res) => {
  try {
    const { user: userPayload, body: calendarActivityDetails } = req;
    const result = await service.add(userPayload, calendarActivityDetails);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001003, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const { user: userPayload, params: { id: calendarActivityId }, body: updatedCalendarActivityDetails } = req;
    const result = await service.update(userPayload, calendarActivityId, updatedCalendarActivityDetails);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001004, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { user: userPayload, params: { id: calendarActivityId } } = req;
    const result = await service.delete(userPayload, calendarActivityId);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001005, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};
