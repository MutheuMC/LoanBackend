'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Applicant extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'UserID' });
      this.hasMany(models.Loan, { foreignKey: 'ApplicantID' });
      // this.hasMany(models.LoanRequest, { foreignKey: 'ApplicantID' });
      this.hasMany(models.Applicant, { foreignKey: 'UserID' });
    }
  }
  
  Applicant.init({
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
    UserID: {
      type: DataTypes.UUID,
      allowNull: false
    },
    FullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    IDNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    MaritalStatus: {
      type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
      allowNull: false
    },
    SpouseName: {
      type: DataTypes.STRING
    },
    SpouseIDNumber: {
      type: DataTypes.STRING
    },
    SpousePhoneNumber: {
      type: DataTypes.STRING
    },
    Village: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    SubCounty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    County: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BusinessName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BusinessLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    NextOfKin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    NextOfKinPhone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Applicant',
  });

  return Applicant;
};