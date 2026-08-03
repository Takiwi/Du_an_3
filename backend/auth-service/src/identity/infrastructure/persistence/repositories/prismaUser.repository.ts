import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/IUser.repository';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(id: string): Promise<User | null> {
    const prismaUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return prismaUser ? User.fromPrismaEntity(prismaUser) : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const userEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return userEmail ? User.fromPrismaEntity(userEmail) : null;
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
