import WhatsAppClient from "./whatsAppClient";
import {errorHandler, jwtMiddleware} from "./jwtMiddleware";
import {getChatIdByName, loginUser, sendMessage} from "./routes";
import {expressPort, clientId, authDataPath} from "./config";
import express, {Express, Request, Response} from "express";

const app: Express = express();

const whatsAppClient: WhatsAppClient = new WhatsAppClient({clientId: clientId, dataPath: authDataPath});

app.use(express.json());  // for parsing application/json
app.use(jwtMiddleware());

// Routes
app.post('/login', loginUser);
app.get("/getChatIdByName", getChatIdByName(whatsAppClient));
app.post("/sendMessage", sendMessage(whatsAppClient));

// Health check
app.get('/health', (req: Request, res: Response) => {
    // Optionally, add any logic to check database connectivity, external services, etc.
    console.log("Health check request received");
    res.status(200).send('Healthy');
});

export function startServer(): void {
        console.log(`Server running at port ${expressPort}`);
        console.log("Initializing WhatsApp client...");
        whatsAppClient.initialize().catch((error: any): void => {console.error("WhatsApp client initialization failed:", error.message);});
}

app.use(errorHandler);

export default app;