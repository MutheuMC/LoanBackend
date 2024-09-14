'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Loans', 'payType', {
      type: Sequelize.ENUM('Bank', 'Mpesa', 'Cash'),
      allowNull: true, // Changed from false to true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Loans', 'payType', {
      type: Sequelize.ENUM('Bank', 'Mpesa', 'Cash'),
      allowNull: false, // Revert back to original (false)
    });
  }
};
