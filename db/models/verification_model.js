module.exports = (sequelize, DataTypes) => {
  const Verification = sequelize.define("Verification", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    verification_type: {
      type: DataTypes.ENUM("verify_account", "reset_password", "reset_email"),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // her user sadece 1 verification'a sahip olabilir
      references: {
        model: "Users",
        key: "id",
      },
    }
  }, {
    timestamps: true,
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
