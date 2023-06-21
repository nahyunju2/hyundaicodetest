'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FileShare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FileShare.init({
    share_id: { type: DataTypes.UUID, primaryKey: true },
    file_id: { type: DataTypes.UUID, allowNull: false },
    folder_id: { type: DataTypes.UUID, allowNull: false },
    share_email: { type: DataTypes.STRING, allowNull: false },
    share_start_date: DataTypes.DATE,
    share_end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FileShare',
    freezeTableName: true
  });
  return FileShare;
};