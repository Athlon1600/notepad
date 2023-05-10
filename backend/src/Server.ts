import {Application, NextFunction, Request, Response, Router} from "express";
import path from "path";

const express = require('express');

export class Server {

    public static readonly PORT_DEFAULT: number = 3000;

    public app: Application;
    protected router: Router;

    constructor() {

        let app = express();
        app.set('json spaces', 2);

        app.set('etag', false);
        app.disable('x-powered-by');

        this.router = Router();
        this.app = app;

        this.enablePost();
        this.enableStatic();
    }

    protected getRouter() {
        return this.router;
    }

    protected enablePost() {

        // 10 kilobytes of text MAX!! - ~10K chars
        this.app.use(express.urlencoded({
            extended: true,
            limit: "100kb"
        }));

        this.app.use(express.text({
            limit: "100kb"
        }));
    }

    protected enableStatic() {

        const parentPublic = path.join(__dirname, '../public');

        this.app.use(express.static(parentPublic, {
            etag: true
        }));
    }

    protected registerNotFoundHandler() {

        this.app.all('*', (req: Request, res: Response, next: any) => {

            res.status(404).json({
                status: '404',
                message: `Can't find ${req.originalUrl} on this server!`
            });
        });
    }

    protected registerErrorHandler() {

        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {

            console.error(err);

            let msg = err.toString();

            return res.status(500).json({
                status: 500,
                'message': 'Something went wrong...',
                'error': msg
            });

        });
    }

    public start(port: number) {

        this.app.use(this.router);

        this.registerNotFoundHandler();
        this.registerErrorHandler();

        this.app.listen(port, function () {
            console.log(`Node Express Server listening on port: ${port}!`)
        });
    }
}