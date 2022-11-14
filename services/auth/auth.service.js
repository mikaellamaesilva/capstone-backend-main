const Errors = require('http-errors');
const bcrypt = require('bcrypt');
const { Admins, Hosts, Audits, Announcements, CalendarActivities, CalendarActivityParticipants, Faqs, PendingHosts, Performances } = require('~/models');
const { signToken } = require('~/utils/helpers/jwt-functions');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');

const { sequelize } = require('~/models');

const { 
  superadminDummy, 
  adminDummy, 
  hostsDummy, 
  pendingHostsDummy, 
  faqDummy, 
  announcementsDummy, 
  calendarActivitiesDummy 
} = require('~/dummy');


const { sendGeneralEmail, verifyToken } = require('~/utils/helpers/email');

exports.loginAdmin = async (email, password, request) => {
  try {
    const user = await Admins.findOne({ where: { email: email } });
    const hasCorrectCredentials = user ? await bcrypt.compare(password, user.password) : false;
    if (hasCorrectCredentials && user.hasConfirmedEmail) {
      const userDetails = { id: user.id, email: user.email, adminLevel: user.adminLevel, fullName: user.fullName, fullNameReversed: `${user.firstName} ${user.lastName}`, avatarImageUrl: user.avatarImageUrl, isAuthenticated: true };
      const accessToken = await signToken(userDetails)

      const auditDetails = {
        userAgent: request.headers['user-agent'] || "n/a",
        ip: request.clientIp,
        adminLogin: user.id
      };
      await Audits.create(auditDetails);

      return { accessToken, userDetails }
    } else {
      throw new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001001);
    }
  } catch (err) {
    console.log(`auth.service.loginAdmin - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.loginHost = async (email, password, request) => {
  try {
    const user = await Hosts.findOne({ where: { email: email } });
    console.log(user)
    const hasCorrectCredentials = user ? await bcrypt.compare(password, user.password) : false;
    if (hasCorrectCredentials && user.hasConfirmedEmail) {
      const userDetails = { id: user.id, email: user.email, adminLevel: "null", fullName: user.fullName, fullNameReversed: `${user.firstName} ${user.lastName}`, avatarImageUrl: user.avatarImageUrl, isAuthenticated: true };
      const accessToken = await signToken(userDetails)

      const auditDetails = {
        userAgent: request.headers['user-agent'] || "n/a",
        ip: request.clientIp,
        hostLogin: user.id
      };
      await Audits.create(auditDetails);
      return { accessToken, userDetails }
    } else {
      throw new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001001);
    }
  } catch (err) {
    console.log(`auth.service.loginHost - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.verifyEmail = async (token) => {
  try {
    const tokenPayload = await verifyToken(token);
    if (tokenPayload) {
      const hostRecord = await Hosts.findOne({ where: { email: tokenPayload.email } });
      if (hostRecord.email == tokenPayload.email) {
        const result = await Hosts.update({ hasConfirmedEmail: true }, { where: { id: hostRecord.id }});
        return result
      } else {
        throw new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001001);
      }
    } else {
      throw new Errors(HTTP_STATUS.UnauthorizedError, ERROR_MESSAGE.ERR4001001);
    }
  } catch (err) {
    console.log(`auth.service.verifyEmail - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}

exports.resetPassword = async (token) => {
  try {
    
  } catch (err) {
    console.log(`auth.service.resetPassword - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}

exports.sendGeneralEmail = async (emailPayload) => {
  try {
    await sendGeneralEmail(emailPayload.userDetails, emailPayload.message);
  } catch (err) {
    console.log(`auth.service.resetPassword - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}

function listDates(dateFrom, dateTo) {
  const listDate = [];
  const startDate = dateFrom;
  const endDate = dateTo;
  const dateMove = new Date(startDate);
  let strDate = startDate;

  while (strDate < endDate) {
    strDate = dateMove.toISOString().slice(0, 10);
    listDate.push(strDate);
    dateMove.setDate(dateMove.getDate() + 1);
  };

  return listDate
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

exports.setupDatabase = async () => {
  try {
    

    await sequelize.drop();
    await sequelize.sync({ force: true });

    await sequelize.transaction(async (t) => {
  
      await Admins.create(superadminDummy[0], { transaction: t });
      await Admins.bulkCreate(adminDummy, { transaction: t });
      const hosts = await Hosts.bulkCreate(hostsDummy, { transaction: t });
      const performancesDummy = [];

      const dates = listDates('2022-06-01', '2022-11-25');
      
      dates.forEach((date) => {
        const dateWillHavePerformance = randomInt(0, 1);
        if (dateWillHavePerformance == 0) {
          return;
        } else {
          const randomHostCount = randomInt(1, 2);
          for (let i = 0; i < randomHostCount; i++) {
            const host = hosts[randomInt(0, hosts.length - 1)];
    
            let ucoins = 7;
            const hours = randomInt(1,3);
            if (hours == 1) {
              ucoins = randomInt(3,25);
            } else if (hours == 2) {
              ucoins = randomInt(26,50);
            } else if (hours == 3) {
              ucoins = randomInt(51,99);
            }

            performancesDummy.push({ date, ucoins, hours, createdBy: 1, hostId: host.id })
          }
        }
      })


      await Promise.all([
        Performances.bulkCreate(performancesDummy, { transaction: t }),
        PendingHosts.bulkCreate(pendingHostsDummy, { transaction: t }),
        Announcements.bulkCreate(announcementsDummy, { transaction: t }),
        CalendarActivities.bulkCreate(calendarActivitiesDummy, { transaction: t }),
        Faqs.bulkCreate(faqDummy, { transaction: t })
      ]);
  
    });
  
    return 'DATABASE DUMMY DATA SUCCESSFULLY INITIALIZED!'

  } catch (error) {
  
    return `FAILED TO INITIALIZE (${error})`
  
  }

}