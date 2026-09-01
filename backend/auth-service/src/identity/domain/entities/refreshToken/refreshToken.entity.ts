import { randomUUID } from 'crypto';
import { RefreshTokenId } from '../../value-objects/refreshTokenId.vo';
import { UserId } from '../../value-objects/userId.vo';
import { UsedTokenHistory } from '../../value-objects/usedTokenHistory.vo';
import { AppError } from '@packages/pattern';
import { ok, err, Result } from 'neverthrow';
import {
  BaseRefreshToken,
  PureRefreshToken,
  RefreshTokenWithTokenUsed,
} from './refreshToken.contract';

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

  private static create(
    props: RefreshTokenWithTokenUsed,
  ): Result<RefreshToken, AppError> {
    const idResult = RefreshTokenId.create(randomUUID());
    const userIdResult = UserId.create(props.userId.toString());

    const combined = Result.combine([idResult, userIdResult]);

    if (combined.isErr()) {
      return err(combined.error);
    }

    const [id, userId] = combined.value;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + props.expiresAt * 1000);

    return ok(
      new RefreshToken(id, userId, props.token, props.tokensUsed, expiresAt),
    );
  }

  static baseEntity(props: BaseRefreshToken): Result<RefreshToken, AppError> {
    const defaultHistory = UsedTokenHistory.empty();

    return this.create({ ...props, tokensUsed: defaultHistory });
  }

  static reconstitute(props: PureRefreshToken) {
    const id = RefreshTokenId.reconstitute(props.id);
    const userId = UserId.reconstitute(props.userId);
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
      return err(
        new AppError(
          'TOKEN_USED_DETECTED',
          'Refresh Token has already been used',
        ),
      );
    }

    // compare current token with incomingToken
    if (this._token !== incomingToken) {
      return err(new AppError('INVALID_TOKEN', 'Invalid refresh token'));
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
