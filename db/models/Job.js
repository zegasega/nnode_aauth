module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define("Job", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "completed", "cancelled"),
      defaultValue: "open",
    }
  }, {
    timestamps: true,
    tableName: 'jobs'
  });

  Job.associate = (models) => {
    Job.belongsTo(models.User, { foreignKey: 'clientId', as: 'client' });
    Job.hasMany(models.Application, { foreignKey: 'jobId', as: 'applications' });
  };

  return Job;
};
