import { randomUUID } from 'crypto';
import { RefreshTokenId } from '../value-objects/refreshTokenId.vo';
import { UserId } from '../value-objects/userId.vo';
import { UsedTokenHistory } from '../value-objects/usedTokenHistory.vo';
import { AppError, fail, ok, Result } from '@packages/pattern';

export class RefreshToken {
  private readonly _id: RefreshTokenId;
  private _userId: UserId;
  private _token: string;
  private _tokensUsed: UsedTokenHistory;
  private _expiresAt: Date;

  private constructor(
    id: RefreshTokenId,
    userId: UserId,
    token: string,
    tokensUsed: UsedTokenHistory,
    expiresAt: Date,
  ) {
    this._id = id;
    this._userId = userId;
    this._token = token;
    this._tokensUsed = tokensUsed;
    this._expiresAt = expiresAt;
  }

  static create(props: {
    userId: string;
    token: string;
    tokensUsed?: string[];
    expiresAt: number;
  }) {
    const id = RefreshTokenId.create(randomUUID());
    const userId = UserId.create(props.userId.toString());
    const usedTokenHistory = props.tokensUsed
      ? UsedTokenHistory.fromArray(props.tokensUsed)
      : UsedTokenHistory.empty();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + props.expiresAt * 1000);

    return new RefreshToken(
      id,
      userId,
      props.token,
      usedTokenHistory,
      expiresAt,
    );
  }

  static fromPrismaEntity(props: {
    id: string;
    userId: string;
    token: string;
    tokensUsed: string[];
    expiresAt: Date;
  }) {
    const id = RefreshTokenId.create(props.id);
    const userId = UserId.create(props.userId);
    const usedTokenHistory = UsedTokenHistory.fromArray(props.tokensUsed);

    return new RefreshToken(
      id,
      userId,
      props.token,
      usedTokenHistory,
      props.expiresAt,
    );
  }

  route(
    incomingToken: string,
    newToken: string,
  ): Result<RefreshToken, AppError> {
    // check if the Refresh Token has already been used
    if (this._tokensUsed.contains(incomingToken)) {
      return fail(
        new AppError(
          'TOKEN_USED_DETECTED',
          'Refresh Token has already been used',
        ),
      );
    }

    // compare current token with incomingToken
    if (this._token !== incomingToken) {
      return fail(new AppError('INVALID_TOKEN', 'Invalid refresh token'));
    }

    // revoke current token and add new token
    this._token = newToken;
    this._tokensUsed = this._tokensUsed.markUsed(incomingToken);

    return ok(this);
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

  public getTokensUsed() {
    return this._tokensUsed;
  }

  public getExpiresAt() {
    return this._expiresAt;
  }
}
