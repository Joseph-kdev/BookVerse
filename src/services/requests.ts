import axios from "axios";
import {
  BestSellers,
  BookLinks,
  GoogleBook,
  ImageLinks,
  IndustryIdentifier,
} from "../types";

const bestSellersUrl: string = "https://api.nytimes.com/svc/books/v3/lists/";
const googleBooksUrl: string = "https://www.googleapis.com/books/v1/volumes";
const serverUrl: string = import.meta.env.VITE_SERVER_URL;

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
    const books = sessionStorage.getItem(`${genre}`);

    if (books) {
      return JSON.parse(books);
    }

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
    sessionStorage.setItem(`${genre}`, JSON.stringify(foundBooks));
    return foundBooks;
  } catch (error) {
    console.error("Error fetching genre", error);
    throw new Error("Failed to fetch genre");
  }
};

export const getDownloadLinks = async (
  title: string,
): Promise<BookLinks[]> => {
  try {
    const downloadLinks = sessionStorage.getItem(`${title}`);

    if (downloadLinks) {
      return JSON.parse(downloadLinks);
    }

    const response = await axios.get(`${serverUrl}/${title}`);
    console.log(response);
    const foundLinks: BookLinks[] = response.data.result.map(
      (link: {
        title: string;
        publisher: string;
        year: string;
        format: string;
        link: string;
        size: string;
        pages: string;
      }) => ({
        title: link.title,
        publisher: link.publisher,
        year: link.year,
        format: link.format,
        link: link.link,
        size: link.size,
        pages: link.pages,
      })
    );
    sessionStorage.setItem(`${title}`, JSON.stringify(foundLinks))
    return foundLinks
  } catch (error) {
    console.error("Error fetching links", error);
    throw new Error("Failed to fetch links");
  }
};
