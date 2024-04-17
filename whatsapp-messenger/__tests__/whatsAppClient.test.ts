import axios from 'axios';
import qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import WhatsAppClient from '../src/whatsAppClient';

jest.mock('whatsapp-web.js');
jest.mock('qrcode-terminal');
jest.mock('axios');

describe('WhatsAppClient', () => {
    let client: WhatsAppClient;

    beforeEach(() => {
        (axios.post as jest.Mock).mockResolvedValue({ data: 'mockData' });
        client = new WhatsAppClient({ clientId: 'testClientId', dataPath: 'testDataPath' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should reject when client is not ready within a minute', async () => {
        jest.useFakeTimers();
        client.on('ready', () => {});  // Prevent ready from being called

        const initializePromise = client.initialize();

        jest.advanceTimersByTime(60000);  // Fast forward time

        await expect(initializePromise).rejects.toThrow('Timeout after waiting for WhatsApp to authenticate for 1 minute');
    });

    it('should reject the initialization promise if not ready in 1 minute', async () => {
        jest.useFakeTimers();

        const initPromise = client.initialize();
        jest.runAllTimers();

        await expect(initPromise).rejects.toThrow("Timeout after waiting for WhatsApp to authenticate for 1 minute");

        jest.useRealTimers();
    });

    it('should get chat IDs by name', async () => {
        // Mocking `getChats` method to return mock chats
        (client.getChats as jest.Mock).mockResolvedValue([
            { name: 'TestChat1', id: { _serialized: 'chatId1' } },
            { name: 'TestChat2', id: { _serialized: 'chatId2' } },
        ]);

        const chatIds = await client.getChatIdByName('TestChat1');
        expect(chatIds).toEqual(['chatId1']);
    });
});
