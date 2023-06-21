'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LogFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LogFile.init({
    log_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    log_message: { type: DataTypes.STRING, allowNull: false },
    file_id: { type: DataTypes.UUID, allowNull: false },
    folder_id: { type: DataTypes.UUID, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'LogFile',
  });
  return LogFile;
};