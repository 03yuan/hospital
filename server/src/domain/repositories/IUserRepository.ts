import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
}
