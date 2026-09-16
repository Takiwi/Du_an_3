export type Status = 'COMING_SOON' | 'CURRENT_SHOWING' | 'COMPLETED';
export type Types = 'TV_SHOW' | 'MOVIE' | 'OVE' | 'SPECIAL';
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export interface BaseAnime {
  title: string;
  season: string;
  releaseDate: Date | null;
}
export interface FullAnime extends BaseAnime {
  status: string;
  categories: string[];
  type: string;
  views: number;
  rating: number;
  isPublished: boolean;
}

export interface PureAnime extends FullAnime {
  id: string;
}
