import {NotionStringMessage, notionStringTemplate} from "../../src/utils/notionStrMsg";
import {NotionContentRepository} from "../../src/utils/notionDB";
import {UpdatePageResponse} from "@notionhq/client/build/src/api-endpoints";

jest.mock("../../src/utils/notionDB", () => {
    return {
        NotionContentRepository: jest.fn().mockImplementation(() => {
            return {
                findByFilters: jest.fn().mockResolvedValue([{ name: "Mocked Title", url: "https://mockurl.com" }]),
                save: jest.fn().mockResolvedValue(true)
            };
        })
    };
});

describe('notionStringTemplate', () => {
    it('should format string template correctly', () => {
        const title: string = "Test Title";
        const url: string = "http://test.url";
        const result: string = notionStringTemplate(title, url);
        expect(result).toBe(`New Suggestion today:\nTitle: ${title}\nLink to Content: ${url}`);
    });
});
// Mock the NotionContentRepository


describe('NotionStringMessage', () => {
    let notionRepoMock: any;

    beforeEach(() => {
        jest.clearAllMocks();
        notionRepoMock = new NotionContentRepository('mockedDatabaseId');
    });

    it('should format message correctly', async () => {
        const messageInstance = await NotionStringMessage.createInstance(notionRepoMock, {templateFunc: notionStringTemplate });
        const message = await messageInstance.getMessage();
        expect(message).toBe("New Suggestion today:\nTitle: Mocked Title\nLink to Content: https://mockurl.com");
    });


    it('should throw an error when content is undefined for getMessage', async () => {
        // Mock notionRepoMock to return undefined for the content
        notionRepoMock.findByFilters.mockResolvedValue([]);

        await expect(NotionStringMessage.createInstance(notionRepoMock, {templateFunc: notionStringTemplate }))
            .rejects.toThrow(new Error("Error fetching NotionDB rows"));

    });

    it('should correctly update published status', async () => {
        // Mock the save method to simulate a successful update
        notionRepoMock.save.mockResolvedValue(true);

        const messageInstance: NotionStringMessage = await NotionStringMessage.createInstance(notionRepoMock, {templateFunc: notionStringTemplate });

        const updateResponse: UpdatePageResponse = await messageInstance.updatePublishedStatus();
        expect(updateResponse).toBeTruthy(); // Assuming that the mock resolves with a true value for successful updates
    });
});