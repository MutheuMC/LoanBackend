'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RepaymentSchedule extends Model {
    static associate(models) {
      RepaymentSchedule.belongsTo(models.Loan, { foreignKey: 'loanId' });
      RepaymentSchedule.hasOne(models.Payment, { foreignKey: 'repaymentScheduleId' });
    }
  }
  RepaymentSchedule.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    loanId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    repaymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amountDue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'RepaymentSchedule',
  });
  return RepaymentSchedule;
};