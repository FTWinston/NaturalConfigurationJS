import { IParserError } from './IParserError';

export interface ISentenceParser<TConfiguring> {
    name: string;
    expressionText: string;
    parseMatch: (configuring: TConfiguring, match: RegExpExecArray) => IParserError[];
    examples?: string[];
    group?: string;
}

export class SentenceParser<TConfiguring> {
  public readonly name: string;
  public readonly group?: string;
  public readonly examples?: string[];
  public readonly expression: RegExp;
  private readonly parseMatch: (configuring: TConfiguring, match: RegExpExecArray) => IParserError[];

  constructor(data: ISentenceParser<TConfiguring>) {
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
