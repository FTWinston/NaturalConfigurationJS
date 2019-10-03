import { IParserError } from './IParserError';

export interface ISentenceParserBase<TConfiguring> {
  name: string;
  expressionText: string;
  parseMatch: (configuring: TConfiguring, match: RegExpExecArray) => IParserError[];
  examples?: string[];
  group?: string;
}

export interface ISentenceParser<TConfiguring> extends ISentenceParserBase<TConfiguring> {
  type: 'standard';
}

export interface IListParserBase<TConfiguring> {
  name: string;
  expressionPrefix: string;
  elementExpression?: string;
  expressionSuffix?: string;
  parseListMatch: (configuring: TConfiguring, match: RegExpExecArray, values: string[]) => IParserError[];
  examples?: string[];
  group?: string;
  listGroupOffset?: number;
}

export interface IListParser<TConfiguring> extends IListParserBase<TConfiguring> {
  type: 'list';
}
