import { generateToken } from './auth';
import { Request, Response } from 'express';
import WhatsAppClient from "./whatsAppClient";
import {jwtUsername, jwtPassword} from "./config";

export function loginUser(req: Request, res: Response) {
    const { username, password } = req.body;

    // This is just an example. In a real-world scenario, fetch this from a database.
    const user: Record<string, string> = {
        username: jwtUsername,
        password: jwtPassword
    };

    if (username === user.username && password === user.password) {
        const token = generateToken({ sub: user.username });
        console.log(`User login successful`);
        res.status(200).json({ "status": "Login successful", "jwtToken": token });
    } else {
        res.status(401).send({ "status": "Wrong username or password."});
    }
}

export function sendMessage(whatsAppClient: WhatsAppClient) {
    return (req: Request, res: Response) => {

        console.log("Received request to send message");

        // Check if the request body is valid
        if (!req.body.number || !req.body.text) {

            console.error("Bad Request: Missing number or text in request body");
            
            return res.status(400).json({ status: 'Bad Request',
                error: 'Missing number or text in request body, correct format {"number": "12345@c.us", "text": "message"' });
        }
        // Check if the client is ready
        else if (whatsAppClient.info) {

            const number = req.body.number; // Assuming you send number as a part of request payload
            const text = req.body.text;     // And the message text as well

            const formattedNumber = number.includes('@c.us') || number.includes('@g.us') ? number : `${number}@c.us`;

            console.log(`Sending message to ${formattedNumber}`);

            whatsAppClient.sendMessage(formattedNumber, text)
                .then(response => {
                    console.log(`Message sent to ${formattedNumber} `, response);
                    res.status(200).json({ status: `Message sent: `, response });
                })
                .catch(error => {
                    console.error(`Error sending message to ${formattedNumber}: `, error);
                    res.status(500).json({ status: `Error sending message to ${formattedNumber}: `, error });
                });
        } else {
            console.log(`Message not sent: WhatsApp client not ready`);
            res.status(503).json({ status: 'WhatsApp client not ready' });
        }
    };
}

export function getChatIdByName(whatsAppClient: WhatsAppClient) {
    return (req: Request, res: Response) => {
        if (!req.body.name) {
            return res.status(400).json({ status: 'Bad Request', error: 'Missing name in request body, correct format {"name": "John Doe"}' });
        }
        else if (whatsAppClient.info) {
            whatsAppClient.getChatIdByName(req.body.name).then(chatIds => {
                res.status(200).json({ status: 'Successful', chatIds });
            });
        }
    };
}