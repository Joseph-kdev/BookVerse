export interface BestSellers {
    title: string;
    author: string;
    book_image: string;
    description: string;
    primary_isbn10: string;
}

export interface ImageLinks {
    smallThumbnail: string;
    thumbnail: string;
}

export interface IndustryIdentifier {
    type: string;
    identifier: string;
}
export interface GoogleBook {
    id: string;
    title: string;
    authors: string[];
    description: string;
    imageLinks?: ImageLinks;
    publisher?: string;
    categories: string[];
    isbnValue: (IndustryIdentifier | string)[] | null;
}

export interface User {
    uid?: string;
    email?: string;
    displayName?: string;
    password: string;
    hasAccount: boolean;
}

export interface Genres {
    "our-picks": string[];
    "popular-genres": string[];
    "other-genres": string[]
}

export type ReadingLinkAccess = "download" | "read" | "borrow" | "preview";

export interface ReadingLink {
    source: string;
    access: ReadingLinkAccess;
    format: string;
    url: string;
    label: string;
}

export interface ReadingLinksResult {
    links: ReadingLink[];
    /** true when no free legal source was found and only a Google Books preview is returned */
    isFallback: boolean;
}

export type StatusEnum = "reading" | "reading_list" | "completed";