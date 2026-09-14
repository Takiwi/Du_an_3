export type Status = 'COMING_SOON' | 'CURRENT_SHOWING' | 'COMPLETED';
export type Types = 'TV_SHOW' | 'MOVIE' | 'OVE' | 'SPECIAL';

export interface BaseAnime {
  title: string;
  season: string;
}

export interface FullAnime extends BaseAnime {
  id: string;
  status: Status;
  categories: string[];
  types: Types;
  view: number;
  rating: number;
}
