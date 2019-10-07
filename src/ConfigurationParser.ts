import { createError, IParserError } from './IParserError';
import { ISentenceData } from './ISentenceData';
import { IListParser, ISentenceParser } from './ISentenceParser';
import { ListParser } from './ListParser';
import { SentenceParser } from './SentenceParser';

export class ConfigurationParser<TConfiguring> {
  public readonly examples: string[];
  private sentenceParsers: Array<SentenceParser<TConfiguring>>;

  constructor(public readonly parsers: Array<ISentenceParser<TConfiguring> | IListParser<TConfiguring>>) {
    this.sentenceParsers = parsers.map(parser => {
      if (parser.type === 'standard') {
        return new SentenceParser(parser);
      } else if (parser.type === 'list') {
        return new ListParser(parser);
      } else {
        throw new Error(`Unexpected parser type: ${(parser as any).type}`);
      }
    });

    this.examples = [];
    for (const parser of parsers) {
      this.examples = [...this.examples, ...parser.examples];
    }
  }

  public validate(configurationText: string): IParserError[] {
    const [, errors] = this.parseConfiguration(configurationText);
    return errors;
  }

  public configure(configurationText: string, configuring: TConfiguring): IParserError[] | null {
    const [actions, errors] = this.parseConfiguration(configurationText);

    if (errors.length > 0) {
      return errors;
    }

    for (const action of actions) {
      action(configuring);
    }

    return null;
  }

  private parseConfiguration(configurationText: string): [Array<(modify: TConfiguring) => void>, IParserError[]] {
    const actions: Array<(configuring: TConfiguring) => void> = [];
    const errors: IParserError[] = [];

    const sentences = this.splitSentences(configurationText);

    for (const sentence of sentences) {
      const sentenceErrors = this.parseSentence(actions, sentence.text);
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

    return [actions, errors];
  }

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

  private parseSentence(actions: Array<(configuring: TConfiguring) => void>, sentence: string): IParserError[] {
    for (const parser of this.sentenceParsers) {
      const errors: IParserError[] = [];
      const didMatch = parser.parse(sentence, actions, errors);

      if (didMatch) {
        return errors;
      }
    }

    return [createError("Sentence doesn't match any known rules.")];
  }
}
