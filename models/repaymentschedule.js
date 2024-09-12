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
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'overdue'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'RepaymentSchedule',
  });
  return RepaymentSchedule;
};