import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/identity/domain/entities/user.entity';
import { IUserRepository } from 'src/identity/domain/repositories/userResponse.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class userRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!prismaUser) return null;

    return plainToInstance(User, prismaUser, {
      excludeExtraneousValues: false,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEmail = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!userEmail) return null;

    return plainToInstance(User, userEmail, { excludeExtraneousValues: false });
  }

  async insertUser(user: User): Promise<User | null> {
    return plainToInstance(
      User,
      await this.prismaService.user.create({
        data: {
          email: user.email,
          username: user.username,
          password: user.password,
          status: user.status,
        },
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
