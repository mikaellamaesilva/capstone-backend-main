const bcrypt = require('bcrypt');
const Errors = require('http-errors');
const axios = require("axios");

const { Admins } = require('~/models');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');

const serviceName = 'admins'

exports.getAll = async (userPayload) => {
  try {
    const result = await Admins.findAll({ order: [['lastName', 'ASC']] , });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.getAll - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.get = async (userPayload, adminId) => {
  try {
    const result = await Admins.findByPk(adminId);
    if (!result) {
      throw new Errors(HTTP_STATUS.NotFoundError, ERROR_MESSAGE.ERR4001007);
    }
    return result
  } catch (err) {
    console.log(`${serviceName}.service.get - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.add = async (userPayload, adminDetails, files) => {
  try {
    if (userPayload.adminLevel !== 'superadmin') {
      throw new Errors(HTTP_STATUS.ForbiddenError, ERROR_MESSAGE.ERR4001003);
    }


    if (files) {
      try {
        const response = await axios.post(`https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_API_KEY}&filename=${files.files.name}`, files.files.data, { headers: { "Content-Type": files.files.mimetype } });
        adminDetails.avatarImageUrl = response.data.url
      } catch (error) {
        console.log(error)
      }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(adminDetails.password, salt);

    adminDetails.password = hashedPassword;
    adminDetails.adminLevel = 'admin';
    adminDetails.hasConfirmedEmail = true;
    const result = await Admins.create(adminDetails, { userPayload });
    return result
  } catch (err) {
    // console.log(`${serviceName}.service.add - ERROR \n ${err.message} \n ${err.stack}`);
    
    if (err.name === 'SequelizeValidationError') {
      throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001002);
    } else if (err.name === 'SequelizeUniqueConstraintError') {

      const fieldMap = {
        id: 'upLive ID',
        email: 'email',
        mobileNumber: 'mobile number',
        upliveName: 'upLive name',
        videoLink: 'video URL',
        facebookAccount: 'Facebook URL',
        instagramAccount: 'Instagram URL',
        tiktokAccount: 'TikTok URL',
      }
      const field = fieldMap[err?.errors[0]?.path] || 'details';
      const message = { message: { title: 'Account Details Taken', description: `An account with the same ${field} already exists.` } }
      throw new Errors(HTTP_STATUS.BadRequestError, message);
    }

    throw err;
  }
};

exports.update = async (userPayload, adminId, updatedAdminDetails, files) => {
  try {
    if (updatedAdminDetails.password) {
      if (updatedAdminDetails.oldPassword) {
        const user = await Admins.findOne({ where: { id: adminId } });
        const hasCorrectCredentials = user ? await bcrypt.compare(updatedAdminDetails.oldPassword, user.password) : false;
        if (hasCorrectCredentials) {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(updatedAdminDetails.password, salt);
  
          updatedAdminDetails.password = hashedPassword;
        } else {
          throw new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001008);
        }
      } else {

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(updatedAdminDetails.password, salt);

        updatedAdminDetails.password = hashedPassword;
      }
    } else {
      delete updatedAdminDetails.password
    }

    if (files) {
      try {
        const response = await axios.post(`https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_API_KEY}&filename=${files.files.name}`, files.files.data, { headers: { "Content-Type": files.files.mimetype } });
        updatedAdminDetails.avatarImageUrl = response.data.url
      } catch (error) {
        console.log(error)
      }
    }
    delete updatedAdminDetails.adminLevel
    updatedAdminDetails.hasConfirmedEmail = true;
    const result = await Admins.update(updatedAdminDetails, { userPayload, where: { id: adminId }, individualHooks: true });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.update - ERROR \n ${err.message} \n ${err.stack}`)
    
    if (err.name === 'SequelizeValidationError') {
      throw new Errors(HTTP_STATUS.BadRequestError, ERROR_MESSAGE.ERR4001002);
    } else if (err.name === 'SequelizeUniqueConstraintError') {
      const fieldMap = {
        id: 'upLive ID',
        email: 'email',
        mobileNumber: 'mobile number',
        upliveName: 'upLive name',
        videoLink: 'video URL',
        facebookAccount: 'Facebook URL',
        instagramAccount: 'Instagram URL',
        tiktokAccount: 'TikTok URL',
      }
      const field = fieldMap[err?.errors[0]?.path] || 'details';
      const message = { message: { title: 'Account Details Taken', description: `An account with the same ${field} already exists.` } }
      throw new Errors(HTTP_STATUS.BadRequestError, message);
    }

    throw err;
  }
}

exports.delete = async (userPayload, adminId) => {
  try {
    if (userPayload.adminLevel !== 'superadmin') {
      throw new Errors(HTTP_STATUS.ForbiddenError, ERROR_MESSAGE.ERR4001003);
    }
    const result = await Admins.destroy({ where: { id: adminId } });

    return result
  } catch (err) {
    console.log(`${serviceName}.service.delete - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}
