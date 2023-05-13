import {Config} from "./config";
import Buffer from "buffer";
import {fastHash} from "./Security";

const base64url = require('base64-url');

const base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base62Encoder = require('base-x')(base62);

// misc functions that don't fit anywhere else

export const uidFromAuthKey = function (data: string) {

    const maxLen = Config.noteIdMaxLen;
    const hash: Buffer = fastHash(data);

    return base64url.encode(hash).substr(0, maxLen);
}

const stringToByteArray = (text: string): Uint8Array => {
    const encoder = new TextEncoder();
    return encoder.encode(text);
}

const byteArrayToHexString = (uint8Array: Uint8Array) => {
    let hexString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        const hex = uint8Array[i].toString(16).padStart(2, '0');
        hexString += hex;
    }
    return hexString;
}

export const urlKeyFromAuthKey = function (key: string): string {
    const buffer = base62Encoder.decode(key);
    return byteArrayToHexString(buffer);
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
