import bcrypt from 'bcryptjs';
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
import type { PermissionName } from '../types/rbac';
import type Organization from './organization.model';
import type Role from './role.model';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare roleId: number;
  // Every user belongs to exactly one tenant. This is what scopes queries in the service layer so one organization can never see another's data.
  declare organizationId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Present only when eager-loaded (see middleware/auth.ts `protect`).
  declare role?: NonAttribute<Role>;
  declare organization?: NonAttribute<Organization>;

  // Compares a plaintext password against the stored hash.
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  hasPermission(permissionName: PermissionName): boolean {
    const permissions = this.role?.permissions;
    if (!Array.isArray(permissions)) return false;
    return permissions.some((p) => p.name === permissionName);
  }

  // Strips the password whenever an instance is serialised, so res.json({ user }) can never leak the hash.
  override toJSON(): object {
    const values: Partial<InferAttributes<User>> = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Name is required' } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: 'Must be a valid email' } },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // Runs on the plaintext (validation happens before the beforeCreate hash hook); the 100 cap also comfortably fits a 60-char bcrypt hash.
      validate: { len: [6, 100] },
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'role_id',
    },
    organizationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'organization_id',
    },
    ...timestampColumns,
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      // Hash the password before insert.
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      // Re-hash only if the password was actually changed.
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
