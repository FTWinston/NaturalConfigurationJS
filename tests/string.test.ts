import { ConfigurationParser } from '../src/ConfigurationParser';

interface IString {
  value: string;
}

const parser = new ConfigurationParser<IString>([
  {
    type: 'standard',
    expressionText: 'Replace \"(.*)\" with \"(.*)\"',
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
      'Conver to lower case'
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

test('Identifies error in second sentence', () => {
  const errors = parser.validate('Replace "o" with "ó". Convert to nonsense case.');
      
  expect(errors).toHaveLength(1);
    
  const error = errors[0];

  expect(error.startIndex).toBe(33);
  expect(error.length).toBe(8);
  expect(error.message).toBe("Unexpected case value: nonsense");
});

test('Identifies multiple errors', () => {
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

test('Examples match expectations', () => {
  expect(parser.examples).toHaveLength(4);

  expect(parser.examples).toEqual([
    'Replace "x" with "y"',
    'Replace "something" with ""',
    'Convert to upper case',
    'Conver to lower case'
  ]);
});