import {Client} from '@notionhq/client';
import {
    QueryDatabaseResponse, PageObjectResponse, UpdatePageResponse, GetPageResponse, CreatePageResponse
} from "@notionhq/client/build/src/api-endpoints";
import {NotionDBRow, PartialNotionDBRow} from "./notionDB.d";
import {Content} from "./content";

const NOTION_API_KEY: string = process.env.NOTION_API_KEY as string;

export class NotionContentMapper {
    toNotionRow(content: Content): PartialNotionDBRow {
        return {
            object: "page", id: content.id, properties: {
                Name: {
                    type: 'title', title: [{
                        type: 'text', text: {content: content.name, link: null}, annotations: {
                            bold: false,
                            italic: false,
                            strikethrough: false,
                            underline: false,
                            code: false,
                            color: 'default'
                        }, plain_text: content.name, href: null
                    }]
                }, Link: {
                    type: 'url', url: content.url
                }, Type: {
                    type: 'select',
                    select: {id: undefined, name: content.type, color: undefined}
                }, "Creator/Author": {
                    type: 'select',
                    select: {id: undefined, name: content.creator, color: undefined}
                }, 'Publish Date': {
                        type: 'date', date: {
                            start: content.publishDate.toISOString(), end: undefined,  // Assuming no end date, should be undefined, not empty string
                            time_zone: "UTC"
                        }
                }, Published: {
                    type: 'checkbox', checkbox: content.isPublished
                }
            }
        };
    }

    fromNotionRow(row: NotionDBRow): Content {
        return {
            id: row.id,
            name: row.properties.Name.title[0].plain_text,
            url: row.properties.Link.url,
            type: row.properties.Type.select.name,
            creator: row.properties["Creator/Author"].select.name,
            publishDate: new Date(row.properties['Publish Date'].date.start),
            isPublished: row.properties.Published.checkbox
        };
    }
}

// noinspection JSUnusedGlobalSymbols
export class NotionContentRepository {
    private mapper: NotionContentMapper = new NotionContentMapper();
    private notionClient: Client;

    constructor(private databaseId: string, private filterConstructor: FilterConstructor = new NotionDBFilterConstructor()) {
        this.notionClient = new Client({auth: NOTION_API_KEY});
    }

    async findById(id: string): Promise<Content> {
        const row: GetPageResponse = await this.notionClient.pages.retrieve({page_id: id});
        if (!this.isNotionDBRow(row)) {
            console.error("Invalid or partial Notion page response or missing properties.", row);
            throw new Error('Invalid or partial Notion page response or missing properties.');
        }
        console.log("Fetched row ", row.id, " from Notion database")
        return this.mapper.fromNotionRow(row as NotionDBRow);
    }

    async findByFilters(filters: NotionFilterCriteria, maxPages: number, sortDateAsc: boolean = false): Promise<Content[]> {

        let allResults: PageObjectResponse[] = [];
        let hasNext: boolean = true;
        let cursor: string | undefined = undefined;

        while (hasNext && (typeof maxPages === 'undefined' || maxPages > 0)) {
            const res: QueryDatabaseResponse = await this.notionClient.databases.query({
                database_id: this.databaseId, filter: this.filterConstructor.construct(filters), sorts: [{
                    property: "Publish Date", direction: sortDateAsc ? "ascending" : "descending"
                }], start_cursor: cursor
            });

            const validResults: PageObjectResponse[] = res.results.filter(this.isNotionDBRow);
            allResults.push(...validResults);

            hasNext = res.has_more;

            if (typeof maxPages !== 'undefined') {
                maxPages--;
            }

            if (hasNext && res.next_cursor) {
                console.log("Fetching next response page from Notion database, cursor: ", res.next_cursor);
                cursor = res.next_cursor;
            }
        }
        console.log("Fetched", allResults.length, "row(s) from Notion database");
        return allResults.map((entry: PageObjectResponse) => this.mapper.fromNotionRow(entry as NotionDBRow));
    }

    async save(content: Content): Promise<UpdatePageResponse | CreatePageResponse> {
        const rowFormat: PartialNotionDBRow = this.mapper.toNotionRow(content);
        if (content.id) {
            // Update existing content
            return await this.notionClient.pages.update({
                page_id: content.id, properties: rowFormat.properties
            }).then((response: UpdatePageResponse): UpdatePageResponse => {
                return response
            });
        } else {
            // Create new content
            return await this.notionClient.pages.create({
                parent: {database_id: this.databaseId}, properties: rowFormat.properties
            }).then((response: CreatePageResponse): CreatePageResponse => {
                return response
            });
        }
    }

    // Check if the provided object is a valid Notion PageObjectResponse, since it's possible to get a PartialPageObjectResponse
    private isNotionDBRow(obj: any): obj is PageObjectResponse {
        return obj && obj.object === 'page' && typeof obj.id === 'string' && 'properties' in obj && 'Link' in obj.properties && 'Publish Date' in obj.properties && 'Name' in obj.properties && 'Published' in obj.properties && "Type" in obj.properties && "Creator/Author" in obj.properties;
    }
}

interface FilterConstructor {
    construct(filters: any): any;
}

type NotionFilterCriteria = {
    name?: string; publishDateBefore?: string; published?: boolean;
};

export class NotionDBFilterConstructor implements FilterConstructor {
    construct(inputFilters: NotionFilterCriteria): any {
        let filters: any[] = [];

        if (inputFilters.name) {
            filters.push({
                property: "Resource", rich_text: {
                    equals: inputFilters.name
                }
            });
        }

        if (inputFilters.publishDateBefore) {
            filters.push({
                property: "Publish Date", date: {
                    before: inputFilters.publishDateBefore
                }
            });
        }

        if (inputFilters.published !== undefined) {
            filters.push({
                property: "Published", checkbox: {
                    equals: inputFilters.published
                }
            });
        }

        console.log("Filter Notion Database by:", filters)

        if (filters.length > 1) {
            return {
                and: filters
            };
        } else if (filters.length == 0) {
            throw new Error("No filters provided");
        } else {
            return filters[0];
        }
    }
}