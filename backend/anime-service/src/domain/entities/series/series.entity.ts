import { AnimeId } from '@domain/value-objects/animeId.vo';
import { SeriesId } from '@domain/value-objects/seriesId.vo';
import { AppError } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export interface FullSeries {
  id: string;
  title: string;
  anime: string[];
}

export class Series {
  private readonly _id: SeriesId;
  private _title: string;
  private _anime: AnimeId[];

  private constructor(id: SeriesId, title: string, anime: AnimeId[]) {
    this._id = id;
    this._title = title;
    this._anime = anime;
  }

  static create(
    title: string,
    anime: string[],
    id?: string,
  ): Result<Series, AppError> {
    const animeIds = Result.combine(anime.map((ani) => AnimeId.create(ani)));

    if (animeIds.isErr()) {
      return err(animeIds.error[0]);
    }

    if (id) {
      const seriesId = SeriesId.create(id);

      if (seriesId.isErr()) return err(seriesId.error);

      return ok(new Series(seriesId.value, title, animeIds.value));
    }

    const seriesId = SeriesId.createId();

    return ok(new Series(seriesId, title, animeIds.value));
  }

  static reconstitute(props: FullSeries) {
    const animeId = AnimeId.reconstitute(props.id);
    const animeIds = props.anime.map((ani) => AnimeId.reconstitute(ani));

    return new Series(animeId, props.title, animeIds);
  }

  getId() {
    return this._id;
  }

  getTitle() {
    return this._title;
  }

  getAnime() {
    return this._anime;
  }
}
