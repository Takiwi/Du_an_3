import { UserProfile } from '../entities/userProfile.entity';
import { UserId } from '../value-objects/userId.vo';

export const USER_PROFILE_REPOSITORY_TOKEN = 'IUserProfileRepository';

export interface IUserProfileRepository {
  findById(id: UserId): Promise<UserProfile | null>;
  findByUsername(username: string): Promise<UserProfile | null>;
  existsByUsername(username: string): Promise<boolean>;
  updateUsernameById(
    id: UserId,
    updates: { username: string; lastUsernameChangedAt: Date },
  ): Promise<UserProfile>;
  insertProfile(profile: UserProfile): Promise<void>;
}
