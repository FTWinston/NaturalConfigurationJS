import { ConfigurationParser } from '../src/ConfigurationParser';

interface IString {
  value: string;
}

const parser = new ConfigurationParser<IString>([
  {
    type: 'standard',
    expressionText: 'Replace \"(.*)\" with \"(.*)\"',
    parseMatch: (modify, match) => {
      if (match[1].length === 0) {
        return ['Match text cannot be empty.'];
      }

      const before = new RegExp(match[1], 'g');
      const after = match[2];

      modify.value = modify.value.replace(before, after);
      return [];
    },
    examples: [
      'Replace "x" with "y"',
      'Replace "something" with ""'
    ]
  },
  {
    type: 'standard',
    expressionText: 'Convert to (.+) case',
    parseMatch: (modify, match) => {
      if (match[1] === 'upper') {
        modify.value = modify.value.toUpperCase();
      }
      else if (match[1] === 'lower') {
        modify.value = modify.value.toLowerCase();
      }
      else {
        return [`Unexpected case value: ${match[1]}`];
      }

      return [];
    },
    examples: [
      'Convert to upper case',
      'Conver to lower case'
    ]
  }
]);

test('Fully modifies hello world', () => {
  const input = { value: 'Hello world' };
  const errors = parser.parse(input, 'Replace "o" with "ó". Convert to upper case.');

  expect(errors).toHaveLength(0);
  expect(input.value).toEqual('HELLÓ WÓRLD');
});


test('Partly modifies hello world', () => {
  const input = { value: 'Hello world' };
  const errors = parser.parse(input, 'Convert to upper case. Replace "o" with "ó".');

  expect(errors).toHaveLength(0);
  expect(input.value).toEqual('HELLO WORLD');
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