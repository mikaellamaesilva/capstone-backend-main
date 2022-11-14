const Errors = require('http-errors');

const { CalendarActivities, CalendarActivityParticipants, Hosts } = require('~/models');
const { HTTP_STATUS } = require('~/utils/constants/http-status-codes');
const { ERROR_MESSAGE } = require('~/utils/constants/error-messages');

const serviceName = 'calendar-activities'

exports.getAll = async (userPayload) => {
  try {
    const groupFilter = userPayload.adminLevel.includes("admin") ? {} : { group: "Host" }
    const result = await CalendarActivities.findAll({ include: { model: CalendarActivityParticipants, include: { model: Hosts } }, where: groupFilter });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.getAll - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.get = async (userPayload, calendarActivityId) => {
  try {
    const groupFilter = userPayload.adminLevel.includes("admin") ? {} : { group: "Host" }
    const result = await CalendarActivities.findByPk(calendarActivityId, { include: { model: CalendarActivityParticipants, include: { model: Hosts } } , where: groupFilter });
    if (!result) {
      throw new Errors(HTTP_STATUS.NotFoundError, ERROR_MESSAGE.ERR4001007);
    }
    return result
  } catch (err) {
    console.log(`${serviceName}.service.get - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
};

exports.add = async (userPayload, calendarActivityDetails) => {
  try {
    calendarActivityDetails.createdBy = userPayload.id
    const result = await CalendarActivities.create(calendarActivityDetails, { include: [CalendarActivityParticipants], userPayload });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.add - ERROR \n ${err.message} \n ${err.stack}`);


    throw err;
  }
};

exports.update = async (userPayload, calendarActivityId, updatedCalendarActivityDetails) => {
  try {
    const originalRecord = await CalendarActivities.findByPk(calendarActivityId, { include: { model: CalendarActivityParticipants } });
    // remove participants
    for (let participant of originalRecord.calendar_activity_participants) {
      if (!updatedCalendarActivityDetails.calendar_activity_participants.find(el => el.id == participant.id)) {
        await CalendarActivityParticipants.destroy({ where: { id: participant.id } });
      }
    }

    // add new participants
    for (let participant of updatedCalendarActivityDetails.calendar_activity_participants) {
      if (!originalRecord.calendar_activity_participants.find(el => el.id == participant.id)) {
        await CalendarActivityParticipants.create({
          calendarActivityId: calendarActivityId,
          hostId: participant.hostId
        });
      }
    }

    const result = await CalendarActivities.update(updatedCalendarActivityDetails, { userPayload, where: { id: calendarActivityId }, individualHooks: true });
    return result
  } catch (err) {
    console.log(`${serviceName}.service.update - ERROR \n ${err.message} \n ${err.stack}`)

    throw err;
  }
}

exports.delete = async (userPayload, calendarActivityId) => {
  try {
    const result = await CalendarActivities.destroy({ where: { id: calendarActivityId } });

    return result
  } catch (err) {
    console.log(`${serviceName}.service.delete - ERROR \n ${err.message} \n ${err.stack}`)
    throw err;
  }
}
