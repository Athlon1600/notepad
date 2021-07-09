import {Request, Response, Router} from "express";
import {Database} from "./Database";
import {Server} from "./Server";
import {Config} from "./config";
import {uidFromAuthKey} from "./Util";

const server = new Server();

const apiRouter = Router();

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

server.app.get('/notes/:id', function (req: Request, res: Response) {

    const uid = req.params['id'];

    const contents = Database.get(uid);

    res.setHeader('content-type', 'text/plain');
    res.send(contents);
})

const port: number = Config.port;

server.start(port);