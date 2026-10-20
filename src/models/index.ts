import { sequelize } from '../config/db';

import Organization from './organization.model';
import Permission from './permission.model';
import Product from './product.model';
import Role from './role.model';
import User from './user.model';

Organization.hasMany(User, { foreignKey: 'organizationId', as: 'users' });
User.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Product, { foreignKey: 'organizationId', as: 'products' });
Product.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

Role.belongsToMany(Permission, {
  through: 'RolePermissions',
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: 'RolePermissions',
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles',
});

export { sequelize };
export default { sequelize };
