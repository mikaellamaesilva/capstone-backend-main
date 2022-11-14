module.exports = (sequelize, DataTypes) => {
  const options = {
    hooks: {
      beforeCreate : (record, options) => {
        console.log(options)
        record.dataValues.createdBy = options.userPayload?.id
      },
    }
  }
  return sequelize.define('admins', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
      required: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminLevel: {
      type: DataTypes.ENUM('admin', 'superadmin'),
      default: 'admin',
      noUpdate : true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.lastName}, ${this.firstName}`;
      },
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatarImageUrl: {
      type: DataTypes.STRING,
    },
    hasConfirmedEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, options);
};