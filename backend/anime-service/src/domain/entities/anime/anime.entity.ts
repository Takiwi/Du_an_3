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
import { ReleaseSchedule } from '@domain/value-objects/releaseSchedule.vo';

export class Anime {
  private readonly _id: AnimeId;
  private _title: string;
  private _author: string[];
  private _studio: string[];
  private _releaseSchedule: ReleaseSchedule;
  private _categories: CategoryId[];
  private _status: Status;
  private _type: Types;
  private _views: number;
  private _rating: number;
  private _isPublished: boolean;

  private constructor(
    id: AnimeId,
    title: string,
    author: string[],
    studio: string[],
    releaseSchedule: ReleaseSchedule,
    categories: CategoryId[],
    status: Status,
    type: Types,
    views: number,
    rating: number,
    isPublished: boolean,
  ) {
    this._id = id;
    this._title = title.toLowerCase();
    this._author = author;
    this._studio = studio;
    this._releaseSchedule = releaseSchedule;
    this._categories = categories;
    this._status = status;
    this._type = type;
    this._views = views;
    this._rating = rating;
    this._isPublished = isPublished;
  }

  static create(props: FullAnime): Result<Anime, AppError> {
    const id = AnimeId.createId();

    const combined = Result.combine([
      ReleaseSchedule.create(props.season, props.releaseDate),
      Result.combine(props.categories.map((cate) => CategoryId.create(cate))),
    ]);

    if (combined.isErr()) {
      return err(combined.error[0]);
    }

    const [releaseSchedule, categoryIds] = combined.value;

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
        props.author,
        props.studio,
        releaseSchedule,
        categoryIds,
        props.status as Status,
        props.type as Types,
        props.views,
        props.rating,
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

    const releaseSchedule = ReleaseSchedule.reconstitute(props.season, null);

    return ok(
      new Anime(
        id,
        props.title,
        props.author,
        props.studio,
        releaseSchedule,
        defaultCategories,
        defaultStatus,
        defaultTypes,
        defaultView,
        defaultRating,
        defaultIsPublic,
      ),
    );
  }

  static reconstitute(props: PureAnime) {
    const id = AnimeId.reconstitute(props.id);
    const categoryIds = props.categories.map((cate) =>
      CategoryId.reconstitute(cate),
    );
    const releaseSchedule = ReleaseSchedule.reconstitute(
      props.season,
      props.releaseDate,
    );

    return new Anime(
      id,
      props.title,
      props.author,
      props.studio,
      releaseSchedule,
      categoryIds,
      props.status as Status,
      props.type as Types,
      props.views,
      props.rating,
      props.isPublished,
    );
  }

  getId() {
    return this._id;
  }

  getTitle() {
    return this._title;
  }

  getAuthor() {
    return this._author;
  }

  getStudio() {
    return this._studio;
  }

  getReleaseSchedule() {
    return this._releaseSchedule;
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

  getCategories() {
    return this._categories;
  }

  getIsPublic() {
    return this._isPublished;
  }
}
