module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define("Application", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    proposedBudget: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
    freelancerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
    tableName: 'applications'
  });

  Application.associate = (models) => {
    Application.belongsTo(models.User, { foreignKey: 'freelancerId', as: 'freelancer' });
    Application.belongsTo(models.Job, { foreignKey: 'jobId', as: 'job' });
  };

  return Application;
};
