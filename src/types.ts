export interface BestSellers {
    title: string;
    author: string;
    book_image: string;
    description: string;
    primary_isbn10: string;
}

export interface imageLinks {
    smallThumbnail: string;
    thumbnail: string;
}

interface IndustryIdentifier {
    type: string;
    identifier: string;
}
export interface GoogleBook {
    id: string;
    title: string;
    authors?: string[];
    description: string;
    imageLinks?: imageLinks;
    publisher?: string;
    categories: string[];
    isbnValue: IndustryIdentifier[];
}

export interface User {
    email: string;
    password: string;
    hasAccount: boolean;
}