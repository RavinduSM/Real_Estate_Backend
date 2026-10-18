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
import type User from './user.model';

class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: CreationOptional<string | null>;
  declare price: number;
  declare userId: number;
  // Tenant scoping. Set from the requesting user in product.service.ts, and used in product.service.ts to filter queries so one organization
  declare organizationId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Present only when eager-loaded with `as: 'owner'`.
  declare owner?: NonAttribute<User>;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Product name is required' } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: 'Price cannot be negative' } },
      get(this: Product): number {
        return Number(this.getDataValue('price'));
      },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
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
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
  }
);

export default Product;
