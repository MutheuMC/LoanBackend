// Payment model (payment.js)
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Loan, { foreignKey: 'loanId' });
      Payment.belongsTo(models.RepaymentSchedule, { foreignKey: 'repaymentScheduleId' });
    }
  }
  Payment.init({
    id: {
      type: DataTypes.INTEGER,
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
    repaymentScheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};