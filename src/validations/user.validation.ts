import Joi from 'joi';
import { ROLE_NAMES, type RoleName } from '../types/rbac';
import { passwordRule } from './auth.validation';

export interface InviteUserInput {
  name: string;
  email: string;
  password: string;
  roleName?: RoleName;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export interface UpdateUserRoleInput {
  role: RoleName;
}

export const inviteUserSchema = Joi.object<InviteUserInput>({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: passwordRule.required(),
  roleName: Joi.string()
    .valid(...ROLE_NAMES)
    .optional(),
});

export const updateUserSchema = Joi.object<UpdateUserInput>({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().lowercase().email(),
})
  .min(1) // must update at least one field
  .messages({ 'object.min': 'Provide at least one field to update' });

export const updateUserRoleSchema = Joi.object<UpdateUserRoleInput>({
  role: Joi.string()
    .valid(...ROLE_NAMES)
    .required(),
});

