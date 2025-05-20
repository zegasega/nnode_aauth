module.exports = (sequelize, DataTypes) => {
  const Verification = sequelize.define("Verification", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    verification_type: {
      type: DataTypes.ENUM("verify_account", "reset_password"),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    }
  }, {
    timestamps: true,
    tableName: "verifications",
  });

  Verification.associate = (models) => {
    Verification.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return Verification;
};
