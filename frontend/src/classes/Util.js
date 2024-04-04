export class Util {

    static sleep(ms) {

        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    static isJson(str) {

        try {
            JSON.parse(str);
            return true;
        } catch (ex) {
            return false;
        }
    }

    static parseJsonQuietly(json) {

        try {
            return JSON.parse(json);
        } catch (ex) {
            return null;
        }
    }

    // https://en.wikipedia.org/wiki/Password_strength#Random_passwords
    static calcEntropy(charset, length) {
        let temp = (Math.log(charset) / Math.log(2)) * length;
        return Math.round(temp);
    }

    static isHashValid(hash) {
        const re = /^[0-9a-f]{16}$/g;
        return re.test(hash);
    }

    static isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    }

    // [inclusive, exclusive)
    static randomInt(min, max) {

        if (!min) {
            min = 0;
        }

        if (!max) {
            max = Number.MAX_SAFE_INTEGER;
        }

        return Math.floor(Math.random() * (max - min) + min);
    }

    static randomAlphaNumericString(len = 16) {

        let result = '';

        while (result.length < len) {
            const temp = (this.randomInt(0, 9999999)).toString(36);
            result = result.concat(temp);
        }

        return result.slice(0, len);
    }

    static arrayNestedGet(array, key) {

        let segments = key.split('.');

        let subArray = array;
        let result = '';

        for (let s of segments) {

            if (typeof subArray === 'object' && subArray !== null && s in subArray) {
                result = subArray[s];
                subArray = subArray[s];
            } else {
                result = null;
                break;
            }
        }

        return result;
    }
}