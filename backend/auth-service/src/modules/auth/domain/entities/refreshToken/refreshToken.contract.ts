import { UsedTokenHistory } from '../../value-objects/usedTokenHistory.vo';

export interface BaseRefreshToken {
  userId: string;
  token: string;
  expiresAt: number;
}

export interface RefreshTokenWithTokenUsed extends BaseRefreshToken {
  tokensUsed: UsedTokenHistory;
}

export type PureRefreshToken = Omit<BaseRefreshToken, 'expiresAt'> & {
  id: string;
  tokensUsed: string[];
  expiresAt: Date;
};
