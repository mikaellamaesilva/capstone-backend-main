const Errors = require('http-errors');
const bcrypt = require('bcrypt');
const { Hosts, Performances, sequelize } = require('~/models');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');
const axios = require("axios");
const { Op } = require("sequelize");
const serviceName = 'hosts'
const { sendEmailVerification } = require('~/utils/helpers/email');
exports.getAll = async (userPayload, query) => {
  try {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 2);
    currentDate = currentDate.toLocaleDateString('en-CA');
    let result;
    if (query.includeActivity) {
      result = await Hosts.findAll({ 
        include: [{
          model: Performances,
          where: {
            date: {
              [Op.gt]: currentDate
            }
          },
          required: false
        }],
        order: [['lastName', 'ASC']] ,
      });
    } else {
      result = await Hosts.findAll({order: [['lastName', 'ASC']] ,});
    }
    return result
  } catch (err) {
    console.log(`${serviceName}.service.getAll - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.get = async (userPayload, hostId) => {
  try {
    const result = await Hosts.findByPk(hostId);
    if (!result) {
      throw new Errors(HTTP_STATUS.NotFoundError, ERROR_MESSAGE.ERR4001007);
    }
    return result
  } catch (err) {
    console.log(`${serviceName}.service.get - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.add = async (userPayload, hostDetails, files) => {
  try {
    if (files) {
      try {
        const response = await axios.post(`https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_API_KEY}&filename=${files.files.name}`, files.files.data, { headers: { "Content-Type": files.files.mimetype } });
        hostDetails.avatarImageUrl = response.data.url
      } catch (error) {
        console.log(error)
      }
    }
    hostDetails.createdBy = userPayload.id
    hostDetails.recruitmentDate = new Date().toLocaleDateString('en-CA');
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(hostDetails.password, salt);

    hostDetails.password = hashedPassword;


    const result = await Hosts.create(hostDetails, { userPayload });
    await sendEmailVerification(hostDetails);
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

exports.update = async (userPayload, hostId, updatedHostDetails, files) => {
  try {
    if (updatedHostDetails.password) {
      if (updatedHostDetails.oldPassword) {
        const user = await Hosts.findOne({ where: { id: hostId } });
        const hasCorrectCredentials = user ? await bcrypt.compare(updatedHostDetails.oldPassword, user.password) : false;
        if (hasCorrectCredentials) {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(updatedHostDetails.password, salt);
  
          updatedHostDetails.password = hashedPassword;
        } else {
          throw new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001008);
        }
      } else {

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(updatedHostDetails.password, salt);

        updatedHostDetails.password = hashedPassword;
      }
      
    } else {
      delete updatedHostDetails.password
    }

    if (files) {
      try {
        const response = await axios.post(`https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_API_KEY}&filename=${files.files.name}`, files.files.data, { headers: { "Content-Type": files.files.mimetype } });
        updatedHostDetails.avatarImageUrl = response.data.url
      } catch (error) {
        console.log(error)
      }
    }

    const originalRecord = await Hosts.findByPk(hostId);
    if (originalRecord.email !== updatedHostDetails.email) {
      await sendEmailVerification(updatedHostDetails);
      await Hosts.update({ hasConfirmedEmail: false }, { where: { id: hostId }});
    }
    
    const result = await Hosts.update(updatedHostDetails, { userPayload, where: { id: hostId }, individualHooks: true });
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

exports.delete = async (userPayload, hostId) => {
  try {
    const result = await Hosts.destroy({ where: { id: hostId } });

    return result
  } catch (err) {
    console.log(`${serviceName}.service.delete - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}
