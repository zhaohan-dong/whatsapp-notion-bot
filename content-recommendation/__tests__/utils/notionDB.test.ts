import {Content} from '../../src/utils/content';
import {NotionContentMapper, NotionContentRepository, NotionDBFilterConstructor} from '../../src/utils/notionDB';
import {NotionDBRow, PartialNotionDBRow} from '../../src/utils/notionDB.d';
import {PageObjectResponse, PartialPageObjectResponse} from "@notionhq/client/build/src/api-endpoints";

// At the top of your file
const mockRetrieve: jest.Mock = jest.fn();
const mockUpdate: jest.Mock = jest.fn();
const mockCreate: jest.Mock = jest.fn();
const mockQuery: jest.Mock = jest.fn();

// noinspection SpellCheckingInspection
jest.mock('@notionhq/client', () => ({
    Client: jest.fn().mockImplementation(() => ({
        pages: {
            retrieve: mockRetrieve, update: mockUpdate, create: mockCreate
        }, databases: {
            query: mockQuery
        }
    })),
}));

describe('NotionContentMapper', () => {
    const mapper: NotionContentMapper = new NotionContentMapper();

    const dummyContent: Content = new Content({
        id: "123",
        name: "Test Title",
        url: "https://example.com",
        type: "tag1",
        creator: "creator1",
        publishDate: new Date("2022-01-01T00:00:00Z"),
        isPublished: true
    });
    const dummyNotionDBRow: NotionDBRow = {
        id: "123", object: "page", properties: {
            "Name": {
                id: "123", type: "title", title: [{
                    type: "text", text: {
                        content: "Test Title", link: null
                    }, annotations: {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: "default"
                    }, plain_text: "Test Title", href: null
                }]
            }, "Link": {id: "123", type: "url", url: "https://example.com"},

            "Type": {
                id: "123",
                type: "select",
                select: {id: undefined, name: "tag1", color: undefined}
            },
            "Creator/Author": {
                id: "123",
                type: "select",
                select: {id: undefined, name: "creator1", color: undefined}
            },
            "Publish Date": {
                id: "123", type: "date", date: {start: "2022-01-01T00:00:00.000Z", end: undefined, time_zone: "UTC"}
            }, "Published": {id: "123", type: "checkbox", checkbox: true}
        }, parent: {
            type: 'database_id', database_id: ''
        }, icon: null, cover: null, created_by: {
            id: '', object: 'user'
        }, last_edited_by: {
            id: '', object: 'user'
        }, created_time: '', last_edited_time: '', archived: false, url: '', public_url: null
    };
    const expectedNotionDBRow: PartialNotionDBRow = {
        "id": "123", "object": "page", "properties": {
            "Publish Date": {
                "type": "date", "date": {
                    "start": "2022-01-01T00:00:00.000Z", "end": undefined, "time_zone": "UTC"
                },
            }, "Published": {
                "type": "checkbox", "checkbox": true,
            }, "Name": {
                "type": "title", "title": [{
                    "type": "text", "text": {content: "Test Title", link: null}, "annotations": {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: "default"
                    }, plain_text: "Test Title", href: null
                }]
            }, "Type": {
                "type": "select",
                "select": {id: undefined, name: "tag1", color: undefined }
            }, "Creator/Author": {
                "type": "select",
                "select": {id: undefined, name: "creator1", color: undefined}
            },
            "Link": {
                "type": "url", "url": "https://example.com"
            },
        }
    };

    it('should map from NotionDBRow to Content', () => {
        const mappedContent: Content = mapper.fromNotionRow(dummyNotionDBRow);
        expect(mappedContent).toEqual(dummyContent);
    });

    it('should map from Content to NotionDBRow', () => {
        const mappedNotionDBRow: PartialNotionDBRow = mapper.toNotionRow(dummyContent);
        expect(mappedNotionDBRow).toEqual(expectedNotionDBRow);
    });
});

describe('NotionDBFilterConstructor', () => {

    it("should construct a filter for a single tag", () => {
        const filterConstructor: NotionDBFilterConstructor = new NotionDBFilterConstructor();
        const filterTitle: any = filterConstructor.construct({name: "title"});
        const filterPublishDate: any = filterConstructor.construct({publishDateBefore: "2022-01-01T00:00:00Z"});
        const filterPublished: any = filterConstructor.construct({published: true});
        const filterAll: any = filterConstructor.construct({
            name: "title", publishDateBefore: "2022-01-01T00:00:00Z", published: true
        });
        expect(filterTitle).toEqual({
            property: "Resource", rich_text: {
                equals: "title"
            }
        });
        expect(filterPublishDate).toEqual({
            property: "Publish Date", date: {
                before: "2022-01-01T00:00:00Z"
            }
        });
        expect(filterPublished).toEqual({
            property: "Published", checkbox: {
                equals: true
            }
        });
        expect(filterAll).toEqual({
            and: [{
                property: "Resource", rich_text: {
                    equals: "title"
                }
            }, {
                property: "Publish Date", date: {
                    before: "2022-01-01T00:00:00Z"
                }
            }, {
                property: "Published", checkbox: {
                    equals: true
                }
            }]
        });
    });
});

describe('NotionContentRepository', () => {
    let repo: NotionContentRepository;
    const mockId: string = 'mockId';
    const mockResponse: PageObjectResponse = {
        object: 'page',
        id: mockId,
        created_time: new Date().toISOString(),
        last_edited_time: new Date().toISOString(),
        archived: false,
        properties: {
            "Name": {
                id: 'resourceId', type: 'title', title: [{
                    type: 'text', text: {content: 'mockTitle', link: null}, annotations: {
                        bold: false,
                        italic: false,
                        strikethrough: false,
                        underline: false,
                        code: false,
                        color: "default"
                    }, plain_text: 'mockTitle', href: null
                }]
            }, "Link": {
                id: 'urlId', type: 'url', url: 'https://mockurl.com'
            },

            "Type": {
                id: 'tagId', type: 'select', select: {id: '1', name: 'tag1', color: 'default'}
            },
            "Creator/Author": {
                id: 'creatorId', type: 'select', select: {id: '1', name: 'creator1', color: 'default'}
            },
            'Publish Date': {
                id: 'dateId', type: 'date', date: {start: new Date().toISOString(), end: "", time_zone: "UTC"}
            }, "Published": {
                id: 'checkboxId', type: 'checkbox', checkbox: true
            }
        },
        parent: {
            type: 'database_id', database_id: 'mockDatabaseId',
        },
        icon: {
            type: 'emoji', emoji: '📘'
        },
        cover: {
            type: 'external', external: {
                url: 'https://mockcover.com'
            }
        },
        created_by: {
            object: 'user', id: 'mockPersonId'
        },
        last_edited_by: {
            object: 'user', id: 'mockEditorId'
        },
        url: 'https://mockpageurl.com',
        public_url: 'https://mockpublicurl.com'
    };
    const mockUpdateResponse = {
        object: 'page', id: 'updatedMockId', // ... other properties of the updated page ...
    };

    const mockCreateResponse = {
        object: 'page', id: 'newMockId', // ... other properties of the new page ...
    };

    beforeEach(() => {
        repo = new NotionContentRepository('mockDatabaseId', new NotionDBFilterConstructor());

        // Clear any previous mock calls
        mockRetrieve.mockClear();
        mockUpdate.mockClear();
        mockCreate.mockClear();
        mockQuery.mockClear();
    });

    describe('findById method', (): void => {

        it('should find by ID successfully', async (): Promise<void> => {
            // Given
            mockRetrieve.mockResolvedValue(mockResponse);

            // When
            const result: Content = await repo.findById(mockId);

            // Then
            expect(result).toBeDefined();
            expect(result.name).toEqual('mockTitle');
            expect(result.url).toEqual('https://mockurl.com');
            expect(result.type).toContain('tag1');
            expect(result.creator).toContain('creator1');
            expect(mockRetrieve).toHaveBeenCalledWith({page_id: mockId});
        });

        it('should throw error for invalid page response', async () => {
            // Given
            const mockId = '123';
            mockRetrieve.mockResolvedValue({}); // Mocking an invalid response

            // When & Then
            await expect(repo.findById(mockId)).rejects.toThrow('Invalid or partial Notion page response or missing properties.');
        });
    });

    describe('save method', (): void => {
        beforeEach((): void => {
            mockUpdate.mockResolvedValue(mockUpdateResponse);
            mockCreate.mockResolvedValue(mockCreateResponse);
            mockUpdate.mockClear();
            mockCreate.mockClear();
        });

        it('should update content if ID is provided', async (): Promise<void> => {
            const contentWithId: Content = {
                id: mockId,
                name: 'MockTitle',
                url: 'https://mockurl.com',
                type: 'tag1',
                creator: 'creator1',
                publishDate: new Date(),
                isPublished: true
            };

            const result: PageObjectResponse | PartialPageObjectResponse = await repo.save(contentWithId);

            expect(result).toEqual(mockUpdateResponse);
            expect(mockUpdate).toHaveBeenCalled(); // Can update to have been called with the correct parameters

        });

        it('should create new content if ID is not provided', async (): Promise<void> => {
            const contentWithoutId: Content = {
                type: 'tag1',
                creator: 'creator1',
                name: 'NewMockTitle',
                url: 'https://mockurl.com',
                publishDate: new Date(),
                isPublished: true
            };

            const result: PageObjectResponse | PartialPageObjectResponse = await repo.save(contentWithoutId);

            expect(result).toEqual(mockCreateResponse);
            expect(mockCreate).toHaveBeenCalled();  // Can update to have been called with the correct parameters
        });
    });
});
