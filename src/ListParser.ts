import { IParserError } from './IParserError';
import { SentenceParser } from './SentenceParser';

export interface IListParser<TConfiguring> {
    name: string;
    expressionPrefix: string,
    elementExpression?: string,
    expressionSuffix?: string,
    parseListMatch: (configuring: TConfiguring, match: RegExpExecArray, values: string[]) => IParserError[];
    examples?: string[];
    group?: string;
    listGroupOffset?: number;
}

export class ListParser<TConfiguring> extends SentenceParser<TConfiguring> {
  private parseListMatch: (configuring: TConfiguring, match: RegExpExecArray, values: string[]) => IParserError[];
  private listGroupOffset = 0;
 
  // TODO: this is far too many parameters
  constructor(data: IListParser<TConfiguring>) {
    super({
        name: data.name,
        expressionText: ListParser.createListExpression(data.expressionPrefix, data.expressionSuffix, data.elementExpression),
        examples: data.examples,
        group: data.group,
        parseMatch: (c, m) => this.doParseMatch(c, m),
    });

    this.listGroupOffset = data.listGroupOffset === undefined
        ? 0
        : data.listGroupOffset;

    this.parseListMatch = data.parseListMatch;
  }

  public doParseMatch(configuring: TConfiguring, match: RegExpExecArray): IParserError[] {
    const values = match.slice(1 + this.listGroupOffset);
    return this.parseListMatch(configuring, match, values);
  }

  private static createListExpression(prefix: string, suffix?: string, element?: string) {
    if (suffix === undefined) {
      suffix = '';
    }

    if (element === undefined) {
      element = '[^,\\s]+';
    }

    return `${prefix}(${element})(?:, (${element}))*(?: and (${element}))?${suffix}`;
  }
}
