import axios from "axios";
import {
  BestSellers,
  GoogleBook,
  ImageLinks,
  IndustryIdentifier,
} from "../types";

const bestSellersUrl: string = "https://api.nytimes.com/svc/books/v3/lists/";
const googleBooksUrl: string = "https://www.googleapis.com/books/v1/volumes";

const nyt_key = import.meta.env.VITE_NYT_API_KEY;
const google_key = import.meta.env.VITE_BOOKS_API_KEY;

export const getBestSellers = async (): Promise<BestSellers[]> => {
  try {
    const response = await axios.get(
      `${bestSellersUrl}overview.json?api-key=${nyt_key}`
    );

    const bestSellerBooks: BestSellers[] =
      response.data.results.lists[0].books.map((item: BestSellers) => ({
        title: item.title,
        author: item.author,
        book_image: item.book_image,
        description: item.description,
        primary_isbn10: item.primary_isbn10,
      }));

    return bestSellerBooks;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  }
};

export const searchBooks = async (query: string): Promise<GoogleBook[]> => {
  try {
    const response = await axios.get(
      `${googleBooksUrl}?q=${query}&api-key=${google_key}`
    );
    const foundBooks: GoogleBook[] = response.data.items.map(
      (item: {
        id: string;
        volumeInfo: {
          title: string;
          authors: string[];
          description: string;
          imageLinks: ImageLinks;
          publisher: string;
          categories: string[];
          industryIdentifiers: IndustryIdentifier;
        };
      }) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        description: item.volumeInfo.description,
        imageLinks: item.volumeInfo.imageLinks,
        publisher: item.volumeInfo.publisher,
        categories: item.volumeInfo.categories,
        isbnValue: item.volumeInfo.industryIdentifiers,
      })
    );

    return foundBooks;
  } catch (error) {
    console.error("Error fetching books", error);
    throw new Error("Failed to fetch books");
  }
};

export const getGenreBooks = async (genre: string): Promise<GoogleBook[]> => {
  try {
    const response = await axios.get(
      `${googleBooksUrl}/?q=subject:${genre}&api-key=${google_key}&orderBy=relevance&maxResults=40`
    );

    const foundBooks: GoogleBook[] = response.data.items.map(
      (item: {
        id: string;
        volumeInfo: {
          title: string;
          authors: string[];
          description: string;
          imageLinks: ImageLinks;
          publisher: string;
          categories: string[];
          industryIdentifiers: IndustryIdentifier;
        };
      }) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        description: item.volumeInfo.description,
        imageLinks: item.volumeInfo.imageLinks,
        publisher: item.volumeInfo.publisher,
        categories: item.volumeInfo.categories,
        isbnValue: item.volumeInfo.industryIdentifiers,
      })
    );

    console.log(foundBooks);

    return foundBooks;
  } catch (error) {
    console.error("Error fetching genre", error);
    throw new Error("Failed to fetch genre");
  }
};
