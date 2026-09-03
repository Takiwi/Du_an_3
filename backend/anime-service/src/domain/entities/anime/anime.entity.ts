import { AnimeId } from '@auth/domain/value-objects/animeId.vo';
import { STATUS, TYPE } from '@generated/prisma/enums';
import { randomUUID } from 'crypto';
import { BaseAnime, FullAnime } from './anime.contract';
import { ok, Result, err } from 'neverthrow';
import { AppError } from '@packages/pattern';

export class Anime {
  private _id: AnimeId;
  private _title: string;
  private _season: string;
  private _status: STATUS;
  private _type: TYPE;
  private _views: number;
  private _rating: number;

  private constructor(
    id: AnimeId,
    title: string,
    season: string,
    status: STATUS,
    type: TYPE,
    views: number,
    rating: number,
  ) {
    this._id = id;
    this._title = title;
    this._season = season;
    this._status = status;
    this._type = type;
    this._views = views;
    this._rating = rating;
  }

  static create(props: BaseAnime): Result<Anime, AppError> {
    const defaultType = 'MOVIE';
    const defaultStatus = 'COMPLETED';
    const defaultView = 0;
    const defaultRating = 0;

    const id = AnimeId.create(randomUUID());

    if (id.isErr()) return err(id.error);

    return ok(
      new Anime(
        id.value,
        props.title,
        props.season,
        defaultStatus,
        defaultType,
        defaultView,
        defaultRating,
      ),
    );
  }

  static reconstitute(props: FullAnime) {
    const id = AnimeId.reconstitute(props.id);

    return new Anime(
      id,
      props.title,
      props.season,
      props.status,
      props.type,
      props.view,
      props.rating,
    );
  }

  getId() {
    return this._id;
  }
  getTitle() {
    return this._title;
  }
  getSeason() {
    return this._season;
  }
  getStatus() {
    return this._status;
  }
  getType() {
    return this._type;
  }
  getViews() {
    return this._views;
  }
  getRating() {
    return this._rating;
  }
}
