import { ISentenceData } from './ISentenceData';
import { IParserError, createError } from './IParserError';
import { SentenceParser } from './SentenceParser';

export abstract class ConfigurationParser<TConfiguring> {
    public parse(configuring: TConfiguring, configurationText: string): IParserError[]
    {
        const errors: IParserError[] = [];

        const sentences = this.splitSentences(configurationText);

        for (const sentence of sentences) {
            var sentenceErrors = this.parseSentence(configuring, sentence.text);
            if (sentenceErrors === null)
                continue;
                
            for (const error of sentenceErrors) {
                error.startIndex += sentence.startIndex;
                if (error.length == -1)
                {
                    error.length = sentence.length;
                }

                errors.push(error);
            }
        }

        return errors;
    }

    private splitSentences(configurationText: string): ISentenceData[] {
        let startPos = -1;
        let endPos = -1;

        const sentences: ISentenceData[] = [];
        
        while (true)
        {
            startPos = endPos + 1;
            endPos = configurationText.indexOf('.', startPos);

            if (endPos == -1)
                break;

            let text = configurationText.substring(startPos, endPos);

            const numTrimStart = text.TakeWhile(c => char.IsWhiteSpace(c)).Count();
            text = text.substr(numTrimStart);

            if (text.length == 0)
            {
                continue;
            }

            startPos += numTrimStart;

            const numTrimEnd = text.Reverse().TakeWhile(c => char.IsWhiteSpace(c)).Count();
            text = text.substr(0, text.length - numTrimEnd);

            sentences.push({
                text,
                startIndex: startPos,
                length: endPos - startPos,
            });
        }

        return sentences;
    }

    private sentenceParsers = this.createSentenceParsers();

    private parseSentence(configuring: TConfiguring, sentence: string): IParserError[]
    {
        for (const parser of this.sentenceParsers) {
            const errors = parser.parse(configuring, sentence);
            if (errors.length !== 0) {
                return errors;
            }
        }

        return [
            createError("Sentence doesn't match any known rules.")
        ];
    }

    protected abstract createSentenceParsers(): Array<SentenceParser<TConfiguring>>;
}