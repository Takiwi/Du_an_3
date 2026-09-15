export interface CreateAnimeInput {
  title: string;
  season: string;
  status: string;
  type: string;
  views: number;
  rating: number;
  categories: string[];
  releaseDate: Date | null;
  isPublished: boolean;
  seriesId: string;
}
