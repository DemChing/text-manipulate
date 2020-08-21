# Scrapping

Scrap useful infomation from string.


## Usage

```typescript
import { Scrapping } from "text-manipulate";

let result = Scrapping(input, opts)
// Output:
// { _raw: {...}, data: {...}}
```

## Notice

### Regular Expression Scrapping

When scrapping with `RegExp`, this function will __IGNORE__ some options in [Options](README.md/#Options) (eg `regexpGlobal`, `regexpInsensitive`) and [ScrapperOptions](#ScrapperOptions) (eg `multiple`, `insensitive`).

### String Scrapping

When scrapping with `string`, this function will build a `RegExp` for that `string`.

It will add `RegExp` flags base on the conditions:
1. If options is set in [ScrapperOptions](#ScrapperOptions), else
2. If options is set in [Options](README.md/#Options), else
3. Add all flags

### Complete Word Scrapping

When scrapping English or numeric contents, please aware that this function will reject content that breaks a word. 

For example, searching `/foo/ig` from `foo foobar barfoo 3foo2 FOO` would only capture the first and last word.

### Bracket Scrapping

Before the function start scrapping, it will first get all the bracket-surrounded contents and do scrapping for each content.

## ScrapSource

`ScrapSource` is an option under [Options](README.md/#Options) for scrapping.

```typescript
type ScrapSource = {
    [field: string]: ScrapSourceBase | ScrapSourceBase[] | {
        [key: string]: string | RegExp | (string | RegExp)[]
    },
}
```

`ScrapSource` is an object contains:
1. [ScrapSourceBase](#ScrapSourceBase)
2. Array of [ScrapSourceBase](#ScrapSourceBase)
3. Object with values containing string(s) or RegExp(s)


## ScrapSourceBase

`ScrapSourceBase` is the core setting in [ScrapSource](#ScrapSource).

```typescript
type ScrapSourceBase = string | RegExp | {
    input: string | RegExp | (string | RegExp)[],
    key?: string,
    opts?: ScrapperOptions,
};
```

`ScrapSourceBase` could be a `string` or `RegExp` to be matched from the input. For advance usage, you can transform it to an object with following fields:

| Name | Required | Type | Description |
| --- | --- | --- | --- |
| `input` | `true` | `string | RegExp | (string | RegExp)[]` | String(s) or RegExp(s) to be matched |
| `key` | `false` | `string` | Sub key name |
| `validate` | `false` | `ScrapperOptions` | Validation. See [ScrapperOptions](#ScrapperOptions) |


## ScrapperOptions

`ScrapperOptions` contains options for [ScrapSourceBase](#ScrapSourceBase).

```typescript
type ScrapperOptions = {
    multiple?: boolean,
    insensitive?: boolean,
    validate?: {
        max?: number,
        min?: number,
        regex?: RegExp,
        method?: (val: string) => boolean,
    },
}
```

| Name | Type | Description |
| --- | --- | --- |
| `multiple` | `boolean` | Scrap all occurance or not |
| `insensitive` | `boolean` | Case sensitive or not |
| `validate` | `Object` | Only include occurance that pass the validation |
| `validate.max` | `number` | Occurance should not be greater than it (Only for number string) |
| `validate.min` | `number` | Occurance should not be smaller than it (Only for number string) |
| `validate.regex` | `RegExp` | Occurance should match the RegExp |
| `validate.method` | `function` | Occurance should pass the validate function |

## Extra

Some options in [Options](README.md/#Options) can be used together for better scrapping.

- `remove`: It will remove all occurance before scrapping
- `bracket`: Specify which brackets to capture
- `bracketRemove`: Include brackets in data if captured bracket-surrounded content
- `escapeRegexp`: General setting for string scrapping
- `regexpGlobal`: General setting for string scrapping
- `regexpInsensitive`: General setting for string scrapping
- `scrapRemains`: Specify whether to scrap the remaining data after the main scrapping

## Example

```typescript
let input = "Today is 20th August 2020";
let opts: Options = {
    scrapSource: {
        year: "2020",
        month: /jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sept(empber)?|oct(ober)?|nov(ember)?|dec(ember)?/i,
        day: /\d+(st|nd|rd|th)/
    }
};

Scrapping(input, opts);
```

In the above code, the output would be:

```json
{
    "_raw": {
        "input": "Today is 20th August 2020",
        "clean": "Today is   ",
        "final": "Today is { day } { month } { year }"
    },
    "data": {
        "year": [ "2020" ],
        "month": [ "August" ],
        "day": [ "20th" ]
    }
}
```

`_raw.input` is the original input.

`_raw.final` shows the corresponding match in data.

`_raw.clean` is the remaining part that is not processed during scrapping.

`data` contains all matched results.

## Example2

Now change the `opts` in [Example 1](#example) to:

```typescript
let opts: Options = {
    scrapSource: {
        year: "2020",
        months: {
            jan: ["jan", "january"],
            feb: ["feb", "february"],
            mar: ["mar", "march"],
            apr: ["apr", "april"],
            may: ["may", "may"],
            jun: ["jun", "june"],
            jul: ["jul", "july"],
            aug: ["aug", "august"],
            sept: ["sept", "septempber"],
            oct: ["oct", "october"],
            nov: ["nov", "november"],
            dec: ["dec", "december"]
        },
        day: /\d+(st|nd|rd|th)/
    }
};
```

Then the output would be:

```json
{
    "_raw": {
        "input": "Today is 20th August 2020",
        "clean": "Today is   ",
        "final": "Today is { day } { months - aug } { year }"
    },
    "data": {
        "year": [ "2020" ],
        "months": {
            "aug": [ "August" ]
        },
        "day": [ "20th" ]
    }
}
```

If you specified a sub key for a field (eg `jan`, `feb`... in `months`) in options, `_raw.final` and `data` will have different result.