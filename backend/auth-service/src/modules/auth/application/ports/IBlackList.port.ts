export const BLACKLIST_TOKEN = Symbol('BLACKLIST_TOKEN');

export interface IBlacklist {
  insertToken(
    tokenId: string,
    accessToken: string,
    ttlInSeconds: number,
  ): Promise<void>;
}
