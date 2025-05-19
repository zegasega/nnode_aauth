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
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
    },
    jwtTokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    }
  }, {
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasOne(models.Verification, {
      foreignKey: "userId",
      as: "verification",
      onDelete: "CASCADE", // kullanıcı silinirse verification da silinsin
    });
  };

  return User;
};
