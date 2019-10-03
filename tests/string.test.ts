import { ConfigurationParser } from '../src/ConfigurationParser';

interface IString {
  value: string;
}

const parser = new ConfigurationParser<IString>([
  {
    type: 'standard',
    name: 'replace',
    expressionText: 'Replace \"(.+)\" with \"(.*)\"',
    parseMatch: (modify, match) => {
      const before = new RegExp(match[1], 'g');
      const after = match[2];
      modify.value = modify.value.replace(before, after);
      return [];
    }
  },
  {
    type: 'standard',
    name: 'case',
    expressionText: 'Convert to (upper|lower) case',
    parseMatch: (modify, match) => {
      if (match[1] === 'upper') {
        modify.value = modify.value.toUpperCase();
      }
      else {
        modify.value = modify.value.toLowerCase();
      }
      return [];
    }
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
