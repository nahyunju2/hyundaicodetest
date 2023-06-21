'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Disk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Disk.hasMany(models.File,{
        foreignKey: "disk_id"
      });
    }
  }
  Disk.init({
    disk_id: { type: DataTypes.INTEGER, primaryKey: true },
    disk_name: { type: DataTypes.STRING, allowNull: false },
    disk_path: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'Disk',
    freezeTableName: true
  });
  return Disk;
};