const Errors = require('http-errors');

const { Faqs } = require('~/models');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');

const serviceName = 'faqs'

exports.getAll = async (userPayload) => {
  try {
    const result = await Faqs.findAll();
    return result
  } catch (err) {
    console.log(`${serviceName}.service.getAll - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.get = async (userPayload, faqId) => {
  try {
    const result = await Faqs.findByPk(faqId);
    if (!result) {
      throw new Errors(HTTP_STATUS.NotFoundError, ERROR_MESSAGE.ERR4001007);
    }
    return result
  } catch (err) {
    console.log(`${serviceName}.service.get - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.add = async (userPayload, faqDetails) => {
  try {
    faqDetails.createdBy = userPayload.id
    const result = await Faqs.create(faqDetails, { userPayload });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.add - ERROR \n ${err.message} \n ${err.stack}`);


    throw err;
  }
};

exports.update = async (userPayload, faqId, updatedFaqDetails) => {
  try {
    const result = await Faqs.update(updatedFaqDetails, { userPayload, where: { id: faqId }, individualHooks: true });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.update - ERROR \n ${err.message} \n ${err.stack}`)

    throw err;
  }
}

exports.delete = async (userPayload, faqId) => {
  try {
    const result = await Faqs.destroy({ where: { id: faqId } });

    return result
  } catch (err) {
    console.log(`${serviceName}.service.delete - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}
