import { randomUUID } from 'crypto';
import { RefreshTokenId } from '../value-objects/refreshTokenId.vo';
import { UserId } from '../value-objects/userId.vo';

export class RefreshToken {
  private readonly _id: RefreshTokenId;
  private _userId: UserId;
  private _token: string;
  private _tokensUsed: string[];

  private constructor(
    id: RefreshTokenId,
    userId: UserId,
    token: string,
    tokensUsed: string[] = [],
  ) {
    this._id = id;
    this._userId = userId;
    this._token = token;
    this._tokensUsed = tokensUsed;
  }

  static create(props: {
    userId: string;
    token: string;
    tokensUsed?: string[];
  }) {
    const id = RefreshTokenId.create(randomUUID());
    const userId = UserId.create(props.userId.toString());

    return new RefreshToken(id, userId, props.token, props.tokensUsed);
  }

  static fromPrismaEntity(props: {
    id: string;
    userId: string;
    token: string;
    tokensUsed: string[];
  }) {
    const id = RefreshTokenId.create(props.id);
    const userId = UserId.create(props.userId);

    return new RefreshToken(id, userId, props.token, props.tokensUsed);
  }

  public getId(): RefreshTokenId {
    return this._id;
  }

  public getUserId(): UserId {
    return this._userId;
  }

  public getToken(): string {
    return this._token;
  }

  public getTokensUsed(): string[] {
    return this._tokensUsed;
  }
}
