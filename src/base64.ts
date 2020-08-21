import { BuildRegex } from "./main";

const BASE64_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const BASE64_EXTRA = "+/";
const BASE64_URL_EXTRA = "-_";
const BASE64_PAD = "=";

export function Base64Encode(input: string, opts?: Options): string {
    opts = {
        ...{
            urlSafe: false,
        },
        ...opts
    }
    let chars = BASE64_CHARACTERS + (opts.urlSafe ? BASE64_URL_EXTRA : BASE64_EXTRA) + BASE64_PAD,
        i = 0,
        encoded = "";
    do {
        let buf0 = input.charCodeAt(i++),
            buf1 = input.charCodeAt(i++),
            buf2 = input.charCodeAt(i++),
            buf = (buf0 << 16) + ((buf1 || 0) << 8) + (buf2 || 0),
            idx = [
                (buf & (63 << 18)) >> 18,
                (buf & (63 << 12)) >> 12,
                isNaN(buf1) ? 64 : (buf & (63 << 6)) >> 6,
                isNaN(buf2) ? 64 : (buf & 63)
            ];
        encoded = idx.reduce((p, c) => p += chars[c], encoded);
    } while (i < input.length)
    return encoded;
}

export function Base64Decode(input: string, opts?: Options): string {
    opts = {
        ...{
            urlSafe: false,
        },
        ...opts
    }
    let chars = BASE64_CHARACTERS + (opts.urlSafe ? BASE64_URL_EXTRA : BASE64_EXTRA) + BASE64_PAD,
        i = 0,
        decoded = "";
    if (input.length % 4 != 0) throw "Invalid length of encoded string.";
    else if (BuildRegex(`[^${chars.replace(/([/-])/g, "\\$1")}]`).test(input)) throw "Invalid character(s) in encoded string.";
    else if (/=/.test(input) && (/=[^=]/.test(input) || /===/.test(input))) throw "Invalid padding in encoded string.";

    do {
        let id0 = chars.indexOf(input[i++]),
            id1 = chars.indexOf(input[i++]),
            id2 = chars.indexOf(input[i++]),
            id3 = chars.indexOf(input[i++]),
            buf = (id0 << 18) + (id1 << 12) + ((id2 & 63) << 6) + (id3 & 63),
            bufx = [
                (buf & (255 << 16)) >> 16,
                (id2 == 64) ? -1 : (buf & (255 << 8)) >> 8,
                (id3 == 64) ? -1 : (buf & 255)
            ];
        decoded = bufx.reduce((p, c) => p += c > 0 ? String.fromCharCode(c) : "", decoded);
    } while (i < input.length);
    return decoded;
}