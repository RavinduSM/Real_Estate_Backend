import { DataTypes } from 'sequelize';


export const timestampColumns = {
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
};
