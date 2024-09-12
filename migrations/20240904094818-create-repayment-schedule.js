'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_RepaymentSchedules_paymentStatus" AS ENUM('pending', 'paid', 'overdue');
    `);
    await queryInterface.createTable('RepaymentSchedules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      uuid: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      loanId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Loans',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      repaymentDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      amountDue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'overdue'),
        allowNull: false,
        defaultValue: 'pending'
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
    await queryInterface.dropTable('RepaymentSchedules');

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_RepaymentSchedules_paymentStatus";
    `);
  }
};