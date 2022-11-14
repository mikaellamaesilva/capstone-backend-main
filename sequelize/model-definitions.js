module.exports = (sequelize, DataTypes) => {
  // ---------------- definitions
  const Admins = require('~/models/admins/admins.model')(sequelize, DataTypes);
  const Announcements = require('~/models/announcements/announcements.model')(sequelize, DataTypes);
  const AnnouncementAttachments = require('~/models/announcement-attachments/announcement-attachments.model')(sequelize, DataTypes);
  const CalendarActivities = require('~/models/calendar-activities/calendar-activities.model')(sequelize, DataTypes);
  const CalendarActivityParticipants = require('~/models/calendar-activity-participants/calendar-activity-participants.model')(sequelize, DataTypes);
  const Faqs = require('~/models/faqs/faqs.model')(sequelize, DataTypes);
  const Hosts = require('~/models/hosts/hosts.model')(sequelize, DataTypes);
  const PendingHosts = require('~/models/pending-hosts/pending-hosts.model')(sequelize, DataTypes);
  const Performances = require('~/models/performances/performances.model')(sequelize, DataTypes);

  const Audits = require('~/models/audits/audits.model')(sequelize, DataTypes);

  // ---------------------- strict associations
  Admins.hasMany(Announcements, { foreignKey: { allowNull: false, name: "createdBy" } })
  Announcements.belongsTo(Admins, { foreignKey: { allowNull: false, name: "createdBy" } })

  Admins.hasMany(CalendarActivities, { foreignKey: { allowNull: false, name: "createdBy" } })
  CalendarActivities.belongsTo(Admins, { foreignKey: { allowNull: false, name: "createdBy" } })

  Admins.hasMany(Faqs, { foreignKey: { allowNull: false, name: "createdBy" } })
  Faqs.belongsTo(Admins, { foreignKey: { allowNull: false, name: "createdBy" } })

  Admins.hasMany(Performances, { foreignKey: { allowNull: false, name: "createdBy" } })
  Performances.belongsTo(Admins, { foreignKey: { allowNull: false, name: "createdBy" } })

  Announcements.hasMany(AnnouncementAttachments, { foreignKey: { allowNull: false} })
  AnnouncementAttachments.belongsTo(Announcements, { foreignKey: { allowNull: false} })

  CalendarActivities.hasMany(CalendarActivityParticipants, { foreignKey: { allowNull: false} })
  CalendarActivityParticipants.belongsTo(CalendarActivities, { foreignKey: { allowNull: false} })

  Hosts.hasMany(CalendarActivityParticipants, { foreignKey: { allowNull: false} })
  CalendarActivityParticipants.belongsTo(Hosts, { foreignKey: { allowNull: false} })


  Hosts.hasMany(Performances, { foreignKey: { allowNull: false} })
  Performances.belongsTo(Hosts, { foreignKey: { allowNull: false } })

  // ---------------------- optional associations
  Admins.hasMany(Admins, { foreignKey: { name: "createdBy" } })
  Admins.belongsTo(Admins, { foreignKey: {  name: "createdBy" } })

  Admins.hasMany(Hosts, { foreignKey: { name: "createdBy" } })
  Hosts.belongsTo(Admins, { foreignKey: { name: "createdBy" } })

  Admins.hasMany(PendingHosts, { foreignKey: { name: "createdBy" } })
  PendingHosts.belongsTo(Admins, { foreignKey: { name: "createdBy" } })

  Admins.hasMany(Audits, { foreignKey: { name: "adminLogin" } })
  Audits.belongsTo(Admins, { foreignKey: { name: "adminLogin" } })

  Hosts.hasMany(Audits, { foreignKey: { name: "hostLogin" } })
  Audits.belongsTo(Hosts, { foreignKey: { name: "hostLogin" } })

  return {
    Admins,
    Announcements,
    AnnouncementAttachments,
    CalendarActivities,
    CalendarActivityParticipants,
    Faqs,
    Hosts,
    PendingHosts,
    Performances,
    Audits,
  }
}

