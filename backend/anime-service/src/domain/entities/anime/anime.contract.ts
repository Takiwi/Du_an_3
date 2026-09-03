import { STATUS, TYPE } from '@generated/prisma/enums';

export interface BaseAnime {
  title: string;
  season: string;
}

export interface FullAnime extends BaseAnime {
  id: string;
  status: STATUS;
  type: TYPE;
  view: number;
  rating: number;
}
