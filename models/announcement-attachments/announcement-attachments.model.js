module.exports = (sequelize, DataTypes) => {
  return sequelize.define('announcement_attachments', {
    attachmentUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachmentFilename: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, { timestamps: false });
};

// createdAt
// updatedAt