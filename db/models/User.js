module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "freelancer", "client"),
      defaultValue: "freelancer",
      allowNull: false,
    },
    jwtTokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    timestamps: true,
    tableName: 'users'
  });

  User.associate = (models) => {
    User.hasMany(models.Job, { foreignKey: 'clientId', as: 'postedJobs' }); // client -> job
    User.hasMany(models.Application, { foreignKey: 'freelancerId', as: 'applications' }); // freelancer -> application
    User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' }); // user -> notification
  };

  return User;
};
