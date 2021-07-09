// purely static
import {Util} from "./Util";

export class EasyStorage {

    static save(key, value) {

        if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value);
        }

        localStorage.setItem(key, value);
    }

    static get(key) {

        let value = localStorage.getItem(key);

        try {
            return JSON.parse(value);
        } catch (ex) {
            // must not be valid JSON... return whatever it was
        }

        return value;
    }

    static getNested(storageKey, valueKey) {

        const value = this.get(storageKey);

        if (Util.isObject(value)) {
            return Util.arrayNestedGet(value, valueKey);
        }

        return null;
    }

    static remove(key) {
        localStorage.removeItem(key);
    }

    // TODO: optional prefix
    static clear() {
        // TODO
    }
}