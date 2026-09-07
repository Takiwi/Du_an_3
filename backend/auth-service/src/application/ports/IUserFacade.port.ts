export const USER_FACADE_TOKEN = 'IUserFacade';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  status: string;
}

export interface IUserFacade {
  createUserProfile(username: string, email: string): Promise<UserProfile>;
}
