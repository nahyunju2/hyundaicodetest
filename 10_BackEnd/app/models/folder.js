'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Folder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Folder.hasMany(models.FileMap,{
        foreignKey: 'folder_id'
      });

      // Folder.belongsTo(Folder, {as: 'parent', foreignKey: 'parent_folder_id'})

      // Folder.hasMany(Folder, {as: 'children', foreignKey: 'parent_folder_id'})

      // Folder.belongsToMany(Folder, {as: 'descendents', foreignKey: 'ancestor_id', through: models.FolderAncestor})

      // Folder.belongsToMany(Folder, {as: 'ancestors', foreignKey: 'folder_id', through: models.FolderAncestor})
    }
  }
  Folder.init({
    folder_id: { type: DataTypes.UUID, primaryKey: true },
    folder_type: { type: DataTypes.STRING, allowNull: false },
    parent_folder_id: { type:DataTypes.UUID, hierarchy: true },
    folder_name: { type: DataTypes.STRING, allowNull: false },
    owner: { type: DataTypes.STRING, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false },
    deleted_date: { type: DataTypes.DATE },
    hierarchyLevel: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Folder',
    freezeTableName: true
  });
  return Folder;
};