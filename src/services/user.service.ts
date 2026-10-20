import { Organization, Permission, Role, User } from '../models';
import type { RoleName } from '../types/rbac';
import AppError from '../utils/AppError';
import type { InviteUserInput, UpdateUserInput } from '../validations/user.validation';

const withRelations = {
  include: [
    { model: Role, as: 'role', include: [{ model: Permission, as: 'permissions' }] },
    { model: Organization, as: 'organization' },
  ],
};

export async function getAllUsers(requestingUser: User): Promise<User[]> {
  return User.findAll({
    where: { organizationId: requestingUser.organizationId },
    ...withRelations,
  });
}

export async function getUserById(id: number, requestingUser: User): Promise<User> {
  const isSelf = id === requestingUser.id;
  if (!isSelf && !requestingUser.hasPermission('user:read')) {
    throw new AppError('You do not have permission to view this user', 403);
  }

  const user = await User.findOne({
    where: { id, organizationId: requestingUser.organizationId },
    ...withRelations,
  });
  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }
  return user;
}

// Invites a teammate into the REQUESTING user's organization. After the initial signup (see auth.service.ts) this is the only way to add a user
export async function inviteUser(userData: InviteUserInput, requestingUser: User): Promise<User> {
  const { name, email, password, roleName } = userData;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('A user with that email already exists', 409);
  }

  const targetRoleName: RoleName = roleName ?? 'user';
  if (targetRoleName !== 'user' && !requestingUser.hasPermission('user:manage-roles')) {
    throw new AppError('You do not have permission to assign that role', 403);
  }

  const role = await Role.findOne({ where: { name: targetRoleName } });
  if (!role) {
    throw new AppError(`Unknown role "${targetRoleName}"`, 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    roleId: role.id,
    organizationId: requestingUser.organizationId, 
  });

  return getUserById(user.id, requestingUser);
}

export async function updateUser(
  id: number,
  updates: UpdateUserInput,
  requestingUser: User
): Promise<User> {
  const isSelf = id === requestingUser.id;
  if (!isSelf && !requestingUser.hasPermission('user:update')) {
    throw new AppError('You do not have permission to update this user', 403);
  }

  const user = await User.findOne({
    where: { id, organizationId: requestingUser.organizationId },
  });
  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  // Whitelist the updatable fields here so "what can be edited" lives in one place.
  const { name, email } = updates;
  await user.update({
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
  });
  return getUserById(user.id, requestingUser);
}


export async function updateUserRole(
  id: number,
  roleName: RoleName,
  requestingUser: User
): Promise<User> {
  const user = await User.findOne({
    where: { id, organizationId: requestingUser.organizationId },
  });
  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }

  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new AppError(`Unknown role "${roleName}"`, 400);
  }

  await user.update({ roleId: role.id });
  return getUserById(user.id, requestingUser);
}

export async function deleteUser(id: number, requestingUser: User): Promise<void> {
  const user = await User.findOne({
    where: { id, organizationId: requestingUser.organizationId },
  });
  if (!user) {
    throw new AppError('No user found with that ID', 404);
  }
  await user.destroy();
}

