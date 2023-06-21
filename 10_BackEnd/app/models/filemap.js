'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FileMap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FileMap.belongsTo(models.File, {
        foreignKey: "file_id"
      });
      FileMap.belongsTo(models.Folder, {
        foreignKey: "folder_id"
      });
    }
  }
  FileMap.init({
    email: { type: DataTypes.STRING, primaryKey: true },
    file_id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    folder_id: { type: DataTypes.UUID, primaryKey: true, allowNull: false }
  }, {
    sequelize,
    modelName: 'FileMap',
    freezeTableName: true
  });
  return FileMap;
};