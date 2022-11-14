const Errors = require('http-errors');

const { PendingHosts, Hosts, sequelize } = require('~/models');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');
const bcrypt = require('bcrypt');
const serviceName = 'hosts'
const { sendEmailVerification, sendGeneralEmail } = require('~/utils/helpers/email');



exports.getAll = async (userPayload) => {
  try {
    const result = await PendingHosts.findAll({order: [['createdAt', 'DESC']] ,});
    return result
  } catch (err) {
    console.log(`${serviceName}.service.getAll - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.get = async (userPayload, pendingHostId) => {
  try {
    const result = await PendingHosts.findByPk(pendingHostId);
    if (!result) {
      throw new Errors(HTTP_STATUS.NotFoundError, ERROR_MESSAGE.ERR4001007);
    }
    return result
  } catch (err) {
    console.log(`${serviceName}.service.get - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.add = async (userPayload, pendingHostDetails) => {
  try {
    const result = await PendingHosts.create(pendingHostDetails, { userPayload });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.add - ERROR \n ${err.message} \n ${err.stack}`);
    if (err.name === 'SequelizeValidationError') {
      throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001002);
    } else if (err.name === 'SequelizeUniqueConstraintError') {
      throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001006);
    }

    throw err;
  }
};

exports.update = async (userPayload, pendingHostId, updatedPendingHostDetails) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      
      await PendingHosts.update(updatedPendingHostDetails, { userPayload, where: { id: pendingHostId }, individualHooks: true });
      const recruitedHostDetails = await PendingHosts.findByPk(pendingHostId, { raw: true })
      if (updatedPendingHostDetails.isRecruited) {
    
        
        recruitedHostDetails.createdBy = userPayload.id
        recruitedHostDetails.recruitmentDate = new Date().toLocaleDateString('en-CA');

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(`esee.host.2022`, salt);
        recruitedHostDetails.password = hashedPassword;

        await Hosts.create(recruitedHostDetails, { userPayload });
        sendEmailVerification(recruitedHostDetails)
      } else {
        await sendGeneralEmail(recruitedHostDetails, 'Thank you for your interest to apply as a host. Upon going through the review process, we regret to inform you that we have decided to reject your application based on the qualifications set by the administrators. We do hope to see you again soon if in case you plan to resubmit another application on a later period.');
      }

      await PendingHosts.destroy({ where: { id: pendingHostId } });
    })
    
    return result
  } catch (err) {
    console.log(`${serviceName}.service.update - ERROR \n ${err.message} \n ${err.stack}`)
    if (err.name === 'SequelizeValidationError') {
      throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001002);
    } else if (err.name === 'SequelizeUniqueConstraintError') {
      throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001006);
    }
    throw err;
  }
}

