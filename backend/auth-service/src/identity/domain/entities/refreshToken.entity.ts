import { unwrapResult } from '@packages/core/helpers/resultPattern';
import { UserId } from '../value-objects/userId.vo';

export class RefreshToken {
  private readonly _id: UserId;
  private _userId: UserId;
  private _token: string;
  private _tokensUsed: string[];

  private constructor(
    id: UserId,
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
    userId: UserId;
    token: string;
    tokensUsed?: string[];
  }) {
    const id = UserId.generate();

    return new RefreshToken(id, props.userId, props.token, props.tokensUsed);
  }

  static fromPrismaEntity(props: {
    id: string;
    userId: UserId;
    token: string;
    tokensUsed: string[];
  }) {
    const userId = unwrapResult(UserId.create(props.id));

    return new RefreshToken(
      userId,
      props.userId,
      props.token,
      props.tokensUsed,
    );
  }

  public getId(): UserId {
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
