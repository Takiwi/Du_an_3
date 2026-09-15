import {
  BaseAnime,
  FullAnime,
  PureAnime,
  Status,
  Types,
} from './anime.contract';
import { err, ok, Result } from 'neverthrow';
import { AppError } from '@packages/pattern';
import { AnimeId } from '@domain/value-objects/animeId.vo';
import { CategoryId } from '@domain/value-objects/categoryId.vo';

export class Anime {
  private _id: AnimeId;
  private _title: string;
  private _season: string;
  private _categories: CategoryId[];
  private _status: Status;
  private _type: Types;
  private _views: number;
  private _rating: number;
  private _releaseDate: Date | null;
  private _isPublished: boolean;

  private constructor(
    id: AnimeId,
    title: string,
    season: string,
    categories: CategoryId[],
    status: Status,
    type: Types,
    views: number,
    rating: number,
    releaseDate: Date | null,
    isPublished: boolean,
  ) {
    this._id = id;
    this._title = title;
    this._season = season;
    this._categories = categories;
    this._status = status;
    this._type = type;
    this._views = views;
    this._rating = rating;
    this._releaseDate = releaseDate;
    this._isPublished = isPublished;
  }

  static create(props: FullAnime): Result<Anime, AppError> {
    const id = AnimeId.createId();
    const categoryIds = props.categories.map((cate) =>
      CategoryId.reconstitute(cate),
    );

    if (
      !['COMING_SOON', 'CURRENT_SHOWING', 'COMPLETED'].includes(props.status)
    ) {
      return err(
        new AppError('INVALID_STATUS', `Invalid status ${props.status}`),
      );
    }

    if (!['TV_SHOW', 'MOVIE', 'OVE', 'SPECIAL'].includes(props.type)) {
      return err(new AppError('INVALID_TYPE', `Invalid type ${props.type}`));
    }

    return ok(
      new Anime(
        id,
        props.title,
        props.season,
        categoryIds,
        props.status as Status,
        props.type as Types,
        props.views,
        props.rating,
        props.releaseDate,
        props.isPublished,
      ),
    );
  }

  static defaultAnime(props: BaseAnime) {
    const defaultTypes = 'MOVIE';
    const defaultStatus = 'COMPLETED';
    const defaultView = 0;
    const defaultRating = 0;
    const defaultCategories = [];
    const defaultIsPublic = false;

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
        props.releaseDate,
        defaultIsPublic,
      ),
    );
  }

  static reconstitute(props: PureAnime) {
    const id = AnimeId.reconstitute(props.id);
    const categoryIds = props.categories.map((cate) =>
      CategoryId.reconstitute(cate),
    );

    return new Anime(
      id,
      props.title,
      props.season,
      categoryIds,
      props.status as Status,
      props.type as Types,
      props.views,
      props.rating,
      props.releaseDate,
      props.isPublished,
    );
  }

  isEquals(title: string, releaseDate: Date) {
    if (this._title === title && this._releaseDate === releaseDate) return true;

    return false;
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
    return this._type;
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

  getReleaseDate() {
    return this._releaseDate;
  }

  getIsPublic() {
    return this._isPublished;
  }
}
