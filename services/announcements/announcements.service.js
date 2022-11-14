const Errors = require('http-errors');
const axios = require("axios");

const { Announcements, AnnouncementAttachments, Admins } = require('~/models');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');


const serviceName = 'announcements'

exports.getAll = async (userPayload) => {
  
  try {
    const result = await Announcements.findAll({ include: [Admins, AnnouncementAttachments], order: [["createdAt", 'DESC']] });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.getAll - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.get = async (userPayload, announcementId) => {
  try {
    const result = await Announcements.findByPk(announcementId, { include: [Admins, AnnouncementAttachments] });
    if (!result) {
      throw new Errors(HTTP_STATUS.NotFoundError, ERROR_MESSAGE.ERR4001007);
    }
    return result
  } catch (err) {
    console.log(`${serviceName}.service.get - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.add = async (userPayload, announcementDetails, files) => {
  try {
    var announcement_attachments = []
    if (files) {
      if (!files.file.length) {
        files.file = [files.file]
      }

      for (let file of files.file) {
        try {
          const response = await axios.post(`https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_API_KEY}&filename=${file.name}`, file.data, { headers: { "Content-Type": file.mimetype } });
          announcement_attachments.push({
            attachmentUrl: response.data.url,
            attachmentFilename: response.data.filename
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
    announcementDetails.createdBy = userPayload.id
    announcementDetails.announcement_attachments = announcement_attachments
    const newRecord = await Announcements.create(announcementDetails, { include: [AnnouncementAttachments], userPayload });
    const result = await Announcements.findByPk(newRecord.id, { include: [Admins, AnnouncementAttachments] });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.add - ERROR \n ${err.message} \n ${err.stack}`);
    

    throw err;
  }
};

exports.update = async (userPayload, announcementId, updatedAnnouncementDetails, files) => {
  try {
    const result = await Announcements.update(updatedAnnouncementDetails, { userPayload, where: { id: announcementId }, individualHooks: true });
    
    // add attachments
    var announcement_attachments = []
    if (files) {
      if (!files.file.length) {
        files.file = [files.file]
      }

      for (let file of files.file) {
        try {
          const response = await axios.post(`https://www.filestackapi.com/api/store/S3?key=${process.env.FILESTACK_API_KEY}&filename=${file.name}`, file.data, { headers: { "Content-Type": file.mimetype } });
          announcement_attachments.push({
            attachmentUrl: response.data.url,
            attachmentFilename: response.data.filename,
            announcementId: announcementId
          })
        } catch (error) {
          console.log(error)
        }
      }
    }

    if (announcement_attachments.length > 0) {
      await AnnouncementAttachments.bulkCreate(announcement_attachments);
    }
    

    // delete attachments
    if (updatedAnnouncementDetails.announcement_attachments) {
      for (let file of updatedAnnouncementDetails.announcement_attachments) {
        if (file.forRemoval) {
          await AnnouncementAttachments.destroy({ where: { id: file.id } });
        }
      }
    }
    
    return result
  } catch (err) {
    console.log(`${serviceName}.service.update - ERROR \n ${err.message} \n ${err.stack}`)
    

    throw err;
  }
}

exports.delete = async (userPayload, announcementId) => {
  try {
    const result = await Announcements.destroy({ where: { id: announcementId } });

    return result
  } catch (err) {
    console.log(`${serviceName}.service.delete - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}
