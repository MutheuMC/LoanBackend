'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Loans', 'disbursed', {
      type: Sequelize.STRING, // You can also use ENUM for predefined statuses (e.g. pending, approved, disbursed, etc.)
      allowNull: false,
      defaultValue: false // Assuming the default status is 'pending'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Loans', 'status');
  }
};
