import { IParserError } from './IParserError';

export class SentenceParser<TConfiguring> {
  public readonly expression: RegExp;

  // TODO: this is too many damn parameters
  constructor(
    public readonly name: string,
    expressionText: string,
    public readonly parseMatch: (configuring: TConfiguring, match: RegExpExecArray) => IParserError[],
    public readonly examples?: string[],
    public readonly group?: string
  ) {
    this.expression = new RegExp(`^${expressionText}$`, 'is');
  }

  public parse(configuring: TConfiguring, sentence: string) {
    const match = this.expression.exec(sentence);
    if (match === null) {
      return null;
    }

    return this.parseMatch(configuring, match);
  }
}
