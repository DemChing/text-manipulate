import { BuildRegex } from "./main";

export function GetNumeric(input: string, opts?: Options): number[] {
    opts = opts || {};
    let numbers: number[] = [],
        format = opts?.number?.format ? BuildRegex(opts.number.format, opts) : /-?\d+(\.\d+)?/g;
    if (/\d/.test(input)) {
        numbers = input.match(format).map(v => {
            let num = parseFloat(v.replace(/[^0-9.-]/g, ""));
            if (opts?.number?.floor) num = Math.floor(num);
            else if (opts?.number?.ceil) num = Math.ceil(num);
            else if (opts?.number?.round) num = Math.round(num);

            return num;
        })
    }
    return numbers;
}

const ROMAN = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1, };

export function ArabicToRoman(input: string | number, opts?: Options): string {
    let roman = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    if (typeof input === "string") input = GetNumeric(input, opts)[0];
    input = Math.round(input);

    let result = "";
    if (input < 4000 && input > 0) {
        for (let i = 0; i < roman.length; i++) {
            while (input >= ROMAN[roman[i]]) {
                result += roman[i];
                input -= ROMAN[roman[i]];
            }
        }
    }
    return result;
}

export function RomanToArabic(input: string): number {
    let roman = ["CM", "M", "CD", "D", "XC", "C", "XL", "L", "IX", "X", "IV", "V", "I"];

    let num: number = 0;

    for (let i = 0; i < roman.length; i++) {
        input = input.replace(new RegExp(roman[i], "gi"), (m) => {
            num += ROMAN[roman[i]];
            return "";
        })
    }
    return num;
}