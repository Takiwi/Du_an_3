export type Status = 'COMING_SOON' | 'CURRENT_SHOWING' | 'COMPLETED';
export type Types = 'TV_SHOW' | 'MOVIE' | 'OVE' | 'SPECIAL';

export interface BaseAnime {
  title: string;
  season: string;
  author: string[];
  studio: string[];
}
export interface FullAnime extends BaseAnime {
  status: string;
  categories: string[];
  type: string;
  views: number;
  rating: number;
  isPublished: boolean;
  releaseDate: Date | null;
}

export interface PureAnime extends FullAnime {
  id: string;
}
