import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { LoginRequest, AuthResponse } from '../../dtos/auth.dto';
import { generateToken } from '../../../utils/jwt';

export class LoginUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(req: LoginRequest): Promise<AuthResponse> {
    const user = await this.userRepo.findByPhone(req.phone);
    if (!user) {
      throw new Error('手机号未注册');
    }

    if (user.password !== req.password) {
      throw new Error('密码错误');
    }

    const token = generateToken({
      userId: user.id!,
      phone: user.phone,
      role: user.role,
    });

    return {
      token,
      user: { id: user.id!, phone: user.phone, name: user.name, role: user.role },
    };
  }
}
