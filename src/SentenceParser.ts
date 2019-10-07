import { IParserError } from './IParserError';
import { ISentenceParserBase } from './ISentenceParser';

export class SentenceParser<TConfiguring> {
  public readonly expression: RegExp;
  private readonly parseMatch: (
    match: RegExpExecArray,
    action: (action: (modify: TConfiguring) => void) => void,
    error: (error: IParserError) => void,
  ) => void;

  constructor(data: ISentenceParserBase<TConfiguring>) {
    this.expression = new RegExp(`^${data.expressionText}$`, 'is');
    this.parseMatch = data.parseMatch;
  }

  public parse(sentence: string, actions: Array<(modify: TConfiguring) => void>, errors: IParserError[]) {
    const match = this.expression.exec(sentence);
    if (match === null) {
      return false;
    }

    this.parseMatch(match, action => actions.push(action), error => errors.push(error));
    return true;
  }
}
