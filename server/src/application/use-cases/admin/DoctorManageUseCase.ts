import bcrypt from 'bcryptjs';
import { IDoctorRepository } from '../../../domain/repositories/IDoctorRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IDepartmentRepository } from '../../../domain/repositories/IDepartmentRepository';
import { Doctor } from '../../../domain/entities/Doctor';
import { User } from '../../../domain/entities/User';
import { UserStatus, Role } from '../../../domain/enums';
import { DoctorManageDto } from '../../dtos/admin.dto';

export class DoctorManageUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository,
    private readonly deptRepo: IDepartmentRepository,
  ) {}

  async list(): Promise<DoctorManageDto[]> {
    const doctors = await this.doctorRepo.findAll(true);
    const result: DoctorManageDto[] = [];
    for (const d of doctors) {
      const user = await this.userRepo.findById(d.userId);
      if (user) {
        const dept = await this.deptRepo.findById(d.departmentId);
        result.push({
          id: d.id,
          phone: user.phone,
          name: user.name,
          departmentId: d.departmentId,
          departmentName: dept?.name || '',
          title: d.title,
          description: d.description,
          status: user.status,
        });
      }
    }
    return result;
  }

  async create(dto: DoctorManageDto): Promise<DoctorManageDto> {
    const rawPassword = dto.password || '123456';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const user = new User({
      phone: dto.phone,
      password: hashedPassword,
      name: dto.name,
      role: Role.DOCTOR,
    });
    const savedUser = await this.userRepo.create(user);

    const doctor = new Doctor({
      userId: savedUser.id!,
      departmentId: dto.departmentId,
      title: dto.title,
      description: dto.description,
    });
    const savedDoctor = await this.doctorRepo.create(doctor);

    return { ...dto, id: savedDoctor.id };
  }

  async update(id: number, dto: DoctorManageDto): Promise<DoctorManageDto> {
    await this.doctorRepo.update(id, {
      departmentId: dto.departmentId,
      title: dto.title,
      description: dto.description,
    });
    return dto;
  }

  async updateStatus(id: number, status: UserStatus): Promise<void> {
    await this.doctorRepo.updateStatus(id, status);
  }
}
