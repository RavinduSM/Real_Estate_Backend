import { Organization, Role, User, sequelize } from '../models';
import AppError from '../utils/AppError';
import signToken from '../utils/signToken';
import { generateUniqueSlug } from '../utils/slugify';
import type { LoginInput, RegisterInput } from '../validations/auth.validation';
import * as userService from './user.service';

export interface AuthResult {
  user: User;
  token: string;
}

/*
  SaaS signup: one call creates a brand-new tenant (Organization) AND its
  first user, who becomes that organization's 'admin'. Every later teammate
  is added through userService.inviteUser, not through this function. This
  means "start a new workspace".
 */
export async function register(input: RegisterInput): Promise<AuthResult> {
  const { organizationName, name, email, password } = input;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('A user with that email already exists', 409);
  }

  const adminRole = await Role.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    throw new AppError('Default roles are not configured. Run the role/permission seeder.', 500);
  }

  const user = await sequelize.transaction(async (transaction) => {
    const slug = await generateUniqueSlug(
      organizationName,
      async (candidate) => (await Organization.count({ where: { slug: candidate }, transaction })) > 0
    );

    const organization = await Organization.create(
      { name: organizationName, slug },
      { transaction }
    );

    return User.create(
      { name, email, password, roleId: adminRole.id, organizationId: organization.id },
      { transaction }
    );
  });

  const fullUser = await userService.getUserById(user.id, user);
  return { user: fullUser, token: signToken(user.id) };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const { email, password } = input;

  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const fullUser = await userService.getUserById(user.id, user);
  return { user: fullUser, token: signToken(user.id) };
}

