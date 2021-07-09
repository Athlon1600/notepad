import scryptAsync from 'scrypt-async';
import {Util} from "./Util";

const aesjs = require('aes-js');
const md5 = require('md5');

export class Security {

    static str2ab(str) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return bufView;
    }

    static randomBytes(len) {

        let arr = new Uint8Array(len);

        for (let i = 0; i < arr.length; i++) {
            arr[i] = Util.randomInt(0, 256);
        }

        return arr;
    }

    // always hex. 2 hex chars => 1 byte
    static async slowHash(password, salt) {

        return new Promise(function (resolve, reject) {

            let pb = Security.str2ab(password);
            let sb = Security.str2ab(salt);

            scryptAsync(pb, sb, {
                N: Math.pow(2, 14),
                r: 8,
                p: 1,
                dkLen: 64,
                encoding: 'hex'
            }, function (derivedKey) {
                resolve(derivedKey);
            });

        });
    }

    static fastHash(data) {
        return md5(data);
    }

    // throws exception!
    static encrypt(data, key) {

        // key must be 32 chars long AND HEX!!!!
        if (!key || key.length !== 32) {
            throw 'has to be 32 in length!';
        }

        key = aesjs.utils.hex.toBytes(key);

        // The initialization vector (must be 16 bytes)
        const iv = this.randomBytes(16);

        var textBytes = aesjs.utils.utf8.toBytes(data);
        var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);

        // Convert text to bytes (text must be a multiple of 16 bytes)
        let padded = aesjs.padding.pkcs7.pad(textBytes);

        const encryptedBytes = aesCbc.encrypt(padded);

        const cipherAsHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        const ivHex = aesjs.utils.hex.fromBytes(iv);

        return {
            alg: 'AES-256-CBC',
            iv: ivHex,
            cipherText: cipherAsHex,
            timestamp: Date.now(),
            meta: {}
        }
    }

    // When decrypting, the IV can then be read from the input before the encrypt data.
    static decrypt(data, key) {

        const keyAsBytes = aesjs.utils.hex.toBytes(key);

        const iv = data['iv'];
        const cipherText = data['cipherText'];

        const ivAsBytes = aesjs.utils.hex.toBytes(iv);
        const cipherAsBytes = aesjs.utils.hex.toBytes(cipherText);

        const aesOfb = new aesjs.ModeOfOperation.cbc(keyAsBytes, ivAsBytes);

        let decryptedBytes = aesOfb.decrypt(cipherAsBytes);
        decryptedBytes = aesjs.padding.pkcs7.strip(decryptedBytes);

        return aesjs.utils.utf8.fromBytes(decryptedBytes);
    }
}