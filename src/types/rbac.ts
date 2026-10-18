export const ROLE_NAMES = ['user', 'editor', 'admin'] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const PERMISSION_NAMES = [
  'product:create',
  'product:update',
  'product:delete',
  'product:manage-any',
  'user:create',
  'user:read',
  'user:update',
  'user:delete',
  'user:manage-roles',
] as const;
export type PermissionName = (typeof PERMISSION_NAMES)[number];

