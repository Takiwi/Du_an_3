import { Injectable } from '@nestjs/common';
import { IUserProfileRepository } from '../../domain/repositories/IUserProfile.repository';
import { UserProfile } from '../../domain/entities/userProfile.entity';
import { UserId } from '../../domain/value-objects/userId.vo';
import { PrismaService } from '@shared/database/prisma.service';
import { asyncHandlerError } from '@shared/helpers/asyncHandlerError.helper';

@Injectable()
export class UserProfileRepository implements IUserProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: UserId): Promise<UserProfile | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return user ? UserProfile.reconstitute(user) : null;
  }

  async findByUsername(username: string): Promise<UserProfile | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    return user ? UserProfile.reconstitute(user) : null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
      select: { id: true },
    });

    return !!user;
  }

  async updateUsernameById(
    id: UserId,
    updates: { username: string; lastUsernameChangedAt: Date },
  ): Promise<UserProfile> {
    const result = await asyncHandlerError(async () => {
      return await this.prismaService.user.update({
        where: {
          id: id.toString(),
        },
        data: {
          username: updates.username,
          lastUsernameChangedAt: updates.lastUsernameChangedAt,
        },
      });
    });

    return UserProfile.reconstitute(result);
  }

  async insertProfile(profile: UserProfile): Promise<void> {
    // In current shared DB, if record doesn't exist yet, insert profile fields
    // or update if account record already created it
    await asyncHandlerError(async () => {
      await this.prismaService.user.upsert({
        where: { id: profile.getId().toString() },
        update: {
          username: profile.getUsername().toString(),
          lastUsernameChangedAt: profile.getLastUsernameChangedAt(),
        },
        create: {
          id: profile.getId().toString(),
          email: profile.getEmail(),
          username: profile.getUsername().toString(),
          password: '',
          status: (profile.getStatus() as any) ?? 'ACTIVE',
          role: (profile.getRole() as any) ?? 'USER',
        },
      });
    });
  }
}
