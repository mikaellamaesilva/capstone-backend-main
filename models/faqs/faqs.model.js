module.exports = (sequelize, DataTypes) => {
  return sequelize.define('faqs', {
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};