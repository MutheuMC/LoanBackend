'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Loans', 'payType', {
      type: Sequelize.STRING,
      allowNull: true, // Or `false` depending on your requirements
    });
    
    await queryInterface.addColumn('Loans', 'transactionNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Loans', 'dateDisbursed', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Loans', 'payType');
    await queryInterface.removeColumn('Loans', 'transactionNumber');
    await queryInterface.removeColumn('Loans', 'dateDisbursed');
  }
};
