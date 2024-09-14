'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Loans', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      applicantId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Applicants',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      loanAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      loanTerm: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Loan term in months'
      },
      interestRate: {
        type: Sequelize.DECIMAL(5, 4),
        allowNull: false
      },
      interestAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentFrequency: {
        type: Sequelize.ENUM('weekly', 'bi-weekly', 'monthly'),
        allowNull: false
      },
      dateBorrowed: {
        type: Sequelize.DATE,
        allowNull: false
      },
      disbursed:{
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Set default value to false
      },
      dateDisbursed:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      payType:{
        type: Sequelize.ENUM('Bank', 'Mpesa', 'Cash'),
        allowNull: false
      },
      transactionNumber:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstPaymentDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      lastPaymentDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      balanceDue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      collateralType: {
        type: Sequelize.ENUM('property', 'vehicle', 'savings', 'title_deed', 'payslip', 'logbook'),
        allowNull: false
      },
      collateralValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      collateralFilePath: {
        type: Sequelize.STRING,
        allowNull: true
      },
      penaltyAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      defaultStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      approvalStatus:{
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending', 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Loans');
  }
};