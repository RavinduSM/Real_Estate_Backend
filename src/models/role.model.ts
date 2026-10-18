import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/db';
import { timestampColumns } from './timestamps';
import type { RoleName } from '../types/rbac';
import type Permission from './permission.model';

class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<number>;
  // e.g. 'user', 'editor', 'admin'
  declare name: RoleName;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Present only when loaded with `include: [{ model: Permission, as: 'permissions' }]`.
  declare permissions?: NonAttribute<Permission[]>;
}

Role.init(
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
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
  }
);

export default Role;
