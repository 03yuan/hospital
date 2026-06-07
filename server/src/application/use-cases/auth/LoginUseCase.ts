import bcrypt from 'bcryptjs';
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

    const isBcrypt = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

    if (isBcrypt) {
      const valid = await bcrypt.compare(req.password, user.password);
      if (!valid) throw new Error('密码错误');
    } else {
      if (user.password !== req.password) throw new Error('密码错误');
      await this.userRepo.update(user.id!, { password: req.password });
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
