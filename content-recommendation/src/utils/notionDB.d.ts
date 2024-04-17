import {PageObjectResponse} from "@notionhq/client/build/src/api-endpoints";

type NotionText = {
    type: 'text';
    text: {
        content: string;
        link: null;
    };
    annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color?: string | undefined;
    };
    plain_text: string;
    href: null;
};

type NotionSelect = {
    id: string;
    type: 'select';
    select: {
        id?: string | undefined;
        name: string;
        color?: string | undefined;
    };
};

type NotionURL = {
    id: string;
    type: 'url';
    url: string;
};

type NotionDate = {
    id: string;
    type: 'date';
    date: {
        start: string;
        end?: string;  // Made optional in case you don't always have an end date
        time_zone: string;
    };
};

type NotionTitle = {
    id: string;
    type: 'title';
    title: NotionText[];
};

type NotionCheckbox = {
    id: string;
    type: 'checkbox';
    checkbox: boolean;
};

interface NotionDBRowProperties extends Record<string, any> {
    Type: NotionSelect;
    Link: NotionURL;
    "Creator/Author": NotionSelect;
    'Publish Date': NotionDate;
    Name: NotionTitle;
    Published: NotionCheckbox;
}

interface PartialNotionDBRowProperties extends Record<string, any> {
    Type?: Partial<NotionSelect>;
    Link?: Partial<NotionURL>;
    "Creator/Author"?: Partial<NotionSelect>;
    'Publish Date'?: Partial<NotionDate>;
    Name?: Partial<NotionTitle>;
    Published?: Partial<NotionCheckbox>;
}

export interface NotionDBRow extends PageObjectResponse {
    object: 'page';
    id: string;
    properties: NotionDBRowProperties;
}

export interface PartialNotionDBRow {
    object: 'page';
    id?: Partial<string>;
    properties: PartialNotionDBRowProperties;
}

