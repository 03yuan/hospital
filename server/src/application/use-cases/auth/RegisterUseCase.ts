import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { RegisterRequest, AuthResponse } from '../../dtos/auth.dto';
import { generateToken } from '../../../utils/jwt';

export class RegisterUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(req: RegisterRequest): Promise<AuthResponse> {
    const existing = await this.userRepo.findByPhone(req.phone);
    if (existing) {
      throw new Error('手机号已注册');
    }

    const user = new User({
      phone: req.phone,
      password: req.password,
      name: req.name,
    });

    const saved = await this.userRepo.create(user);

    const token = generateToken({
      userId: saved.id!,
      phone: saved.phone,
      role: saved.role,
    });

    return {
      token,
      user: { id: saved.id!, phone: saved.phone, name: saved.name, role: saved.role },
    };
  }
}
