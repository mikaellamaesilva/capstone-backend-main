module.exports = (sequelize, DataTypes) => {
  return sequelize.define('performances', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ucoins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};