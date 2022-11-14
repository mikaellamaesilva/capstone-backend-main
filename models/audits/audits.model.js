module.exports = (sequelize, DataTypes) => {
  return sequelize.define('audits', {
    ip: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};