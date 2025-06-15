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
    isbnValue: IndustryIdentifier[] | null;
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

export interface BookLinks {
    title: string;
    publisher: string;
    year: string;
    format: string;
    link: string;
    size: string;
    pages: string;
}