import api from "../api";
import {Util} from "./Util";
import {Security} from "./Security";

export class SecureStorage {

    /**
     *
     * @param authKey
     * @param password
     * @return {Promise<String>}
     */
    static async read(authKey, password = '') {

        const httpResponse = await api.get(authKey);

        if (httpResponse && Util.isJson(httpResponse)) {

            const json = Util.parseJsonQuietly(httpResponse);
            const alg = json?.alg;

            if (alg === 'AES-256-CBC') {
                return Security.decrypt(json, password);
            }

            return httpResponse;
        }

        return "";
    }

    /**
     *
     * @param authKey
     * @param contents
     * @param password
     * @returns {Promise<String>}
     */
    static async write(authKey, contents, password = '') {

        // array including alg, iv, cipherText
        let encrypted = Security.encrypt(contents, password);
        const json = JSON.stringify(encrypted);

        return api.save(authKey, json);
    }

    static async remove(authKey) {
        return api.delete(authKey);
    }
}