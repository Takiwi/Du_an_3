import { randomUUID } from 'crypto';
import { UserId } from '../value-objects/userId.vo';

export class RefreshToken {
  private readonly _id: string;
  private _userId: UserId;
  private _token: string;
  private _tokensUsed: string[];

  private constructor(
    id: string,
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
    return new RefreshToken(
      randomUUID(),
      props.userId,
      props.token,
      props.tokensUsed,
    );
  }

  static fromPrismaEntity(props: {
    id: string;
    userId: UserId;
    token: string;
    tokensUsed: string[];
  }) {
    return new RefreshToken(
      props.id,
      props.userId,
      props.token,
      props.tokensUsed,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): UserId {
    return this._userId;
  }

  public get token(): string {
    return this._token;
  }

  public get tokensUsed(): string[] {
    return this._tokensUsed;
  }
}
