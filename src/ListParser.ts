import { IParserError } from './IParserError';
import { IListParserBase } from './ISentenceParser';
import { SentenceParser } from './SentenceParser';

export class ListParser<TConfiguring> extends SentenceParser<TConfiguring> {
  private static createListExpression(prefix: string, suffix?: string, element?: string) {
    if (suffix === undefined) {
      suffix = '';
    }

    if (element === undefined) {
      element = '[^,\\s]+';
    }

    return `${prefix}(${element})(?:, (${element}))*(?: and (${element}))?${suffix}`;
  }

  private parseListMatch: (configuring: TConfiguring, match: RegExpExecArray, values: string[]) => IParserError[];
  private listGroupOffset = 0;
  
  constructor(data: IListParserBase<TConfiguring>) {
    super({
      examples: data.examples,
      expressionText: ListParser.createListExpression(
        data.expressionPrefix,
        data.expressionSuffix,
        data.elementExpression,
      ),
      group: data.group,
      name: data.name,
      parseMatch: (c, m) => this.doParseMatch(c, m),
    });

    this.listGroupOffset = data.listGroupOffset === undefined ? 0 : data.listGroupOffset;

    this.parseListMatch = data.parseListMatch;
  }

  public doParseMatch(configuring: TConfiguring, match: RegExpExecArray): IParserError[] {
    const values = match.slice(1 + this.listGroupOffset);
    return this.parseListMatch(configuring, match, values);
  }
}
