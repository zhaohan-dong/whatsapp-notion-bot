import {Client, LocalAuth} from 'whatsapp-web.js';
import qrcode from "qrcode-terminal";

// Using hotfix to fix login issue as of ^1.22.1: https://github.com/pedroslopez/whatsapp-web.js/issues/2433

interface WhatsAppClientOptions { clientId?: string, dataPath?: string }

class WhatsAppClient extends Client {
    constructor(options: WhatsAppClientOptions) {
        super({authStrategy: new LocalAuth({clientId: options.clientId, dataPath: options.dataPath}), puppeteer: {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']}});
        this.on('qr', (qr) => {
            console.log("Authentication: Scan QR code with your WhatsApp mobile app")
            qrcode.generate(qr, {small: true});
        });

        this.on('authenticated', () => {
            console.log('WhatsApp client is authenticated');
        });

        this.on('auth_failure', msg => {
            // Fired if session restore was unsuccessful
            console.error('WhatsApp Client authentication failure: ', msg);
        });

        // this.on('message', this.handleNewMessage);
    }

    async initialize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // If the client is ready, resolve the promise
            this.on('ready', () => {
                console.log('WhatsApp Client is initialized');
                resolve();
            });

            // If the client isn't ready within a minute, reject the promise
            setTimeout(() => {
                if (!this.info) {
                    console.error("Timeout after waiting for WhatsApp to authenticate for 1 minute");
                    reject(new Error('Timeout after waiting for WhatsApp to authenticate for 1 minute'));
                }
            }, 60000);

            super.initialize();
        });
    }

    destroy(): Promise<void> {
        return super.destroy();
    }

    // private handleNewMessage = (message: any): void => {
    //     if (message.isNewMsg && message.chat.id._serialized === "120363148180188997@g.us") {
    //         console.log("New message received from " + message.from);
    //         //this.sendMessageToWebhook(message);
    //     }
    // }
    //
    // // TODO: implement webhook with url
    // private async sendMessageToWebhook(message: any) {
    //     const webhook_url: string = 'YOUR_WEBHOOK_URL_HERE';
    //
    //     try {
    //         const response = await axios.post(webhook_url, {
    //             chatId: message.id._serialized,
    //             body: message.body,
    //             from: message.from
    //             // Add any other desired message properties here
    //         });
    //
    //         console.log(response.data);
    //     } catch (error) {
    //         console.error('Error sending message to webhook:', error);
    //     }
    // }

    async getChatIdByName(targetName: string): Promise<string[]> {
        let chatIds: string[] = [];
        return this.getChats().then(chats => {
            chats.forEach(chat => {
                if (chat.name === targetName) {  // Check if the chat name matches the target name
                    chatIds.push(chat.id._serialized);
                }
            });
            return chatIds;
        });
    }
}

export default WhatsAppClient;