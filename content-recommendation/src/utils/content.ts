type contentOptions = {
    id?: string;
    name: string;
    url?: string;
    type?: string;
    creator?: string;
    publishDate?: Date;
    isPublished?: boolean;
}

export class Content {
    id?: string;
    type: string;
    url: string;
    publishDate: Date;
    name: string;
    creator: string;
    isPublished: boolean;

    constructor(options: contentOptions) {
        this.id = options.id;
        this.name = options.name;
        this.url = options.url || "";
        this.type = options.type || "";
        this.creator = options.creator || "";
        this.publishDate = options.publishDate || new Date();
        this.isPublished = options.isPublished || false;
    }
}
