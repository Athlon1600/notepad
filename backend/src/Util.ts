import {Config} from "./config";
import Buffer from "buffer";
import {fastHash} from "./Security";

const base64url = require('base64-url');

// misc functions that don't fit anywhere else

export const uidFromAuthKey = function (data: string) {

    const maxLen = Config.noteIdMaxLen;
    const hash: Buffer = fastHash(data);

    return base64url.encode(hash).substr(0, maxLen);
}

// inclusive, exclusive
export const randomInteger = (min?: number, max?: number): number => {

    if (typeof min == 'undefined') {
        min = 0;
    }

    if (typeof max === 'undefined') {
        max = Number.MAX_SAFE_INTEGER;
    }

    return Math.floor(
        Math.random() * (max - min) + min
    )
}

// must contain only: contain 0-9a-f
export const isHexString = (str: string): boolean => {
    return str.replace(/[a-f0-9]/ig, '').length === 0;
}
