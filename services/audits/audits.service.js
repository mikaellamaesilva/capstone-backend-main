const { Audits, Admins, Hosts } = require('~/models');

const serviceName = 'audits'

exports.getAll = async (userPayload) => {
  try {
    const result = await Audits.findAll({ include: [Hosts, Admins], order: [['createdAt', 'DESC']]  });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.getAll - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};
