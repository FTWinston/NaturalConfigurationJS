import { createError, IParserError } from './IParserError';
import { ISentenceData } from './ISentenceData';
import { SentenceParser } from './SentenceParser';

export abstract class ConfigurationParser<TConfiguring> {
  private sentenceParsers = this.createSentenceParsers();

  public parse(configuring: TConfiguring, configurationText: string): IParserError[] {
    const errors: IParserError[] = [];

    const sentences = this.splitSentences(configurationText);

    for (const sentence of sentences) {
      const sentenceErrors = this.parseSentence(configuring, sentence.text);
      if (sentenceErrors === null) {
        continue;
      }

      for (const error of sentenceErrors) {
        error.startIndex += sentence.startIndex;
        if (error.length === -1) {
          error.length = sentence.length;
        }

        errors.push(error);
      }
    }

    return errors;
  }

  protected abstract createSentenceParsers(): Array<SentenceParser<TConfiguring>>;
  
  private splitSentences(configurationText: string): ISentenceData[] {
    let startPos = -1;
    let endPos = -1;

    const sentences: ISentenceData[] = [];

    while (true) {
      startPos = endPos + 1;
      endPos = configurationText.indexOf('.', startPos);

      if (endPos === -1) {
        break;
      }

      let text = configurationText.substring(startPos, endPos);

      const origLength = text.length;
      text = text.trimStart();

      if (text.length === 0) {
        continue;
      }

      startPos += text.length - origLength;

      text = text.trimEnd();

      sentences.push({
        length: endPos - startPos,
        startIndex: startPos,
        text,
      });
    }

    return sentences;
  }

  private parseSentence(configuring: TConfiguring, sentence: string): IParserError[] {
    for (const parser of this.sentenceParsers) {
      const errors = parser.parse(configuring, sentence);
      if (errors.length !== 0) {
        return errors;
      }
    }

    return [createError("Sentence doesn't match any known rules.")];
  }
}
