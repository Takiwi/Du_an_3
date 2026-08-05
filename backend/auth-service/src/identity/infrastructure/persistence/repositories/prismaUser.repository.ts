import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/IUser.repository';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
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

  async insertUser(user: User): Promise<User> {
    const result = await this.prismaService.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: user.email,
          username: user.username,
          password: user.password,
          status: user.status,
        },
      });

      return User.fromPrismaEntity(newUser);
    });

    return result;
  }
}
