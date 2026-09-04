import { Injectable } from '@nestjs/common';
import { User } from '@auth/domain/entities/user/user.entity';
import { IUserRepository } from '@auth/domain/repositories/IUser.repository';
import { PrismaService } from '@shared/database/prisma.service';
import { UserId } from '@auth/domain/value-objects/userId.vo';
import { AccountStatus } from '@auth/domain/value-objects/accountStatus.vo';
import { Password } from '@auth/domain/value-objects/password.vo';
import { asyncHandlerError } from '../helpers/asyncHandlerError.helper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    return user ? User.reconstitute(user) : null;
  }

  async updateUsernameById(
    id: UserId,
    updates: { username?: string; lastUsernameChangedAt?: Date },
  ): Promise<User> {
    const result = await asyncHandlerError(async () => {
      return await this.prismaService.user.update({
        where: {
          id: id.toString(),
        },
        data: updates,
      });
    });

    return User.reconstitute(result);
  }

  async updatePasswordById(userId: UserId, password: Password): Promise<User> {
    const result = await asyncHandlerError(async () => {
      return await this.prismaService.user.update({
        where: {
          id: userId.toString(),
        },
        data: {
          password: password.toString(),
        },
      });
    });

    return User.reconstitute(result);
  }

  async updateStatusById(id: UserId, status: AccountStatus): Promise<User> {
    const user = await asyncHandlerError(async () => {
      return await this.prismaService.user.update({
        where: {
          id: id.toString(),
        },
        data: {
          status: status.currentStatus(),
        },
      });
    });

    return User.reconstitute(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user ? User.reconstitute(user) : null;
  }

  async findUserById(id: UserId): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return user ? User.reconstitute(user) : null;
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
    await asyncHandlerError(async () => {
      await this.prismaService.user.create({
        data: {
          id: user.getId().toString(),
          email: user.getEmail(),
          username: user.getUsername().toString(),
          password: user.getPassword().toString(),
          status: user.getStatus().currentStatus(),
          role: user.getRole(),
        },
      });
    });
  }
}
