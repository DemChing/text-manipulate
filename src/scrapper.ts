import { BuildRegex, Remove, GetBracket } from "./main";

function normalize(input: string | RegExp, opts: ScrapperConfiguration | string): Scrapper {
    let scrapper: Scrapper = {
        field: "",
        regex: /(?!)/,
        opts: {},
    };
    if (typeof opts === "string") scrapper.field = opts;
    else {
        scrapper.field = opts.field;
        if (opts.key) scrapper.key = opts.key;
        if (opts.hasOwnProperty("multiple")) scrapper.opts.multiple = opts.multiple;
        if (opts.hasOwnProperty("insensitive")) scrapper.opts.insensitive = opts.insensitive;
        if (opts.hasOwnProperty("validate")) scrapper.opts.validate = opts.validate;
    }

    let options: Options = {
        regexpGlobal: scrapper.opts.hasOwnProperty("multiple") ? scrapper.opts.multiple : true,
        regexpInsensitive: scrapper.opts.hasOwnProperty("insensitive") ? scrapper.opts.insensitive : true,
    };

    if (typeof input === "string" || input instanceof RegExp) {
        scrapper.regex = BuildRegex(input, options);
    }
    return scrapper;
}

function scrapBase(base: ScrapSourceBase, opts: ScrapperConfiguration): Scrapper[] {
    if (typeof base === "string" || base instanceof RegExp) return [normalize(base, opts)];
    else {
        if (base.key) opts.key = base.key;
        for (let key in base.opts) opts[key] = base.opts[key];

        if (Array.isArray(base.input)) {
            let scrappers: Scrapper[] = [];
            for (let i = 0; i < base.input.length; i++) {
                scrappers.push(normalize(base.input[i], opts));
            }
            return scrappers;
        } else {
            return [normalize(base.input, opts)];
        }
    }
}

function scrapSource(src: ScrapSource, opts?: Options): Scrapper[] {
    let scrappers: Scrapper[] = [];
    for (let field in src) {
        let _opt: ScrapperConfiguration = {
            field: field
        };

        _opt.multiple = typeof opts?.regexpGlobal !== "undefined" ? opts.regexpGlobal : true;
        _opt.insensitive = typeof opts?.regexpInsensitive !== "undefined" ? opts.regexpInsensitive : true;

        let data = src[field];
        if (Array.isArray(data)) {
            data.map(s => {
                scrappers = scrappers.concat(scrapBase(s, _opt));
            })
        } else if (typeof data === "string" || data instanceof RegExp) {
            scrappers = scrappers.concat(scrapBase(data, _opt));
        } else if (typeof data === "object" && data.input) {
            for (let key in data) {
                if (["input", "key", "opts"].indexOf(key) == -1) delete data[key];
            }
            if (Object.keys(data).length > 0) {
                scrappers = scrappers.concat(scrapBase(data as ScrapSourceBase, _opt));
            }
        } else if (typeof data === "object") {
            for (let key in data) {
                if (Array.isArray(data[key]) || typeof data[key] === "string" || data[key] instanceof RegExp) {
                    scrappers = scrappers.concat(scrapBase({
                        input: data[key],
                        key: key,
                    }, _opt));
                }
            }
        }
    }
    return scrappers;
}

interface ScrapperData {
    [field: string]: string | string[] | {
        [key: string]: string | string[],
    },
}
interface ScrapperResult {
    _raw: {
        input: string,
        clean: string,
        final: string,
    },
    data: ScrapperData,
}

function scrap(input: string, scrapper: Scrapper): ScrapperResult | false {
    let match = input.match(scrapper.regex);
    if (match) {
        let checkResult = replaceCheck(input, scrapper),
            result: ScrapperResult = {
                _raw: {
                    input: input,
                    clean: input,
                    final: input,
                },
                data: {}
            };

        let matches: string[] = checkResult.matches;
        result._raw.clean = checkResult.final;

        if (matches.length == 0) return false;

        if (scrapper.key) {
            result.data[scrapper.field] = {
                [scrapper.key]: matches
            }
        } else {
            result.data[scrapper.field] = matches;
        }
        return result;
    }
    return false;
}

function replaceCheck(input: string, scrapper: Scrapper, value: boolean = false) {
    let matches = [],
        isGlobal = /g/.test(scrapper.regex.flags),
        isFound = false,
        regexp = isGlobal ? scrapper.regex : new RegExp(scrapper.regex, scrapper.regex.flags + "g"),
        final = input.replace(regexp, function () {
            let pos = arguments[arguments.length - 2],
                m = arguments[0],
                leftBracket = input.lastIndexOf("{", pos),
                rightBracket = input.indexOf("}", pos);
            if (!isGlobal && isFound) return m;

            if (leftBracket != -1 && rightBracket != -1 && input.slice(leftBracket, rightBracket + 1).match(`{ ${m} }|{ [^ ]+ - ${m} }|{ ${m} - [^ ]+ }`))  return m;
        
            if ((pos - 1 >= 0 && /[a-z0-9]/i.test(input[pos - 1])) || (pos + m.length < input.length && /[a-z0-9]/i.test(input[pos + m.length]))) return m;
            if (scrapper?.opts?.validate) {
                if (/^[0-9.]+$/.test(m)) {
                    let n = parseInt(m);
                    if (typeof scrapper.opts.validate?.max === "number" && n > scrapper.opts.validate.max) return m;
                    if (typeof scrapper.opts.validate?.min === "number" && n < scrapper.opts.validate.min) return m;
                }
                if (scrapper.opts.validate?.regex instanceof RegExp) {
                    if (!scrapper.opts.validate.regex.test(m)) return m;
                }
                if (typeof scrapper.opts.validate?.method === "function") {
                    if (!scrapper.opts.validate.method(m)) return m;
                }
            }
            isFound = true;
            matches.push(m);
            return value ? `{ ${scrapper.field}${scrapper.key ? ` - ${scrapper.key}` : ""} }` : "";
        })
    return {
        final: final,
        matches: matches
    }
}

export function Scrapping(input: string, opts?: Options): ScrapperResult {
    opts = opts || {};
    if (!opts.scrapSource) throw "Unspecified scraping source";

    let result: ScrapperResult = {
        _raw: {
            input: "",
            clean: "",
            final: "",
        },
        data: {}
    },
        _merge = (src: ScrapperData[string] | undefined, tar: ScrapperData[string]): ScrapperData[string] => {
            if (typeof src === "undefined") {
                return tar;
            } else {
                if (Array.isArray(src) && Array.isArray(tar)) {
                    return src.concat(tar);
                } else if (typeof src === "object" && typeof tar === "object") {
                    for (let key in tar) {
                        if (!(key in src)) {
                            src[key] = tar[key];
                        } else if (Array.isArray(tar[key])) {
                            if (!Array.isArray(src[key])) src[key] = [src[key]];
                            src[key] = src[key].concat(tar[key]);
                        }
                    }
                }
                return src;
            }
        },
        scrappers = scrapSource(opts.scrapSource, opts);
    result._raw.input = input;

    if (opts.remove) input = Remove(input, opts);

    result._raw.clean = result._raw.final = input;

    GetBracket(input, opts).map(part => {
        let clean = part,
            final = part;
        scrappers.map(scrapper => {
            let res = scrap(clean, scrapper);
            if (res) {
                clean = res._raw.clean;
                final = final.replace(scrapper.regex, `{ ${scrapper.field}${scrapper.key ? ` - ${scrapper.key}` : ""} }`);
                for (let field in res.data) {
                    result.data[field] = _merge(result.data[field], res.data[field]);
                }
            }
        })
        result._raw.clean = result._raw.clean.replace(part, clean);
        result._raw.final = result._raw.final.replace(part, final);
    })

    if (opts.scrapRemains) {
        let remain: ScrapSourceBase[] = [];
        if (opts.scrapRemains === true || opts.scrapRemains.bracket) {
            remain.push({
                input: /[\(（\[［\{｛<〈《〔【〖][^\)）\]］\}｝>〉》〕】〗]+[\)）\]］\}｝>〉》〕】〗]/g,
                key: "bracket",
                opts: {
                    validate: {
                        method: (val: string) => {
                            return /[^ \(\)（）\[\]［］\{\}｛｝<>〈〉《》〔〕【】〖〗!@#\$%\^&\*\+=:;'"<>\?\!\/\-。…？；：、＂—！]+/g.test(val.slice(1, val.length - 1))
                        }
                    }
                }
            })
        }
        if (opts.scrapRemains === true || opts.scrapRemains.number) {
            remain.push({
                input: /-?\d+(\.\d+)?/g,
                key: "number"
            })
        }
        scrappers = scrappers.concat(scrapSource({
            ScrapRemain: remain
        }));
    }
    scrappers.map(scrapper => {
        let res = scrap(result._raw.clean, scrapper);
        if (res) {
            result._raw.clean = res._raw.clean;

            let checkResult = replaceCheck(result._raw.final, scrapper, true)
            result._raw.final = checkResult.final;
            for (let field in res.data) {
                result.data[field] = _merge(result.data[field], res.data[field]);
            }
        }
    })

    return result;
}