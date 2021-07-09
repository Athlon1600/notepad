import {Config} from "./config";
import * as Buffer from "buffer";

const crypto = require('crypto');

const slowHashSecretSalt = Config.slowHashSalt;
const fastHashSecretSalt = Config.fastHashSalt;

function md5(data: string): string {
    return crypto.createHash('md5').update(data).digest("hex");
}

export const md5WithRounds = function (data: string, salt: string, rounds: number): string {

    let hash = md5(data + salt);

    for (let i = 1; i < rounds; i++) {
        hash = crypto.createHash('md5').update(hash + data + salt + i).digest("hex");
    }

    return hash;
}

export const fastHash = function (data: string): Buffer {
    return crypto.createHash('sha512').update(data).digest();
}

export const slowHash = function (data: string): Buffer {

    // default
    let cost = Math.pow(2, 14);

    return crypto.scryptSync(data, slowHashSecretSalt, 32, {
        cost: cost,
        blockSize: 8, // default
        parallelization: 1, // default
        maxmem: Number.MAX_SAFE_INTEGER
    });
}
