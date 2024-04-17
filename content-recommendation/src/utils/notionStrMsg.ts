import {UpdatePageResponse} from "@notionhq/client/build/src/api-endpoints";
import {NotionContentRepository} from "./notionDB";
import {Content} from "./content";

export type TemplateFunction = (title: string, url: string) => string;
type NotionStringMessageInput = {
    tags?: string | string[] | undefined,
    templateFunc?: TemplateFunction
};

// Template for custom messages
export const notionStringTemplate: TemplateFunction = (title: string, url: string): string => {
    return `New Suggestion today:\nTitle: ${title}\nLink to Content: ${url}`;
}

// noinspection ExceptionCaughtLocallyJS
export class NotionStringMessage {

    private readonly templateFunc: TemplateFunction;
    private readonly tags: string | string[] | undefined; // Optional tags to make filtering by tag easier
    private content: Content | undefined;

    constructor(private notionDBRepository: NotionContentRepository, options: NotionStringMessageInput) {
        this.templateFunc = options.templateFunc || notionStringTemplate;
        this.tags = options.tags || undefined;
    }

    public static async createInstance(notionDBRepository: NotionContentRepository, input: NotionStringMessageInput): Promise<NotionStringMessage> {
        const instance: NotionStringMessage = new NotionStringMessage(notionDBRepository, input);
        await instance.init();
        return instance;
    }

    async getMessage(): Promise<string> {
        if (this.content === undefined) {
            console.error("Cannot get message from undefined Content")
            throw new Error("Cannot get message from undefined Content");
        } else {
            const title: string = this.content.name;
            const url: string = this.content.url;
            return this.templateFunc(title, url);
        }
    }

    async updatePublishedStatus(): Promise<UpdatePageResponse> {
        // Deep copy the content object to avoid modifying the original object
        const newContent: Content = this.getContent();
        // Set the published status to true
        newContent.isPublished = true;

        console.log("Updating row status to published in Notion database");
        return await this.notionDBRepository.save(newContent);
    }

    public getContentId(): string | undefined {
        return this.getContent().id;
    }

    public getContent(): Content {
        if (this.content === undefined) {
            console.error("Content is undefined");
            throw new Error("Cannot get message from undefined Content");
        } else {
            return this.content;
        }
    }

    private async init(): Promise<void> {
        try {

            this.content = await this.readOldestUnpublishedRow();

            if (!this.content) {
                console.error("No row fetched from NotionDB");
                throw new Error("No row fetched from NotionDB");
            }

        } catch (error) {
            console.error("Error initializing NotionStringMessage:", error);
            throw new Error("Error fetching NotionDB rows");
        }
    }

    private async readOldestUnpublishedRow(): Promise<Content> {
        const contents: Content[] = await this.notionDBRepository.findByFilters({publishDateBefore: new Date().toJSON(), published: false
        }, 1, true);

        return contents[0];
    }
}