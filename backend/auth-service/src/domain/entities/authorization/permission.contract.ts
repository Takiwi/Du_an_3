export type Action = 'READ' | 'WRITE' | 'APPROVE';
export type Resource = 'USER_DATA' | 'ANIME_DATA' | 'STREAM_DATA';

export interface BasePermission {
  action: string;
  resource: string;
}

export interface PurePermission extends BasePermission {
  id: string;
}
