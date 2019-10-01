import { IParserError } from './IParserError';

export abstract class SentenceParser<TConfiguring> {
    constructor(expressionText: string) {
        this.expression = new RegExp(`^${expressionText}$`, 'is');
    }
 
    public abstract name: string;
    public readonly group?: string;
    public readonly abstract examples: string[];

    //protected abstract expressionText: string;
    public readonly expression: RegExp;

    public parse(configuring: TConfiguring, sentence: string) {
        const match = this.expression.exec(sentence);
        if (match === null) {
            return [];
        }
        
        return this.parseMatch(configuring, match);
    }

    protected abstract parseMatch(configuring: TConfiguring, match: RegExpExecArray): IParserError[];
}