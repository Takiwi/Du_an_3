import { ValueObject } from '@packages/pattern';

export class UsedTokenHistory extends ValueObject<{
  tokens: ReadonlySet<string>;
}> {
  static readonly MAXIMUM_TOKEN = 10;

  static empty() {
    return new UsedTokenHistory({ tokens: new Set() });
  }

  static fromArray(tokens: string[]) {
    return new UsedTokenHistory({ tokens: new Set(tokens) });
  }

  contains(token: string): boolean {
    return this.props.tokens.has(token);
  }

  markUsed(token: string): UsedTokenHistory {
    const newHistory = [...this.props.tokens, token];

    const finalHistory =
      newHistory.length > UsedTokenHistory.MAXIMUM_TOKEN
        ? newHistory.slice(-UsedTokenHistory.MAXIMUM_TOKEN)
        : newHistory;

    return new UsedTokenHistory({
      tokens: new Set(finalHistory),
    });
  }

  toArray(): string[] {
    return [...this.props.tokens];
  }
}
