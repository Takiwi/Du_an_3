import { RefreshTokenId } from '../../value-objects/refreshTokenId.vo';
import { AccountId } from '../../value-objects/accountId.vo';
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
  private _accountId: AccountId;
  private _token: string;
  private _tokensUsed: UsedTokenHistory;
  private _expiresAt: Date;

  private constructor(
    id: RefreshTokenId,
    accountId: AccountId,
    token: string,
    tokensUsed: UsedTokenHistory,
    expiresAt: Date,
  ) {
    this._id = id;
    this._accountId = accountId;
    this._token = token;
    this._tokensUsed = tokensUsed;
    this._expiresAt = expiresAt;
  }

  private static create(
    props: RefreshTokenWithTokenUsed,
  ): Result<RefreshToken, AppError> {
    const id = RefreshTokenId.createId();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + props.expiresAt * 1000);

    return ok(
      new RefreshToken(
        id,
        props.accountId,
        props.token,
        props.tokensUsed,
        expiresAt,
      ),
    );
  }

  static baseEntity(props: BaseRefreshToken): Result<RefreshToken, AppError> {
    const defaultHistory = UsedTokenHistory.empty();

    return this.create({ ...props, tokensUsed: defaultHistory });
  }

  static reconstitute(props: PureRefreshToken) {
    const id = RefreshTokenId.reconstitute(props.id);
    const accountId = AccountId.reconstitute(props.accountId);
    const usedTokenHistory = UsedTokenHistory.fromArray(props.tokensUsed);

    return new RefreshToken(
      id,
      accountId,
      props.token,
      usedTokenHistory,
      props.expiresAt,
    );
  }

  isReuse(token: string): Result<RefreshToken, AppError> {
    if (this._tokensUsed.contains(token)) {
      return err(
        new AppError(
          'TOKEN_USED_DETECTED',
          'Refresh Token has already been used',
        ),
      );
    }

    if (this._token !== token) {
      return err(new AppError('INVALID_TOKEN', 'Invalid refresh token'));
    }

    this._token = token;
    this._tokensUsed = this._tokensUsed.markUsed(token);

    return ok(this);
  }

  public getId(): RefreshTokenId {
    return this._id;
  }

  public getAccountId(): AccountId {
    return this._accountId;
  }

  public getToken(): string {
    return this._token;
  }

  public getTokensUsed(): UsedTokenHistory {
    return this._tokensUsed;
  }

  public getExpiresAt(): Date {
    return this._expiresAt;
  }
}
