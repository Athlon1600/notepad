const fs = require('fs');

const notesPath = __dirname + '/../storage';

export class Database {

    static get(code: string) {
        try {
            return fs.readFileSync(`${notesPath}/${code}.txt`, 'utf8');
        } catch (ex) {
            return null;
        }
    }

    static save(code: string, contents: string) {

        if (!fs.existsSync(notesPath)) {
            fs.mkdirSync(notesPath);
        }

        fs.writeFileSync(notesPath + `/${code}.txt`, contents);
    }

    static remove(code: string) {

        try {
            fs.unlinkSync(`${notesPath}/${code}.txt`);
        } catch (ex) {
            // removeQuietly
        }
    }
}