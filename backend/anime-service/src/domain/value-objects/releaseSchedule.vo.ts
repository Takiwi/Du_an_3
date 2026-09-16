import { AppError, ValueObject } from '@packages/pattern';
import { err, ok, Result } from 'neverthrow';

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export class ReleaseSchedule extends ValueObject<{
  season: Season;
  releaseDate: Date | null;
}> {
  private static readonly SEASON_MONTH_RANGE: Record<Season, [number, number]> =
    {
      Winter: [0, 2], // Jan - Mar
      Spring: [3, 5], // Apr - Jun
      Summer: [6, 8], // Jul - Sep
      Fall: [9, 11], // Oct - Dec
    };

  private constructor(season: Season, releaseDate: Date | null) {
    super({ season, releaseDate });
  }

  private static isDateInSeason(season: Season, date: Date): boolean {
    const [startMonth, endMonth] = this.SEASON_MONTH_RANGE[season];
    const year = date.getFullYear();
    const start = new Date(year, startMonth, 1);
    const end = new Date(year, endMonth + 1, 0);

    return date >= start && date <= end;
  }

  static create(
    season: string,
    releaseDate: Date | null,
  ): Result<ReleaseSchedule, AppError> {
    if (!(season in this.SEASON_MONTH_RANGE)) {
      return err(new AppError('INVALID_SEASON', `Season ${season} is invalid`));
    }

    if (!releaseDate) {
      return ok(new ReleaseSchedule(season as Season, releaseDate));
    }

    if (!this.isDateInSeason(season as Season, releaseDate)) {
      return err(
        new AppError(
          'INVALID_RELEASE_DATE',
          `Release date (${releaseDate.toISOString()}) does not match season ${season}`,
        ),
      );
    }

    return ok(new ReleaseSchedule(season as Season, releaseDate));
  }

  static reconstitute(season: string, releaseDate: Date | null) {
    return new ReleaseSchedule(season as Season, releaseDate);
  }

  getSeason() {
    return this.props.season;
  }

  getReleaseDate() {
    return this.props.releaseDate;
  }
}
