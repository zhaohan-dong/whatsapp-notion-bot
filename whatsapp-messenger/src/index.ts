import app, {startServer} from "./app";
import {expressPort} from "./config";
import {Request, Response} from "express";

const server = app.listen(expressPort, (): void => {
    startServer();
});

// Graceful shutdown
app.get('/shutdown', (req: Request, res: Response): void => {
    res.status(200).send('Shutting down...');

    server.close(() => {
        console.log('Server closed!');
        process.exit(0);
    });
});