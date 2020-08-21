# text-manipulation

Have fun playing with string!!!

## Methods

- `Capitalize(input: string, opts?: Options)`: Make the first character of the string to uppercase.
- `UpperCase(input: string, opts?: Options)`: Make the string to uppercase.
- `LowerCase(input: string, opts?: Options)`: Make the string to lowercase.
- `CamelCase(input: string, opts?: Options)`: Make the string to camel-case like (eg `hello world` to `helloWorld`).
- `PascalCase(input: string, opts?: Options)`: Make the string to pascal-case like (eg `hello world` to `HelloWorld`).
- `Join(input: string[], opts?: Options)`: Join an array of string with a string.
- `Split(input: string, opts?: Options)`: Split the string by a splitter.
- `BreakLines(input: string, opts?: Options)`: Split the string by newline characters.
- `Trim(input: string, opts?: Options)`: Trim the string from both ends.
- `TrimStart(input: string, opts?: Options)`: Trim the string from the beginning.
- `TrimEnd(input: string, opts?: Options)`: Trim the string from the end.
- `EscapeRegexp(input: string)`: Escape the special character in string for doing RegExp search (eg `https://www.google.com/` to `https:\/\/www\.google\.com\/`).
- `GetBracket(input: string, opts?: Options)`: Get strings inside a bracket (eg `()`, `{}`, `[]`).
- `Occurance(input: string, opts?: Options)`: Count occurance in string.
- `Remove(input: string, opts?: Options)`: Remove any occurance in string.
- `PadStart(input: string, opts?: Options)`: Pad the string with another string from the beginning.
- `PadEnd(input: string, opts?: Options)`: Pad the string with another string from the end.
- `Base64Encode(input: string, opts?: Options)`: Base64 encode the string.
- `Base64Decode(input: string, opts?: Options)`: Base64 decode the string.
- `Scrapping(input: string, opts?: Options)`: Scrap informations from the string. [README](SCRAPPING.md)
- `GetNumeric(input: string, opts?: Options)`: Get numbers from the string.
- `ArabicToRoman(input: string, opts?: Options)`: Convert Arabic number to Roman number.
- `RomanToArabic(input: string, opts?: Options)`: Convert Roman number to Arabic number.

## Options

Options are used in most of the methods. Below shows all acceptable properties:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `bracket` | `string` | `()（）[]［］{}｛｝<>〈〉《》〔〕【】〖〗` | Brackets to find in string |
| `bracketRemove` | `boolean` | `false` | Remove the brackets in result |
| `connector` | `string` | space | String to join the string array |
| `empty` | `boolean` | `false` | Accept empty string in the result |
| `escapeRegexp` | `boolean` | `false` | Escape RegExp special character in string |
| `locale` | `string | string[] | false` | `false` | Acceptable locale for `toLocaleUpperCase()`/`toLocaleLowerCase()` |
| `number.ceil` | `boolean` | `false` | Round number to next integer |
| `number.floor` | `boolean` | `false` | Round number to previous integer |
| `number.round` | `boolean` | `false` | Round number to integer |
| `number.format` | `string | RegExp` | N/A` | Number format |
| `occurance` | `string | string[]` | N/A | String occurance to count |
| `pad.string` | `string` | empty string | Pad string |
| `pad.end` | `boolean` | `false` | Pad from the end |
| `pad.count` | `number` | N/A | Pad fixed times |
| `pad.length` | `number` | N/A | Fill string until it reaches the length |
| `preserveCase` | `boolean` | `false` | Preserve upper/lower case in string |
| `regexpGlobal` | `boolean` | `false` | Add flag `g` (global match) when building RegExp from string |
| `regexpInsensitive` | `boolean` | `false` | Add flag `i` (case insensitive) when building RegExp from string |
| `remove` | `string | RegExp | (string | RegExp)[]` | N/A | Remove occurance in string |
| `scrapSource` | `ScrapSource` | N/A | Scrapping setting |
| `scrapRemains` | `boolean | Object` | N/A | Scrap remaining data |
| `scrapRemains.number` | `boolean` | `false` | Scrap any number in remaining data |
| `scrapRemains.bracket` | `boolean` | `false` | Scrap any bracket-surrounded string in remaining data |
| `splitter` | `string | RegExp` | N/A | Split the string with the splitter |
| `trim` | `boolean | string | RegExp` | whitespace | Trim the string with the target |
| `urlSafe` | `boolean` | `false` | URL Safe Base64 (ie `+/` to `-_`) |

## Support

If this repository helps you, you can give me some support.

<a href="https://www.buymeacoffee.com/demching" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-red.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>