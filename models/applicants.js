'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Applicant extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.hasMany(models.Loan, { foreignKey: 'applicantId' });
      // this.hasMany(models.LoanRequest, { foreignKey: 'ApplicantID' });
      // this.hasMany(models.Applicant, { foreignKey: 'userId' });
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    maritalStatus: {
      type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
      allowNull: false
    },
    spouseName: {
      type: DataTypes.STRING
    },
    spouseIdNumber: {
      type: DataTypes.STRING
    },
    spousePhoneNumber: {
      type: DataTypes.STRING
    },
    village: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subCounty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    county: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    businessLocation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nextOfKin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nextOfKinPhone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Applicant',
  });

  return Applicant;
};