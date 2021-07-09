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