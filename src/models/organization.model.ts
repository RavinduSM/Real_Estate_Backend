import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../config/db';
import { timestampColumns } from './timestamps';

export type OrganizationPlan = 'free' | 'pro' | 'enterprise';

// The tenant boundary for the whole app. Every user belongs to exactly one organization.
class Organization extends Model<
  InferAttributes<Organization>,
  InferCreationAttributes<Organization>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  // URL-safe identifier, e.g. for a subdomain or invite link (acme.yourapp.com)
  declare slug: string;
  declare plan: CreationOptional<OrganizationPlan>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Organization.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Organization name is required' } },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    plan: {
      type: DataTypes.ENUM('free', 'pro', 'enterprise'),
      defaultValue: 'free',
    },
    ...timestampColumns,
  },
  {
    sequelize,
    modelName: 'Organization',
    tableName: 'organizations',
    timestamps: true,
  }
);

export default Organization;
