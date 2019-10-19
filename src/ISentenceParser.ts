import { IParserError } from './IParserError';

export interface ISentenceParserBase<TConfiguring, TOptions = {}> {
  expressionText: string;
  parseMatch: (
    match: RegExpExecArray,
    action: (action: (modify: TConfiguring) => void) => void,
    error: (error: IParserError) => void,
    options?: TOptions,
  ) => void;
}

export interface ISentenceParser<TConfiguring, TOptions = {}> extends ISentenceParserBase<TConfiguring, TOptions> {
  type: 'standard';
  examples: string[];
}

export interface IListParserBase<TConfiguring, TOptions = {}> {
  expressionPrefix: string;
  elementExpression?: string;
  expressionSuffix?: string;
  parseMatch: (
    match: RegExpExecArray,
    action: (action: (modify: TConfiguring) => void) => void,
    error: (error: IParserError) => void,
    options?: TOptions,
  ) => void;
}

export interface IListParser<TConfiguring, TOptions = {}> extends IListParserBase<TConfiguring, TOptions> {
  type: 'list';
  examples: string[];
}
