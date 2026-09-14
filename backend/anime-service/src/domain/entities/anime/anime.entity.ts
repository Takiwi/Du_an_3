import { BaseAnime, FullAnime, Status, Types } from './anime.contract';
import { ok, Result } from 'neverthrow';
import { AppError } from '@packages/pattern';
import { AnimeId } from '@domain/value-objects/animeId.vo';

export class Anime {
  private _id: AnimeId;
  private _title: string;
  private _season: string;
  private _categories: string[];
  private _status: Status;
  private _types: Types;
  private _views: number;
  private _rating: number;

  private constructor(
    id: AnimeId,
    title: string,
    season: string,
    categories: string[],
    status: Status,
    types: Types,
    views: number,
    rating: number,
  ) {
    this._id = id;
    this._title = title;
    this._season = season;
    this._categories = categories;
    this._status = status;
    this._types = types;
    this._views = views;
    this._rating = rating;
  }

  static create(props: BaseAnime): Result<Anime, AppError> {
    const defaultTypes = 'MOVIE';
    const defaultStatus = 'COMPLETED';
    const defaultView = 0;
    const defaultRating = 0;
    const defaultCategories = [];

    const id = AnimeId.createId();

    return ok(
      new Anime(
        id,
        props.title,
        props.season,
        defaultCategories,
        defaultStatus,
        defaultTypes,
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
      props.categories,
      props.status,
      props.types,
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

  getTypes() {
    return this._types;
  }

  getViews() {
    return this._views;
  }

  getRating() {
    return this._rating;
  }

  getCategories() {
    return this._categories;
  }
}
