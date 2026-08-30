import { Injectable } from '@nestjs/common';
import { User } from '@auth/domain/entities/user.entity';
import { IUserRepository } from '@auth/domain/repositories/IUser.repository';
import { PrismaService } from '@shared/database/prisma.service';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { AccountStatus } from '@auth/domain/value-objects/accountStatus.vo';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async updateStatusById(
    id: UserId,
    status: AccountStatus,
  ): Promise<User | null> {
    const user = await this.prismaService.user.update({
      where: {
        id: id.toString(),
      },
      data: {
        status: status.currentStatus(),
      },
    });

    return user ? User.fromPrismaEntity(user) : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user ? User.fromPrismaEntity(user) : null;
  }

  async findUserById(id: UserId): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id.toString(),
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
        id: user.getId().toString(),
        email: user.getEmail(),
        username: user.getUsername(),
        password: user.getPassword(),
        status: user.getStatus().currentStatus(),
        role: user.getRole(),
      },
    });
  }
}
