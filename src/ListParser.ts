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

  private parseListMatch: (
    match: RegExpExecArray,
    values: string[],
    action: (action: (modify: TConfiguring) => void) => void,
    error: (error: IParserError) => void,
  ) => void;
  private listGroupOffset = 0;

  constructor(data: IListParserBase<TConfiguring>) {
    super({
      expressionText: ListParser.createListExpression(
        data.expressionPrefix,
        data.expressionSuffix,
        data.elementExpression,
      ),
      parseMatch: (match, action, error) => this.doParseMatch(match, action, error),
    });

    this.listGroupOffset = data.listGroupOffset === undefined ? 0 : data.listGroupOffset;

    this.parseListMatch = data.parseListMatch;
  }

  public doParseMatch(
    match: RegExpExecArray,
    action: (action: (modify: TConfiguring) => void) => void,
    error: (error: IParserError) => void,
  ) {
    const values = match.slice(1 + this.listGroupOffset);
    this.parseListMatch(match, values, action, error);
  }
}
