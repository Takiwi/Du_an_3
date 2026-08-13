import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/IUser.repository';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user ? User.fromPrismaEntity(user) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user ? User.fromPrismaEntity(user) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const isExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return isExist ? true : false;
  }

  async insertUser(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        status: user.status,
        role: user.role,
      },
    });
  }
}
