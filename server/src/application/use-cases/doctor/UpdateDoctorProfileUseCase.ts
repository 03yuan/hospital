import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UpdateDoctorProfileRequest } from '../../dtos/profile.dto';
import { Doctor } from '../../../domain/entities/Doctor';

export class UpdateDoctorProfileUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: number, req: UpdateDoctorProfileRequest): Promise<{ name: string; title: string; description: string; photo?: string }> {
    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) throw new Error('医生不存在');

    if (req.name !== undefined) {
      await this.userRepo.update(userId, { name: req.name });
    }

    const updateData: Partial<Doctor> = {};
    if (req.title !== undefined) updateData.title = req.title;
    if (req.description !== undefined) updateData.description = req.description;
    if (req.photo !== undefined) updateData.photo = req.photo;

    const saved = await this.doctorRepo.update(doctor.id!, updateData);
    const user = await this.userRepo.findById(userId);

    return { name: user!.name, title: saved.title, description: saved.description, photo: saved.photo };
  }
}
