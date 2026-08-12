import { randomUUID } from 'crypto';

export class RefreshToken {
  readonly _id: string;
  private _userId: string;
  private _token: string;
  private _tokensUsed: string[];

  private constructor(
    id: string,
    userId: string,
    token: string,
    tokensUsed: string[],
  ) {
    this._id = id;
    this._userId = userId;
    this._token = token;
    this._tokensUsed = tokensUsed;
  }

  create(props: { userId: string; token: string; tokensUsed: string[] }) {
    return new RefreshToken(
      randomUUID(),
      props.userId,
      props.token,
      props.tokensUsed,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this.userId;
  }

  public get token(): string {
    return this.token;
  }

  public get tokensUsed(): string[] {
    return this.tokensUsed;
  }
}
