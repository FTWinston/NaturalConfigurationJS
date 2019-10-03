import { IParserError } from './IParserError';
import { ISentenceParserBase } from './ISentenceParser';

export class SentenceParser<TConfiguring> {
  public readonly name: string;
  public readonly group?: string;
  public readonly examples?: string[];
  public readonly expression: RegExp;
  private readonly parseMatch: (configuring: TConfiguring, match: RegExpExecArray) => IParserError[];

  constructor(data: ISentenceParserBase<TConfiguring>) {
    this.name = data.name;
    this.group = data.group;
    this.examples = data.examples;
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
