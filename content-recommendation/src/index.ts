import axios, {AxiosResponse} from "axios";
import {NotionStringMessage, notionStringTemplate} from "./utils/notionStrMsg";
import {NotionContentRepository} from "./utils/notionDB";

const whatsappServiceIP: string = process.env.WHATSAPP_SERVICE_IP as string;
const whatsappServicePort: string = process.env.WHATSAPP_SERVICE_PORT as string;
const MAX_RETRIES: number = 3;
const RETRY_INTERVAL: number = 1.5 * 60 * 1000; // 1.5 minutes

async function retrySendMessage(whatsAppJwtToken: string, message: string, retries: number = 0): Promise<void> {
    while (retries++ <= MAX_RETRIES) {
        try {
            await axios.post(`http://${whatsappServiceIP}:${whatsappServicePort}/sendMessage`, {
                "number": process.env.WHATSAPP_NUMBER as string,
                "text": message
            }, {
                headers: {
                    Authorization: `Bearer ${whatsAppJwtToken}`
                }
            });
            console.log("Message sent to WhatsApp");
            return;
        } catch (error: any) {
            if (error.response.status === 503) {
                console.error("WhatsApp service is not ready, retrying in 1 minute ...");
                await new Promise(resolve => setTimeout(resolve, 60 * 1000));
            }
            else {
                console.error(`Error sending WhatsApp message on attempt ${retries} of ${MAX_RETRIES}: `, error);
                console.log(`Retrying in ${RETRY_INTERVAL / 60 / 1000} minutes ..`)
                await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
                console.log(`Retrying sending WhatsApp message on attempt ${retries} of ${MAX_RETRIES}...`);
            }
        }
    }
    throw new Error(`Reached maximum ${MAX_RETRIES} retries for sending WhatsApp message`);
}

async function main(): Promise<void> {
    let whatsAppJwtToken: string | null = null;
    try {
        const notionString: NotionStringMessage = await NotionStringMessage.createInstance(
            new NotionContentRepository(process.env.NOTION_DATABASE_ID as string), {
                tags: process.env.RESOURCE_TAGS as string,
                templateFunc: notionStringTemplate
            });

        // Authenticate with whatsapp bot
        const response: AxiosResponse<any, any> = await axios.post(
            `http://${whatsappServiceIP}:${whatsappServicePort}/login`, {
                "username": process.env.WHATSAPP_JWT_USERNAME,
                "password": process.env.WHATSAPP_JWT_PASSWORD
            });
        const whatsAppJwtToken = response.data["jwtToken"];
        console.log("Authenticated with WhatsApp bot API");


        // Send message to WhatsApp with retry
        await retrySendMessage(whatsAppJwtToken, await notionString.getMessage());

        await notionString.updatePublishedStatus();
        console.log("Updated published status in Notion, rowId:", notionString.getContentId());

        // Shutdown the whatsapp bot service
        await axios.get(`http://${whatsappServiceIP}:${whatsappServicePort}/shutdown`, {
            headers: {
                Authorization: `Bearer ${whatsAppJwtToken}`
            }
        });
    } catch (error) {
        console.error("Error running Notion Resource Recommendation Service: ", error);
    } finally {
    // Shutdown the whatsapp bot service
    // Ensure you shutdown only if you have the JWT token
        if (whatsAppJwtToken) {
        try {
            await axios.get(`http://${whatsappServiceIP}:${whatsappServicePort}/shutdown`, {
                headers: {
                    Authorization: `Bearer ${whatsAppJwtToken}`
                }
            });
        } catch (shutdownError) {
            console.error("Error shutting down WhatsApp bot service:", shutdownError);
        }
    }
}
}

main();