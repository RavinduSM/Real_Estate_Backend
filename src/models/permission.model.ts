import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/db';
import { timestampColumns } from './timestamps';
import type { PermissionName } from '../types/rbac';

class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id: CreationOptional<number>;
  // e.g. 'product:create', 'product:delete', 'user:manage-roles'
  declare name: PermissionName;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ...timestampColumns,
  },
  {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
    timestamps: true,
  }
);

export default Permission;
