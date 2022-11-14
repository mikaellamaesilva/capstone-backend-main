module.exports = (sequelize, DataTypes) => {
  return sequelize.define('calendar_activities', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    group: {
      type: DataTypes.ENUM('Host', 'Admin'),
      default: 'Admin'
    },
    includeAllHosts : {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  });
};