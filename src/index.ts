import { IParserError } from './IParserError';
import { ISentenceData } from './ISentenceData';
import { IListParser, ISentenceParser } from './ISentenceParser';

export { ConfigurationParser } from './ConfigurationParser';
export { createError } from './IParserError';

export type ISentenceParser<TConfiguring> = ISentenceParser<TConfiguring>;
export type IListParser<TConfiguring> = IListParser<TConfiguring>;
export type ISentenceData = ISentenceData;
export type IParserError = IParserError;
