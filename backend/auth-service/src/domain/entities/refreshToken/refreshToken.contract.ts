import { AccountId } from '@domain/value-objects/accountId.vo';
import { UsedTokenHistory } from '../../value-objects/usedTokenHistory.vo';

export interface BaseRefreshToken {
  accountId: AccountId;
  token: string;
  expiresAt: number;
}

export interface RefreshTokenWithTokenUsed extends BaseRefreshToken {
  tokensUsed: UsedTokenHistory;
}

export type PureRefreshToken = Omit<
  BaseRefreshToken,
  'expiresAt' | 'accountId'
> & {
  id: string;
  accountId: string;
  tokensUsed: string[];
  expiresAt: Date;
};
