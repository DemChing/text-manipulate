export function Capitalize(input: string, opts?: Options): string {
    opts = opts || {};
    return UpperCase(input[0]) + opts.preserveCase ? input.slice(1) : LowerCase(input.slice(1));
}

export function UpperCase(input: string, opts?: Options): string {
    opts = {
        ...{
            locale: false,
        },
        ...opts
    }
    return opts.locale ? input.toLocaleUpperCase(opts.locale) : input.toUpperCase();
}

export function LowerCase(input: string, opts?: Options): string {
    opts = {
        ...{
            locale: false,
        },
        ...opts
    }
    return opts.locale ? input.toLocaleLowerCase(opts.locale) : input.toLowerCase();
}

export function CamelCase(input: string, opts?: Options): string {
    opts = {
        ...{
            splitter: /[ _-]/,
            connector: "",
        },
        ...opts
    }
    return Join(Split(input, opts).map((v: string, i: number) => {
        if (i == 0) return LowerCase(v);
        else return UpperCase(v, opts) == v ? v : Capitalize(v, opts)
    }), opts);
}

export function PascalCase(input: string, opts?: Options): string {
    opts = {
        ...{
            splitter: /[ _-]/,
            connector: "",
        },
        ...opts
    }
    return Join(Split(input, opts).map((v: string) => {
        return UpperCase(v, opts) == v ? v : Capitalize(v, opts)
    }), opts);
}

export function Join(input: string[], opts?: Options): string {
    opts = {
        ...{
            connector: " ",
        },
        ...opts
    }
    return input.join(opts.connector);
}

export function Split(input: string, opts?: Options): string[] {
    opts = {
        ...{
            empty: false,
            trim: true,
            splitter: " ",
        },
        ...opts
    }
    return input.split(opts.splitter).map(v => {
        if (opts.trim) {
            v = Trim(v, opts);
        }
        return v;
    }).filter(v => {
        let ok = true;
        if (!opts.empty) {
            ok = !!v;
        }
        return ok;
    });
}

export function TrimStart(input: string, opts?: Options): string {
    opts = {
        ...{
            trim: /^\s/,
        },
        ...opts
    }
    if (opts.trim === true) opts.trim = /^\s/;
    if (opts.trim !== false) {
        let regex = BuildRegex(opts.trim, opts);
        while (regex.test(input)) {
            input = input.replace(regex, "");
        }
    }
    return input;
}

export function TrimEnd(input: string, opts?: Options): string {
    opts = {
        ...{
            trim: /\s$/,
        },
        ...opts
    }
    if (opts.trim === true) opts.trim = /\s$/;
    if (opts.trim !== false) {
        let regex = BuildRegex(opts.trim, opts);
        while (regex.test(input)) {
            input = input.replace(regex, "");
        }
    }
    return input;
}

export function Trim(input: string, opts?: Options): string {
    return TrimEnd(TrimStart(input, opts), opts);
}

export function EscapeRegexp(input: string | RegExp): string | RegExp {
    if (input instanceof RegExp) return input;
    return input.replace(/([\^\$\/\.\*\-\+\?\|\(\)\[\]\{\}\\])/g, '\\$1');
}

export function BuildRegex(input: string | RegExp, opts?: Options): RegExp {
    let flags = "";
    opts = opts || {};
    if (input instanceof RegExp) return input;
    if (typeof input === "string") {
        if (opts.escapeRegexp) input = EscapeRegexp(input);
        if (opts.regexpGlobal) flags += "g";
        if (opts.regexpInsensitive) flags += "i";
    }
    return new RegExp(input as string, flags);
}

export function GetBracket(input: string, opts?: Options): string[] {
    opts = {
        ...{
            bracket: "()（）[]［］{}｛｝<>〈〉《》〔〕【】〖〗",
            bracketRemove: false,
        },
        ...opts
    }
    if (!opts.bracket || opts.bracket.length < 2) return [];
    let bracketLeft = [],
        bracketRight = [];
    opts.bracket.match(/.{2}/g).map(v => {
        bracketLeft.push(EscapeRegexp(v[0]))
        bracketRight.push(EscapeRegexp(v[1]))
    })
    let left = bracketLeft.join(""),
        right = bracketRight.join(""),
        regex = new RegExp(`[${left}]([^${right}]+)[${right}]`, "g");
    return (input.match(regex) || []).map(v => {
        if (opts.bracketRemove) {
            v = v.replace(new RegExp(`^[${left}]`), "").replace(new RegExp(`[${right}]$`), "")
        }
        return v;
    });
}

export function Occurance(input: string, opts?: Options): { [key: string]: number } {
    opts = {
        ...{
            regexpGlobal: true
        },
        ...opts
    }
    if (!opts.occurance) throw "Unspecified string(s) of occurance";
    if (!Array.isArray(opts.occurance)) opts.occurance = [opts.occurance];

    let result = {};
    opts.occurance.map(v => {
        let regex = BuildRegex(v, opts),
            m = input.match(regex);
        result[v] = m ? m.length : 0;
    })
    return result;
}

export function Remove(input: string, opts?: Options): string {
    opts = opts || {};
    if (!opts.remove) return input;
    let remove: (string | RegExp)[] = [];
    if (typeof opts.remove === "string" || opts.remove instanceof RegExp) remove.push(opts.remove);
    else if (Array.isArray(opts.remove)) remove = opts.remove;

    for (let i = 0; i < remove.length; i++) {
        input = input.replace(BuildRegex(remove[i], opts), "")
    }
    return input;
}

export function BreakLines(input: string, opts?: Options): string[] {
    opts = {
        ...{
            splitter: /\r?\n|<br\s*\/?>/i,
        },
        ...opts
    };

    return Split(input, opts);
}

export function Pad(input: string, opts?: Options): string {
    opts = opts || {};
    let pad = "";
    if (opts.pad && typeof opts.pad.string === "string" && opts.pad.string.length > 0) {
        if (opts.pad.count) {
            pad = opts.pad.string.repeat(opts.pad.count);
        } else if (opts.pad.length && (input.length + opts.pad.string.length) < opts.pad.length) {
            let index = 0;
            while (pad.length < opts.pad.length - input.length) {
                if (typeof opts.pad.string[index] === "undefined") index = 0;
                pad += opts.pad.string[index++];
            }
        }
    }
    return opts.pad.end ? input + pad : pad + input;
}

export function PadStart(input: string, opts?: Options): string {
    opts = opts || {};
    opts.pad = {
        ...opts.pad,
        ...{
            end: false,
        }
    }
    return Pad(input, opts);
}

export function PadEnd(input: string, opts?: Options): string {
    opts = opts || {};
    opts.pad = {
        ...opts.pad,
        ...{
            end: true,
        }
    }
    return Pad(input, opts);
}