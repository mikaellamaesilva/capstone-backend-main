module.exports = (sequelize, DataTypes) => {
  return sequelize.define('hosts', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
      allowNull: false,
      unique: true,
    },
    upliveName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    talentManager: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referralName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialTalent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoLink: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: {
      //   isUrl: true
      // }
    },
    facebookAccount: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: {
      //   isUrl: true
      // }
    },
    instagramAccount: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: {
      //   isUrl: true
      // }
    },
    tiktokAccount: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: {
      //   isUrl: true
      // }
    },
    recruitmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    avatarImageUrl: {
      type: DataTypes.STRING,
    },
    hasConfirmedEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });
};