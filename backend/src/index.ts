import {NextFunction, Request, RequestHandler, Response, Router} from "express";
import {Database} from "./Database";
import {Server} from "./Server";
import {Config} from "./config";
import {uidFromAuthKey} from "./Util";
import {NotesController} from "./NotesController";

const server = new Server();

const apiRouter = Router();

const safeHandler = function (fn: RequestHandler) {
    return function (req: Request, res: Response, next: NextFunction) {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};

apiRouter.get('/', function (req: Request, res: Response) {

    res.json({
        message: 'API index'
    });

});

apiRouter.get('/get', function (req: Request, res: Response) {

    const authKey = req.query['code'] as string;

    if (!authKey) {

        res.status(400).json({
            error: 'Missing ?code'
        });

        return;
    }

    const uid = uidFromAuthKey(authKey);
    res.setHeader('content-type', 'text/plain');

    const text = Database.get(uid);

    res.json({
        exists: false,
        uid: uid,
        encrypted: null,
        text: text,
    });
});

apiRouter.post('/save', function (req: Request, res: Response) {

    const code = req.body['code'] as string;
    const contents = req.body['contents'] as string;

    if (code && contents) {
        const uid = uidFromAuthKey(code);
        Database.save(uid, contents);
    }

    res.status(200).json({
        error: '',
        message: 'Saved'
    })
});

apiRouter.post('/delete', function (req: Request, res: Response) {

    const code = req.body['code'] as string;

    if (code) {
        const uid = uidFromAuthKey(code);
        Database.remove(uid);
    }

    res.status(200).json({
        error: '',
        message: 'Deleted'
    })

});

server.app.use('/api', apiRouter);

const notesRouter = Router();
notesRouter.get('/', NotesController.index);
notesRouter.get('/:id', NotesController.read);
notesRouter.post('/:id', NotesController.write);
notesRouter.delete('/:id', NotesController.delete);

server.app.use('/api/notes', notesRouter);

server.app.get('/notes/:id', function (req: Request, res: Response) {

    const uid = req.params['id'];

    const contents = Database.get(uid);

    if (contents) {
        res.setHeader('content-type', 'text/plain');
        res.send(contents);
    } else {
        res.status(404).json({error: "Note not found"});
    }

})

const port: number = Config.port;

server.start(port);