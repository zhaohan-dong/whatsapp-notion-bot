import {expressjwt} from 'express-jwt';
import { Request, Response } from 'express';

export const jwtMiddleware = () => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY environment variable not set');
    }

    const jwtSecretKey: string = process.env.JWT_SECRET_KEY as string;

    return expressjwt({
        secret: jwtSecretKey,
        algorithms: ['HS256'],
        requestProperty: 'auth'
    }).unless({ path: ['/login', '/health'] }); // Exclude /login and /health from authentication
}

export function errorHandler(err: any, req: Request, res: Response, next: any) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ "status": "Invalid or no token provided" });
    } else {
        console.error(err);  // log the error to the console
        res.status(500).send({ "status": "Internal Server Error", "message": err.message });
    }
}