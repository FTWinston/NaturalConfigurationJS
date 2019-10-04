import { IParserError } from './IParserError';

export interface ISentenceParserBase<TConfiguring> {
  expressionText: string;
  parseMatch: (configuring: TConfiguring, match: RegExpExecArray) => IParserError[];
}

export interface ISentenceParser<TConfiguring> extends ISentenceParserBase<TConfiguring> {
  type: 'standard';
  examples: string[];
}

export interface IListParserBase<TConfiguring> {
  expressionPrefix: string;
  elementExpression?: string;
  expressionSuffix?: string;
  parseListMatch: (configuring: TConfiguring, match: RegExpExecArray, values: string[]) => IParserError[];
  listGroupOffset?: number;
}

export interface IListParser<TConfiguring> extends IListParserBase<TConfiguring> {
  type: 'list';
  examples: string[];
}
