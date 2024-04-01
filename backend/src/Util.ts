const base64url = require('base64-url');

const base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base62Encoder = require('base-x')(base62);

// misc functions that don't fit anywhere else

export const hexStringToByteArray = (hexString: string): Uint8Array => {
    // Remove any spaces or other characters that might be present
    hexString = hexString.replace(/\s/g, '');

    // Ensure the input is a valid hexadecimal string
    if (!/^[0-9a-fA-F]+$/.test(hexString)) {
        throw new Error('Invalid hexadecimal string');
    }

    // Create a Uint8Array to store the result
    const byteArray = new Uint8Array(hexString.length / 2);

    // Parse each pair of hexadecimal characters and convert to bytes
    for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
    }

    return byteArray;
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
