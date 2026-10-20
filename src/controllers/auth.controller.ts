import * as authService from '../services/auth.service';
import catchAsync from '../utils/catchAsync';
import type { LoginInput, RegisterInput } from '../validations/auth.validation';


export const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body as RegisterInput);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

export const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.login(req.body as LoginInput);

  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});

