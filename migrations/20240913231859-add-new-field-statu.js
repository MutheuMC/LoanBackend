'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Loans', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending', // Default status is 'pending'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // To remove the ENUM safely, first drop the column
    await queryInterface.removeColumn('Loans', 'status');

    // Then drop the ENUM type itself to avoid issues with future migrations
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Loans_status";');
  }
};
