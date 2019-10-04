import { IParserError } from './IParserError';
import { ISentenceParserBase } from './ISentenceParser';

export class SentenceParser<TConfiguring> {
  public readonly expression: RegExp;
  private readonly parseMatch: (configuring: TConfiguring, match: RegExpExecArray) => IParserError[];

  constructor(data: ISentenceParserBase<TConfiguring>) {
    this.expression = new RegExp(`^${data.expressionText}$`, 'is');
    this.parseMatch = data.parseMatch;
  }

  public parse(configuring: TConfiguring, sentence: string) {
    const match = this.expression.exec(sentence);
    if (match === null) {
      return null;
    }

    return this.parseMatch(configuring, match);
  }
}
