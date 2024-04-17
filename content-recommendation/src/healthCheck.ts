import axios from 'axios';
import express, {Express, Request, Response} from 'express';
const PORT: number = process.env.HEALTHCHECK_PORT as unknown as number || 3000;  // Health check server port
const whatsappServiceIP: string = process.env.WHATSAPP_SERVICE_IP as string
const whatsappServicePort: string = process.env.WHATSAPP_SERVICE_PORT as string
import {NotionContentRepository} from './utils/notionDB';

const app: Express = express();

app.get('/health', async (req: Request , res: Response): Promise<void> => {
    const healthStatus = await healthCheck();
    if (healthStatus === "Healthy") {
        res.status(200).send(healthStatus);
    } else {
        res.status(500).send(healthStatus);
    }
});

app.listen(PORT, (): void => {
    console.log(`Health check on http://localhost:${PORT}/health`);
});

async function checkWhatsAppService(): Promise<boolean> {
    try {
        await axios.get(`http://${whatsappServiceIP}:${whatsappServicePort}/health`);
        return true;
    } catch (error) {
        return false;
    }
}

async function checkNotionDatabase(): Promise<boolean> {
    try {
        const notionRepo: NotionContentRepository = new NotionContentRepository(process.env.NOTION_DATABASE_ID as string);
        await notionRepo.findByFilters({name: "HealthCheckError"}, 1, true);
        return true;
    } catch (error) {
        return false;
    }
}

async function healthCheck(): Promise<string> {
    const whatsappOK: boolean = await checkWhatsAppService();
    const notionOK: boolean = await checkNotionDatabase();

    if (whatsappOK && notionOK) {
        return "Healthy";
    }
    if (!whatsappOK) {
        return "WhatsApp service is down.";
    }
    if (!notionOK) {
        return "Notion database is inaccessible.";
    }
    return "Service is down.";
}
