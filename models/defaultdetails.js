'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DefaultDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DefaultDetails.init({
    defaultDate: DataTypes.DATE,
    defaultAmount: DataTypes.BIGINT,
    penaltyAmount: DataTypes.DECIMAL,
    remarks: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'DefaultDetails',
  });
  return DefaultDetails;
};