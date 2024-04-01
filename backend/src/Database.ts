import {md5} from "./Security";

const fs = require('fs');

const notesPath = __dirname + '/../storage';

const pathFromCode = (key: string): string => {

    // to avoid passing of slashes, dots, etc
    const storageKey = md5(key);

    return `${notesPath}/${storageKey}`;
}

// generic interface for storage... should be adapted to support Redis, SQL etc..
export class Database {

    static count(): number {
        return fs.readdirSync(notesPath).length;
    }

    static get(code: string) {

        try {
            return fs.readFileSync(pathFromCode(code), 'utf8');
        } catch (ex) {
            return null;
        }
    }

    static save(code: string, contents: string): void {

        if (!fs.existsSync(notesPath)) {
            fs.mkdirSync(notesPath);
        }

        fs.writeFileSync(pathFromCode(code), contents);
    }

    static remove(code: string): void {

        try {
            fs.unlinkSync(pathFromCode(code));
        } catch (ex) {
            // removeQuietly
        }
    }
}