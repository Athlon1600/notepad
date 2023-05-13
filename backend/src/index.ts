import {NextFunction, Request, RequestHandler, Response, Router} from "express";
import {Database} from "./Database";
import {Server} from "./Server";
import {Config} from "./config";
import {urlKeyFromAuthKey} from "./Util";
import {NotesController} from "./NotesController";

const server = new Server();

const safeHandler = function (fn: RequestHandler) {
    return function (req: Request, res: Response, next: NextFunction) {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};

const apiRouter = Router();

apiRouter.get('/', function (req: Request, res: Response) {

    res.json({
        message: 'API index'
    });

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

    const authKey = urlKeyFromAuthKey(uid);

    const contents = Database.get(authKey);

    if (contents) {
        res.setHeader('content-type', 'text/plain');
        res.send(contents);
    } else {
        res.status(404).json({error: "Note not found"});
    }

})

const port: number = Config.port;

server.start(port);