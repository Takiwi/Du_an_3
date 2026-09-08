import { Username } from '@domain/value-objects/username.vo';
import { UserProfile } from '../entities/userProfile.entity';
import { UserId } from '../value-objects/userId.vo';

export const USER_PROFILE_REPOSITORY_TOKEN = 'IUserProfileRepository';

export interface IUserProfileRepository {
  findById(id: UserId): Promise<UserProfile | null>;
  findByUsername(username: Username): Promise<UserProfile | null>;
  existsByUsername(username: Username): Promise<boolean>;
  updateUsernameById(
    id: UserId,
    updates: { username: Username; lastUsernameChangedAt: Date },
  ): Promise<UserProfile>;
  insertProfile(profile: UserProfile): Promise<void>;

  deleteProfile(userId: UserId): Promise<void>;
}
