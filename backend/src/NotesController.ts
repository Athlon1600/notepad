import {Request, Response} from "express";
import {Database} from "./Database";
import {isHexString} from "./Util";

const validateKey = (key: string) => {
    return isHexString(key) && key.length === 32;
}

export class NotesController {

    static index(req: Request, res: Response): void {

        res.json({
            message: 'Send POST/DELETE to /files/:key to manage notes'
        });
    }

    static read(req: Request, res: Response): void {

        const {id} = req.params;

        const contents = Database.get(id);

        if (contents) {
            res.setHeader('content-type', 'text/plain').send(contents);
        } else {
            res.status(404).json({
                error: 'Not found'
            });
        }
    }

    static write(req: Request, res: Response): void {

        const {id} = req.params;

        if (!validateKey(id)) {
            res.status(400).send({
                error: 'Invalid key. Must be a lowercase hex string exactly 32 characters in length'
            });

            return;
        }

        if (typeof req.body === 'string') {
            Database.save(id, req.body.toString());

            res.status(200).json({
                status: 'OK'
            });

        } else {
            res.status(400).json({
                error: 'Invalid data. Expecting type: text/plain'
            });
        }
    }

    static delete(req: Request, res: Response): void {

        const {id} = req.params;

        if (id) {
            Database.remove(id);
        }

        res.status(200).send("");
    }
}