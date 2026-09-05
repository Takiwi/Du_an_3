export interface BaseUserProfile {
  id: string;
  username: string;
  email: string;
  status?: string;
  role?: string;
  lastUsernameChangedAt?: Date | null;
}

export interface PureUserProfile {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  lastUsernameChangedAt: Date | null;
}
