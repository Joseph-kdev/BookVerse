import axios from "axios";
import {
  BestSellers,
  BookLinks,
  GoogleBook,
  ImageLinks,
  IndustryIdentifier,
  StatusEnum,
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

export const getDownloadLinks = async (title: string): Promise<BookLinks[]> => {
  try {
    const downloadLinks = sessionStorage.getItem(`${title}`);

    if (downloadLinks) {
      return JSON.parse(downloadLinks);
    }

    const response = await axios.get(
      `${serverUrl}/api/books/download_link?title=${title}`
    );
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
    sessionStorage.setItem(`${title}`, JSON.stringify(foundLinks));
    return foundLinks;
  } catch (error) {
    console.error("Error fetching links", error);
    throw new Error("Failed to fetch links");
  }
};

export const chatAboutBook = async ({
  title,
  author,
  message,
  sessionId,
  onChunk,
  onComplete,
  onError,
}: {
  title: string;
  author: string;
  message: string;
  sessionId: string;
  onChunk: (text: string, sessionId: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}) => {
  try {
    const response = await fetch(`${serverUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author, message, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType?.includes("text/event-stream")) {
      throw new Error("Expected event-stream response");
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Unable to read response stream");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr.trim() === "") continue;

            try {
              const data = JSON.parse(dataStr);

              if (currentEvent === "end") {
                onComplete();
                return;
              } else if (currentEvent === "error") {
                onError(data.error || "Stream error occurred");
                return;
              } else if (data.text && data.sessionId) {
                onChunk(data.text, data.sessionId);
              }
            } catch (error) {
              console.warn("Failed to parse SSE data:", error);
            }
            currentEvent = "";
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.log("Error in chat", error);
    onError(error instanceof Error ? error.message : "Unknown error occurred");
  }
};

const getUser = async (userId: string) => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/users/get_user?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error finding user", error);
    return null;
  }
};

export const addUser = async ({
  userId,
  email,
}: {
  userId: string;
  email: string | null;
}) => {
  const foundUser = await getUser(userId);
  if (foundUser) {
    return foundUser;
  }
  const response = await axios.post(`${serverUrl}/api/users/add_user`, {
    userId: userId,
    email: email,
  });
  return response.data;
};

export const getBookFromDb = async (bookId: string) => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/books/get_book?bookId=${bookId}`
    );

    if (response.status != 200) {
      return null;
    }
    console.log("book returned", response);
    return response.data;
  } catch (error) {
    console.log("Error finding book", error);
    return null;
  }
};

export const addBookToDb = async ({
  id,
  title,
  authors,
  description,
  imageLinks,
  publisher,
  categories,
  isbnValue,
}: GoogleBook) => {
  const book = await getBookFromDb(id);
  if (book) {
    return book;
  }
  const response = await axios.post(`${serverUrl}/api/books/add_book`, {
    id,
    title,
    authors,
    description,
    imageLinks,
    publisher,
    categories,
    isbnValue,
  });
  console.log("added book to db", response);
  return response.data;
};

export const saveBookToLibrary = async ({
  userId,
  bookId,
  status,
}: {
  userId: string | undefined;
  bookId: string;
  status: StatusEnum;
}) => {
  if (!userId) {
    throw new Error("User not found");
  }
  if (!bookId) {
    throw new Error("Book not found");
  }

  const response = await axios.post(
    `${serverUrl}/api/books/update_book_status`,
    { userId, bookId, status }
  );
  return response.data;
};

export const removeBookFromLibrary = async ({
  userId,
  bookId,
}: {
  userId: string | undefined;
  bookId: string;
}) => {
  if (!userId) {
    throw new Error("User not found");
  }
  if (!bookId) {
    throw new Error("Book not found");
  }

  const response = await axios.post(
    `${serverUrl}/api/books/remove_book_status`,
    { userId, bookId }
  );
  return response.data;
};

export const checkStatus = async ({
  userId,
  bookId,
}: {
  userId: string;
  bookId: string;
}) => {
  if (!userId) {
    throw new Error("User not found");
  }
  if (!bookId) {
    throw new Error("Book not found");
  }

  const response = await axios.get(
    `${serverUrl}/api/books/check_status/${userId}/${bookId}`
  );
  return response.data;
};

export const toggleFavorite = async ({
  userId,
  bookId,
}: {
  userId: string;
  bookId: string;
}) => {
  if (!userId) {
    throw new Error("User not found");
  }
  if (!bookId) {
    throw new Error("Book not found");
  }
  const response = await axios.post(`${serverUrl}/api/books/toggle_favorite`, {
    userId,
    bookId,
  });
  console.log("changed favorite state");
  return response.data;
};

export const checkFavorite = async ({
  userId,
  bookId,
}: {
  userId: string;
  bookId: string;
}) => {
  if (!userId) {
    throw new Error("User not found");
  }
  if (!bookId) {
    throw new Error("Book not found");
  }
  const response = await axios.get(
    `${serverUrl}/api/books/check_favorite/${userId}/${bookId}`
  );
  return response.data;
};

export const getUserBooks = async(userId: string | undefined) => {
  if(!userId) {
    throw new Error("No user Id found");
  }
  const response = await axios.get(`${serverUrl}/api/books/get_user_books/${userId}`)
  return response.data
}

export const getFavorites = async(userId: string | undefined) => {
  if(!userId) {
    throw new Error("No user Id found")
  }
  const response = await axios.get(`${serverUrl}/api/books/get_favorites/${userId}`)
  return response.data
}