'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change column 'disbursed' from STRING to BOOLEAN
    await queryInterface.changeColumn('Loans', 'disbursed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Set default value to false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert column 'disbursed' back to STRING
    await queryInterface.changeColumn('Loans', 'disbursed', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
