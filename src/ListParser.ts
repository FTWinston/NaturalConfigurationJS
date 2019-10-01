import { SentenceParser } from './SentenceParser';
import { IParserError } from './IParserError';

export abstract class ListParser<TConfiguring> extends SentenceParser<TConfiguring> {
    constructor(expressionPrefix: string, elementExpression: string = '[^,\\s]+', expressionSuffix: string = '') {
        super(`${expressionPrefix}(${elementExpression})(?:, (${elementExpression}))*(?: and (${elementExpression}))?${expressionSuffix}`);
    }
    
    protected listGroupOffset = 0;

    protected parseMatch(configuring: TConfiguring, match: RegExpExecArray): IParserError[] {
        const values = match.slice(1 + this.listGroupOffset);
        return this.parseListMatch(configuring, match, values);
    }

    protected abstract parseListMatch(configuring: TConfiguring, match: RegExpExecArray, listValues: string[]): IParserError[];
}