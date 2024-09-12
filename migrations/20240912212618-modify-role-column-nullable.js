'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'user', 'manager'),
      allowNull: true,  // Change allowNull to true
      defaultValue: 'user',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the change if necessary
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'user', 'manager'),
      allowNull: false,  // Reverting back to allowNull: false
      defaultValue: 'user',
    });
  }
};
