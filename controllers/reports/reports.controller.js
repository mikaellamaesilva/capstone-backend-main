const service = require('~/services/reports/reports.service');
const { handleSuccessResponse, handleErrorResponse } = require('~/utils/helpers/handle-response');
const { SUCCESS_MESSAGE } = require('~/utils/constants/success-messages');

exports.get = async (req, res) => {
  try {
    const { user: userPayload, query: { reportType } } = req;
    const result = await service.get(userPayload, reportType, req.query);
    handleSuccessResponse(res, SUCCESS_MESSAGE.GEN2001002, result);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

