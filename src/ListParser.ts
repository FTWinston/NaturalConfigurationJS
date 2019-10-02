import { IParserError } from './IParserError';
import { SentenceParser } from './SentenceParser';

export class ListParser<TConfiguring> extends SentenceParser<TConfiguring> {
  protected listGroupOffset = 0;
 
  // TODO: this is far too many parameters
  constructor(
    name: string,
    expressionPrefix: string,
    elementExpression: string = '[^,\\s]+',
    expressionSuffix: string = '',
    public readonly parseListMatch: (configuring: TConfiguring, match: RegExpExecArray, listValues: string[]) => IParserError[],
    examples?: string[],
    group?: string
) {
    super(
      name,
      `${expressionPrefix}(${elementExpression})(?:, (${elementExpression}))*(?: and (${elementExpression}))?${expressionSuffix}`,
      (c, m) => this.doParseMatch(c, m),
      examples,
      group
    );
  }

  public doParseMatch(configuring: TConfiguring, match: RegExpExecArray): IParserError[] {
    const values = match.slice(1 + this.listGroupOffset);
    return this.parseListMatch(configuring, match, values);
  }
}
