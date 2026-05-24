import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UpdateProfileRequest, ProfileResponse } from '../../dtos/profile.dto';

export class UpdateProfileUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: number, req: UpdateProfileRequest): Promise<ProfileResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('用户不存在');

    if (req.newPassword) {
      if (!req.oldPassword) throw new Error('修改密码需提供原密码');
      if (user.password !== req.oldPassword) throw new Error('原密码错误');
    }

    const updateData: any = {};
    if (req.name) updateData.name = req.name;
    if (req.newPassword) updateData.password = req.newPassword;

    const saved = await this.userRepo.update(userId, updateData);

    return { id: saved.id!, phone: saved.phone, name: saved.name, role: saved.role };
  }
}
