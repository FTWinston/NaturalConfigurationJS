import { createError, IParserError } from './IParserError';
import { ISentenceData } from './ISentenceData';
import { IListParser, ISentenceParser } from './ISentenceParser';
import { ListParser } from './ListParser';
import { SentenceParser } from './SentenceParser';

export class ConfigurationParser<TConfiguring, TOptions = {}> {
  public readonly examples: string[];
  private sentenceParsers: Array<SentenceParser<TConfiguring, TOptions>>;

  constructor(
    public readonly parsers: Array<ISentenceParser<TConfiguring, TOptions> | IListParser<TConfiguring, TOptions>>,
  ) {
    this.sentenceParsers = parsers.map(parser => {
      if (parser.type === 'standard') {
        return new SentenceParser<TConfiguring, TOptions>(parser);
      } else if (parser.type === 'list') {
        return new ListParser<TConfiguring, TOptions>(parser);
      } else {
        throw new Error(`Unexpected parser type: ${(parser as any).type}`);
      }
    });

    this.examples = [];
    for (const parser of parsers) {
      this.examples = [...this.examples, ...parser.examples];
    }
  }

  public validate(configurationText: string, options?: TOptions) {
    const [, errors] = this.parseConfiguration(configurationText, options);
    return errors;
  }

  public configure(configurationText: string, configuring: TConfiguring, options?: TOptions) {
    const [actions, errors] = this.parseConfiguration(configurationText, options);

    if (errors.length > 0) {
      return errors;
    }

    for (const action of actions) {
      action(configuring);
    }

    return errors;
  }

  private parseConfiguration(
    configurationText: string,
    options?: TOptions,
  ): [Array<(modify: TConfiguring) => void>, IParserError[]] {
    const actions: Array<(configuring: TConfiguring) => void> = [];
    const errors: IParserError[] = [];

    const [sentences, hasUnfinishedSentence] = this.splitSentences(configurationText);

    for (const sentence of sentences) {
      const sentenceErrors = this.parseSentence(actions, sentence.text, options);
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

    if (hasUnfinishedSentence) {
      errors.push({
        length: 1,
        startIndex: configurationText.length - 1,
        message: 'The last sentence is unfinished.',
      });
    }

    return [actions, errors];
  }

  private splitSentences(configurationText: string): [ISentenceData[], boolean] {
    let startPos = -1;
    let endPos = -1;

    const sentences: ISentenceData[] = [];

    while (true) {
      startPos = endPos + 1;
      endPos = configurationText.indexOf('.', startPos);

      if (endPos === -1) {
        return [sentences, startPos < configurationText.length];
      }

      let text = configurationText.substring(startPos, endPos);

      const origLength = text.length;
      text = text.trimStart();

      if (text.length === 0) {
        continue;
      }

      startPos += origLength - text.length;

      text = text.trimEnd();

      sentences.push({
        length: endPos - startPos,
        startIndex: startPos,
        text,
      });
    }
  }

  private parseSentence(
    actions: Array<(configuring: TConfiguring) => void>,
    sentence: string,
    options?: TOptions,
  ): IParserError[] {
    for (const parser of this.sentenceParsers) {
      const errors: IParserError[] = [];
      const didMatch = parser.parse(sentence, actions, errors, options);

      if (didMatch) {
        return errors;
      }
    }

    return [createError("Sentence doesn't match any known rules.")];
  }
}
