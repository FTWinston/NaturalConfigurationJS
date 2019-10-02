import { IParserError } from './IParserError';
import { SentenceParser } from './SentenceParser';

export abstract class ListParser<TConfiguring> extends SentenceParser<TConfiguring> {
  protected listGroupOffset = 0;

  constructor(expressionPrefix: string, elementExpression: string = '[^,\\s]+', expressionSuffix: string = '') {
    super(
      `${expressionPrefix}(${elementExpression})(?:, (${elementExpression}))*(?: and (${elementExpression}))?${expressionSuffix}`,
    );
  }

  protected parseMatch(configuring: TConfiguring, match: RegExpExecArray): IParserError[] {
    const values = match.slice(1 + this.listGroupOffset);
    return this.parseListMatch(configuring, match, values);
  }

  protected abstract parseListMatch(
    configuring: TConfiguring,
    match: RegExpExecArray,
    listValues: string[],
  ): IParserError[];
}
