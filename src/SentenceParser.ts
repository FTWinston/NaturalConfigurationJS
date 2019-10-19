import { IParserError } from './IParserError';
import { ISentenceParserBase } from './ISentenceParser';

export class SentenceParser<TConfiguring, TOptions = {}> {
  public readonly expression: RegExp;
  private readonly parseMatch: (
    match: RegExpExecArray,
    action: (action: (modify: TConfiguring) => void) => void,
    error: (error: IParserError) => void,
    options?: TOptions,
  ) => void;

  constructor(data: ISentenceParserBase<TConfiguring, TOptions>) {
    this.expression = new RegExp(`^${data.expressionText}$`, 'is');
    this.parseMatch = data.parseMatch;
  }

  public parse(
    sentence: string,
    actions: Array<(modify: TConfiguring) => void>,
    errors: IParserError[],
    options?: TOptions,
  ) {
    const match = this.expression.exec(sentence);
    if (match === null) {
      return false;
    }

    this.parseMatch(match, action => actions.push(action), error => errors.push(error), options);
    return true;
  }
}
