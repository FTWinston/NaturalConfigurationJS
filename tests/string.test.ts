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

  expect(errors).toBeNull();
  expect(input.value).toEqual('HELLÓ WÓRLD');
});


test('Partly modifies hello world', () => {
  const input = { value: 'Hello world' };
  const errors = parser.configure('Convert to upper case. Replace "o" with "ó".', input);

  expect(errors).toBeNull();
  expect(input.value).toEqual('HELLO WORLD');
});

// TODO: test parsing without configuring an object.

// TODO: test specific error positions.

test('Examples match expectations', () => {
  expect(parser.examples).toHaveLength(4);

  expect(parser.examples).toEqual([
    'Replace "x" with "y"',
    'Replace "something" with ""',
    'Convert to upper case',
    'Conver to lower case'
  ]);
});