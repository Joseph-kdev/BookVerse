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
export interface GoogleBook {
    id: string;
    title: string;
    authors?: string[];
    description: string;
    imageLinks?: imageLinks;
    publisher: string;
    categories: string[];
}

export interface User {
    email: string;
    password: string;
    hasAccount: boolean;
}