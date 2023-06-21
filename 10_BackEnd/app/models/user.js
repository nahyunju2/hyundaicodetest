'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: { type: DataTypes.STRING, primaryKey: true },
    userName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    langId: { type: DataTypes.STRING, allowNull: false },
    registTime: { type: DataTypes.DATE, allowNull: false },
    lastAccessTime: { type: DataTypes.DATE, allowNull: false },
    failPassword: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true
  });
  return User;
};