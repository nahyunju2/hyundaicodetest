'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      File.hasMany(models.FileMap, {
        foreignKey: "file_id"
      });
      File.belongsTo(models.Disk, {
        foreignKey: "disk_id"
      })
    }
  }
  File.init({
    file_id: { type: DataTypes.UUID, primaryKey: true },
    file_name: { type: DataTypes.STRING, allowNull: false },
    file_size: { type: DataTypes.BIGINT, allowNull: false },
    owner: { type: DataTypes.STRING, allowNull: false },
    disk_id: { type: DataTypes.INTEGER, allowNull: false },
    file_full_path: { type: DataTypes.STRING, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false },
    deleted_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'File',
    freezeTableName: true
  });
  return File;
};