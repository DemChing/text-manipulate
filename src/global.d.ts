interface ScrapperValidate {
    max?: number,
    min?: number,
    regex?: RegExp,
    method?: (val: string) => boolean,
}

type ScrapperOptions = {
    multiple?: boolean,
    insensitive?: boolean,
    validate?: ScrapperValidate,
}

type ScrapperConfiguration = {
    field: string,
    key?: string,
} & ScrapperOptions;

type ScrapSourceBase = string | RegExp | {
    input: string | RegExp | (string | RegExp)[],
    key?: string,
    opts?: ScrapperOptions,
};

type ScrapSource = {
    [field: string]: ScrapSourceBase | ScrapSourceBase[] | {
        [key: string]: string | RegExp | (string | RegExp)[]
    },
}

type Scrapper = {
    field: string,
    regex: RegExp,
    key?: string,
    opts: ScrapperOptions,
}

type Options = {
    bracket?: string,
    bracketRemove?: boolean,
    connector?: string,
    empty?: boolean,
    escapeRegexp?: boolean,
    locale?: string | string[] | false,
    number?: {
        ceil?: boolean,
        floor?: boolean,
        round?: boolean,
        format?: string | RegExp,
    },
    occurance?: string | string[],
    pad?: {
        string: string,
        end?: boolean,
        count?: number,
        length?: number,
    },
    preserveCase?: boolean,
    regexpGlobal?: boolean,
    regexpInsensitive?: boolean,
    remove?: string | RegExp | (string | RegExp)[],
    scrapSource?: ScrapSource,
    scrapRemains?: boolean | { number?: boolean, bracket?: boolean, },
    splitter?: string | RegExp,
    trim?: boolean | string | RegExp,
    urlSafe?: boolean,
}