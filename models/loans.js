'use strict';
const { Model } = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    static associate(models) {
      Loan.belongsTo(models.Applicant, { foreignKey: 'applicantId' });
      Loan.hasMany(models.RepaymentSchedule, { foreignKey: 'loanId' });
      Loan.hasMany(models.Payment, { foreignKey: 'loanId' });
      Loan.hasOne(models.DefaultDetails, { foreignKey: 'loanId' });
    }
  }
  
  Loan.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    applicantId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    loanAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    interestAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    interestRate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
      validate: {
        min: 0,
        max: 1
      }
    },
    dateBorrowed: {
      type: DataTypes.DATE,
      allowNull: false
    },
    firstPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    penaltyAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    balanceDue: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    paymentFrequency: {
      type: DataTypes.ENUM('weekly', 'bi-weekly', 'monthly'),
      allowNull: false
    },
    collateralType: {
      type: DataTypes.ENUM('property', 'vehicle', 'savings', 'title_deed', 'payslip', 'logbook'),
      allowNull: false
    },
    collateralValue: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    collateralFilePath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    defaultStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    loanTerm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Loan term in months'
    },
    // Newly added attributes
    payType: {
      type: DataTypes.ENUM('Bank', 'Mpesa', 'Cash'),
      allowNull: false
    },
    transactionNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateDisbursed: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approvalStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    disbursed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'defaulted'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Loan',
 
  });
  
  return Loan;
};
