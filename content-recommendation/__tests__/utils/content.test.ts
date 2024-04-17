import { Content } from '../../src/utils/content';

describe('Content', () => {
    it('should initialize with provided values', () => {
        const content = new Content({id: '123', name: 'Test Title', url: 'https://example.com', type: 'tag1', creator: "creator1", publishDate: new Date('2023-08-30T00:00:00Z'), isPublished: true});

        expect(content.id).toBe('123');
        expect(content.name).toBe('Test Title');
        expect(content.url).toBe('https://example.com');
        expect(content.type).toEqual('tag1');
        expect(content.creator).toEqual('creator1');
        expect(content.publishDate).toEqual(new Date('2023-08-30T00:00:00Z'));
        expect(content.isPublished).toBe(true);
    });

    it('should initialize with default values', () => {
        const content = new Content({name: 'Another Title'});

        const currentDate = new Date();

        expect(content.id).toBe(undefined);
        expect(content.name).toBe('Another Title');
        expect(content.url).toBe('');
        expect(content.type).toEqual("");
        expect(content.creator).toEqual("");
        expect(content.publishDate.getDate()).toBe(currentDate.getDate()); // Checking if the default date is today
        expect(content.isPublished).toBe(false);
    });
});
