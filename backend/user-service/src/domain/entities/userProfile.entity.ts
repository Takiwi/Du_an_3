import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';
import { UserId } from '../value-objects/userId.vo';
import { Username } from '../value-objects/username.vo';
import { BaseUserProfile, PureUserProfile } from './userProfile.contract';
import { UserStatus } from '@domain/value-objects/userStatus.vo';

export class UserProfile {
  private readonly _id: UserId;
  private _username: Username;
  private _email: string;
  private _status: UserStatus;

  private constructor(
    id: UserId,
    username: Username,
    email: string,
    status: UserStatus,
  ) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._status = status;
  }

  static create(props: BaseUserProfile): Result<UserProfile, AppError> {
    const id = UserId.create();
    const usernameResult = Username.firstUsername(props.username);
    const userStatus = UserStatus.active();

    if (usernameResult.isErr()) {
      return err(usernameResult.error);
    }

    return ok(
      new UserProfile(id, usernameResult.value, props.email, userStatus),
    );
  }

  static reconstitute(props: PureUserProfile): UserProfile {
    const id = UserId.reconstitute(props.id);
    const username = Username.reconstitute(
      props.username,
      props.lastUsernameChangedAt,
    );
    const userStatus = UserStatus.reconstitute(props.status);

    return new UserProfile(id, username, props.email, userStatus);
  }

  getId(): UserId {
    return this._id;
  }

  getUsername(): Username {
    return this._username;
  }

  getEmail(): string {
    return this._email;
  }

  getStatus() {
    return this._status;
  }

  getLastUsernameChangedAt(): Date | null {
    return this._username.getLastUsernameChangedAt();
  }

  updateUsername(newUsername: Username): void {
    this._username = newUsername;
  }
}
