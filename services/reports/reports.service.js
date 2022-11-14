const Errors = require('http-errors');

const { Hosts, Performances, sequelize } = require('~/models');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');
const { Op } = require("sequelize");

const serviceName = 'reports'

exports.get = async (userPayload, reportType, filters) => {
  try {
    let result;
    if (reportType == 'overallLeaderboard') {
      result = await Performances.findAll({ 
        include: { model: Hosts, attributes: ['upliveName', 'lastName', 'firstName', 'fullName', 'id', 'avatarImageUrl']},
        group: 'hostId', 
        attributes: [
          [sequelize.fn('sum', sequelize.col('hours')), 'total_hours'],
          [sequelize.fn('sum', sequelize.col('ucoins')), 'total_ucoins'],
          [sequelize.fn('count', sequelize.col('date')), 'total_days']
        ],
        order: [[sequelize.col('total_ucoins'), 'DESC']] ,
      });

    } else if (reportType == 'dateRangeLeaderboard') {

      result = await Performances.findAll({ 
        include: { model: Hosts, attributes: ['upliveName', 'lastName', 'firstName', 'fullName', 'id', 'avatarImageUrl']},
        group: 'hostId', 
        attributes: [
          [sequelize.fn('sum', sequelize.col('hours')), 'total_hours'],
          [sequelize.fn('sum', sequelize.col('ucoins')), 'total_ucoins'],
          [sequelize.fn('count', sequelize.col('date')), 'total_days']
        ],
        where: {
          date: {
            [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
            
          }
        },
        order: [[sequelize.col('total_ucoins'), 'DESC']] ,
        
      });
    } else if (reportType == 'recruitment') {
      if (filters.whole == 'true') {
        result = await Hosts.findAll({ 
          group: [sequelize.fn('MONTH', sequelize.col('recruitmentDate')), 'month'], 
          attributes: [
            [sequelize.fn('count', sequelize.col('recruitmentDate')), 'count'],
            [sequelize.fn('MONTH', sequelize.col('recruitmentDate')), 'month'],

          ],
          where: {
            [Op.and]: [
              sequelize.where(sequelize.fn('YEAR', sequelize.col('recruitmentDate')), filters.year),
            ],
          },
          raw: true
        });

        result.forEach((res) => {
          res.hosts = [];
        })

        const hosts = await Hosts.findAll({ 
          attributes: [
            'lastName',
            'firstName',
            'id',
            'upliveName',
            'recruitmentDate',
            'avatarImageUrl'
          ],
          where: {
            [Op.and]: [
              sequelize.where(sequelize.fn('YEAR', sequelize.col('recruitmentDate')), filters.year),
            ],
          },
          raw: true,
          order: [['recruitmentDate', 'DESC']]
        });

        
        hosts.forEach((host) => {
          const month = result.find(res => res.month == new Date(host.recruitmentDate).getMonth() + 1);
          if (month) {
            month.hosts.push(host)
          }
        })


      } 

      // else {
      //   result = await Hosts.findAll({ 
      //     group: [sequelize.fn('MONTH', sequelize.col('recruitmentDate')), 'month'], 
      //     attributes: [
      //       [sequelize.fn('count', sequelize.col('recruitmentDate')), 'count'],
      //       [sequelize.fn('MONTH', sequelize.col('recruitmentDate')), 'month']
      //     ],
      //     where: {
      //       [Op.and]: [
      //         sequelize.where(sequelize.fn('YEAR', sequelize.col('recruitmentDate')), filters.year),
      //       ],
      //     }
      //   });
      // }
    } else if (reportType == 'performance') {
      if (filters.whole == 'true') {
        result = await Performances.findAll({ 
          group: [sequelize.fn('MONTH', sequelize.col('date')), 'month'], 
          attributes: [
            [sequelize.fn('sum', sequelize.col('hours')), 'total_hours'],
            [sequelize.fn('sum', sequelize.col('ucoins')), 'total_ucoins'],
            [sequelize.fn('MONTH', sequelize.col('date')), 'month']
          ],
          where: {
            date: {
              [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
              
            }
          },
          raw : true
        });

        result.forEach(el => {
          el.total_days = 0;
        })


        const iteratedDates = [];
        const performances = await Performances.findAll();

        performances.forEach(el => {
          if (el.hours >= 1 && !iteratedDates.includes(el.date)) {
            const month = result.find(res => res.month == new Date(el.date).getMonth() + 1);
            if (month) {
              month.total_days += 1;
            }
          }

          iteratedDates.push(el.date);
        });

      } 
      

    } else if (reportType == 'activity') {
      let currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 2);
      currentDate = currentDate.toLocaleDateString('en-CA');
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
      });
    } else if (reportType == 'overallCompanyPerformance') {
      if (filters.whole == 'true') {
        result = await Performances.findAll({ 
          group: [sequelize.fn('MONTH', sequelize.col('date')), 'month'], 
          attributes: [
            [sequelize.fn('sum', sequelize.col('hours')), 'total_hours'],
            [sequelize.fn('sum', sequelize.col('ucoins')), 'total_ucoins'],
            [sequelize.fn('MONTH', sequelize.col('date')), 'month']
          ],
          raw : true
        });

        result.forEach(el => {
          el.total_days = 0;
        })


        const iteratedDates = [];
        const performances = await Performances.findAll();

        performances.forEach(el => {
          if (el.hours >= 1 && !iteratedDates.includes(el.date)) {
            const month = result.find(res => res.month == new Date(el.date).getMonth() + 1);
            if (month) {
              month.total_days += 1;
            }
          }

          iteratedDates.push(el.date);
        });

      } 
      

    }

    return result
  } catch (err) {
    console.log(`${serviceName}.service.get - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};
