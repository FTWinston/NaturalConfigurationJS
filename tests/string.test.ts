import { ConfigurationParser } from '../src/ConfigurationParser';

interface IString {
  value: string;
}

const parser = new ConfigurationParser<IString>([
  {
    type: 'standard',
    expressionText: 'Replace "(.*)" with "(.*)"',
    parseMatch: (match, action, error) => {
      if (match[1].length === 0) {
        error({
          startIndex: 8,
          length: 2,
          message: 'Match text cannot be empty.'
        });

        return;
      }

      const before = new RegExp(match[1], 'g');
      const after = match[2];

      action(modify => modify.value = modify.value.replace(before, after));
    },
    examples: [
      'Replace "x" with "y"',
      'Replace "something" with ""'
    ]
  },
  {
    type: 'standard',
    expressionText: 'Convert to (.+) case',
    parseMatch: (match, action, error) => {
      if (match[1] === 'upper') {
        action(modify => modify.value = modify.value.toUpperCase());
      }
      else if (match[1] === 'lower') {
        action(modify => modify.value = modify.value.toLowerCase());
      }
      else {
        error({
          startIndex: 11,
          length: match[1].length,
          message: `Unexpected case value: ${match[1]}`
        });
      }
    },
    examples: [
      'Convert to upper case',
      'Convert to lower case'
    ]
  },
  {
    type: 'list',
    expressionPrefix: 'Remove these words: ',
    parseMatch: (match, action, error) => {
      action(modify => {
        for (const word of match.slice(1)) {
          modify.value = modify.value.replace(word, '');
        }
      });
    },
    examples: [
      'Remove these words: fish, chips',
      'Remove these words: red, white and blue'
    ]
  }
]);

test('Fully modifies hello world', () => {
  const input = { value: 'Hello world' };
  const errors = parser.configure('Replace "o" with "ó". Convert to upper case.', input);

  expect(errors).toHaveLength(0);
  expect(input.value).toEqual('HELLÓ WÓRLD');
});

test('Partly modifies hello world', () => {
  const input = { value: 'Hello world' };
  const errors = parser.configure('Convert to upper case. Replace "o" with "ó".', input);

  expect(errors).toHaveLength(0);
  expect(input.value).toEqual('HELLO WORLD');
});

test('Removes words from list', () => {
  const input = { value: 'red orange yellow green blue black white brown purple' };
  const errors = parser.configure('Remove these words: red, green and blue.', input);
  
  expect(errors).toHaveLength(0);
  expect(input.value).toEqual(' orange yellow   black white brown purple');
});

test('Validates successfully', () => {
  const errors = parser.validate('Replace "o" with "ó". Convert to upper case.');
  
  expect(errors).toHaveLength(0);
});

test('Reports error for unrecognised sentence', () => {
  const errors = parser.validate('This sentence matches no parser.');
    
  expect(errors).toHaveLength(1);

  const error = errors[0];

  expect(error.startIndex).toBe(0);
  expect(error.length).toBe(31);
  expect(error.message).toBe("Sentence doesn't match any known rules.");
});

test('Identifies error in single sentence', () => {
  const errors = parser.validate('Convert to nonsense case.');
      
  expect(errors).toHaveLength(1);
    
  const error = errors[0];

  expect(error.startIndex).toBe(11);
  expect(error.length).toBe(8);
  expect(error.message).toBe("Unexpected case value: nonsense");
});

test('Reports error for unfinished sentence', () => {
  const errors = parser.validate('Convert to upper case. Convert to lower case');
      
  expect(errors).toHaveLength(1);
    
  const error = errors[0];

  expect(error.startIndex).toBe(43);
  expect(error.length).toBe(1);
  expect(error.message).toBe("The last sentence is unfinished.");
});

test('Doesn\'t report error for trailing whitespace', () => {
  const errors = parser.validate('Convert to upper case. ');
  
  expect(errors).toHaveLength(0);
});

test('Identifies error in second sentence', () => {
  const errors = parser.validate('Replace "o" with "ó". Convert to nonsense case.');
      
  expect(errors).toHaveLength(1);
    
  const error = errors[0];

  expect(error.startIndex).toBe(33);
  expect(error.length).toBe(8);
  expect(error.message).toBe("Unexpected case value: nonsense");
});

test('Identifies errors in two sentences', () => {
  const errors = parser.validate('Replace "" with "ó". Convert to nonsense case.');
      
  expect(errors).toHaveLength(2);
    
  let error = errors[0];
  expect(error.startIndex).toBe(8);
  expect(error.length).toBe(2);
  expect(error.message).toBe("Match text cannot be empty.");

  error = errors[1];
  expect(error.startIndex).toBe(32);
  expect(error.length).toBe(8);
  expect(error.message).toBe("Unexpected case value: nonsense");
});

test('Identifies errors in three sentences', () => {
  const errors = parser.validate('Convert to invalid case. Convert to upper case. Convert to nonsense case.');
      
  expect(errors).toHaveLength(2);
    
  let error = errors[0];
  expect(error.startIndex).toBe(11);
  expect(error.length).toBe(7);
  expect(error.message).toBe("Unexpected case value: invalid");

  error = errors[1];
  expect(error.startIndex).toBe(59);
  expect(error.length).toBe(8);
  expect(error.message).toBe("Unexpected case value: nonsense");
});

test('Examples match expectations', () => {
  expect(parser.examples).toHaveLength(6);

  expect(parser.examples).toEqual([
    'Replace "x" with "y"',
    'Replace "something" with ""',
    'Convert to upper case',
    'Convert to lower case',
    'Remove these words: fish, chips',
    'Remove these words: red, white and blue'
  ]);
});