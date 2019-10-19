import { IListParserBase } from './ISentenceParser';
import { SentenceParser } from './SentenceParser';

export class ListParser<TConfiguring, TOptions = {}> extends SentenceParser<TConfiguring, TOptions> {
  private static createListExpression(prefix: string, suffix?: string, element?: string) {
    if (suffix === undefined) {
      suffix = '';
    }

    if (element === undefined) {
      element = '[^,\\s]+';
    }

    return `${prefix}(${element})(?:, (${element}))*(?: and (${element}))?${suffix}`;
  }

  constructor(data: IListParserBase<TConfiguring, TOptions>) {
    super({
      expressionText: ListParser.createListExpression(
        data.expressionPrefix,
        data.expressionSuffix,
        data.elementExpression,
      ),
      parseMatch: data.parseMatch,
    });
  }
}
