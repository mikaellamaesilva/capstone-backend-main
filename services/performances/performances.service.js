const Errors = require('http-errors');

const { Performances, Hosts, sequelize } = require('~/models');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');

const { Op } = require('sequelize');

const serviceName = 'performances'

exports.getAll = async (userPayload, hostId, filters) => {
  try {
    if(filters.startDate && filters.endDate) {
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
            
          },
          hostId: hostId
        },
        raw : true
      });

      result.forEach(el => {
        el.total_days = 0;
      })



      const iteratedDates = [];
      const performances = await Performances.findAll({ where: {
        date: {
          [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)]
          
        },
        hostId: hostId
      },});

      performances.forEach(el => {
        if (el.hours >= 1 && !iteratedDates.includes(el.date)) {
          const month = result.find(res => res.month == new Date(el.date).getMonth() + 1);

          if (month) {
            month.total_days += 1;
          }
        }

        iteratedDates.push(el.date);
      });
      console.log(result)
      return result;



    } else {
      const performances = await Performances.findAll({ 
        order: [['date', 'ASC']] ,
        where: { hostId: hostId },
      });
  
      let total_hours = 0;
      let total_days = 0;
      let total_ucoins = 0;
      
      const iteratedDates = [];
      
  
      performances.forEach(el => {
        total_hours += el.hours;
        
        if (el.hours >= 1 && !iteratedDates.includes(el.date)) {
          total_days += 1;
        }
        total_ucoins += el.ucoins;
        iteratedDates.push(el.date);
      });
  
      const result = {
        individual: performances,
        aggregated: { total_hours, total_days, total_ucoins },
      }
      
      return result
    }
    
  } catch (err) {
    console.log(`${serviceName}.service.getAll - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.add = async (userPayload, performanceDetails) => {
  try {
    performanceDetails.createdBy = userPayload.id
    const result = await Performances.create(performanceDetails, { userPayload });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.add - ERROR \n ${err.message} \n ${err.stack}`);


    throw err;
  }
};

exports.getToday = async (userPayload, performances) => {
  try {
    const filtered = [];
    performances.forEach((performance) => {
      const hours = performance.hours;
      const ucoins = performance.ucoins;
      if (hours && ucoins) {
        performance.createdBy = userPayload.id
        filtered.push(performance)
      }
    })

    if (filtered.length > 0) {
      await Performances.bulkCreate(filtered);
      
    }
    return {}
  } catch (err) {
    console.log(`${serviceName}.service.getToday - ERROR \n ${err.message} \n ${err.stack}`);


    throw err;
  }
};

exports.update = async (userPayload, performanceId, updatedPerformanceDetails) => {
  try {
    console.log(updatedPerformanceDetails);
    const result = await Performances.update(updatedPerformanceDetails, { userPayload, where: { id: performanceId }, individualHooks: true });
    console.log(result)
    return result
  } catch (err) {
    console.log(`${serviceName}.service.update - ERROR \n ${err.message} \n ${err.stack}`)

    throw err;
  }
}

exports.delete = async (userPayload, performanceId) => {
  try {
    const result = await Performances.destroy({ where: { id: performanceId } });

    return result
  } catch (err) {
    console.log(`${serviceName}.service.delete - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}
