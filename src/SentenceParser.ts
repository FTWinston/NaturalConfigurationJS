import { IParserError } from './IParserError';

export abstract class SentenceParser<TConfiguring> {
  public abstract name: string;
  public readonly group?: string;
  public abstract readonly examples: string[];

  // protected abstract expressionText: string;
  public readonly expression: RegExp;

  constructor(expressionText: string) {
    this.expression = new RegExp(`^${expressionText}$`, 'is');
  }

  public parse(configuring: TConfiguring, sentence: string) {
    const match = this.expression.exec(sentence);
    if (match === null) {
      return [];
    }

    return this.parseMatch(configuring, match);
  }

  protected abstract parseMatch(configuring: TConfiguring, match: RegExpExecArray): IParserError[];
}
