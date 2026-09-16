import { Anime } from '@domain/entities/anime/anime.entity';

export const MESSAGE_TOKEN = 'IMessage';

export interface IMessage {
  publisher(anime: Anime, version: number);
}
