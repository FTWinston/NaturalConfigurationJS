import { IParserError } from './IParserError';

export interface ISentenceParserBase<TConfiguring> {
  expressionText: string;
  parseMatch: (
    match: RegExpExecArray,
    action: (action: (modify: TConfiguring) => void) => void,
    error: (error: IParserError) => void,
  ) => void;
}

export interface ISentenceParser<TConfiguring> extends ISentenceParserBase<TConfiguring> {
  type: 'standard';
  examples: string[];
}

export interface IListParserBase<TConfiguring> {
  expressionPrefix: string;
  elementExpression?: string;
  expressionSuffix?: string;
  parseListMatch: (
    match: RegExpExecArray,
    values: string[],
    action: (action: (modify: TConfiguring) => void) => void,
    error: (error: IParserError) => void,
  ) => IParserError[];
  listGroupOffset?: number;
}

export interface IListParser<TConfiguring> extends IListParserBase<TConfiguring> {
  type: 'list';
  examples: string[];
}
