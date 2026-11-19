import axios from "axios";
import {
  BestSellers,
  GoogleBook,
  ReadingLinksResult,
  StatusEnum,
} from "../types";
import { Review } from "../components/Reviews";
import { auth } from "../config/firebase-config";

const bestSellersUrl: string = "https://api.nytimes.com/svc/books/v3/lists/";
const serverUrl: string = import.meta.env.VITE_SERVER_URL;
// const serverUrl = "http://localhost:3001"

const nyt_key = import.meta.env.VITE_NYT_API_KEY;

/**
 * Builds the Authorization header for protected endpoints.
 *
 * Firebase ID tokens expire after one hour, so instead of caching the token
 * once at login we ask Firebase for it on every request. `getIdToken()` returns
 * the cached token and transparently refreshes it when it is about to expire.
 * `authStateReady()` waits for Firebase to restore a persisted session on page
 * load, which avoids "User is not authenticated" errors from early requests.
 */
const authHeaders = async () => {
  await auth.authStateReady();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User is not authenticated");
  }

  const token = await currentUser.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

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

export const searchBooks = async (query: string): Promise<GoogleBook[] | null> => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/books/search?book=${encodeURIComponent(query)}`
    );

    if (response.status !== 200) {
      return null
    }

    return response.data
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
      `${serverUrl}/api/books/fetch_by_genre/${encodeURIComponent(genre)}`
    );

    const foundBooks: GoogleBook[] = response.data.map((item: any) => ({
      id: item.Books.id,
      title: item.Books.title,
      authors: item.Books.authors,
      description: item.Books.description,
      imageLinks: item.Books.imageLinks,
      publisher: item.Books.publisher,
      categories: item.Books.categories,
      isbnValue: item.Books.isbnValue,
    }));

    sessionStorage.setItem(`${genre}`, JSON.stringify(foundBooks));
    return foundBooks;
  } catch (error) {
    throw new Error(`Failed to fetch genre ${error}`);
  }
};

/**
 * Legal free reading/download links (Project Gutenberg, Standard Ebooks,
 * Internet Archive, Open Library, public-domain Google Books), falling back
 * to a Google Books preview when none are available.
 */
export const getReadingLinks = async (
  book: Pick<GoogleBook, "id" | "title" | "authors" | "isbnValue">
): Promise<ReadingLinksResult> => {
  const cacheKey = `reading-links-${book.id}`;
  const cached = sessionStorage.getItem(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const isbns = (book.isbnValue ?? [])
    .map((value) => (typeof value === "string" ? value : value?.identifier))
    .filter(Boolean)
    .join(",");

  const response = await axios.get<ReadingLinksResult>(
    `${serverUrl}/api/books/reading_links/${encodeURIComponent(book.id)}`,
    {
      params: {
        title: book.title,
        author: book.authors?.[0],
        isbn: isbns || undefined,
      },
    }
  );

  sessionStorage.setItem(cacheKey, JSON.stringify(response.data));
  return response.data;
};

/**
 * Loads a book by its Google Books volume id (database first, then Google).
 * Used when the book page is opened directly, refreshed or shared.
 */
export const getBookDetails = async (bookId: string): Promise<GoogleBook | null> => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/books/details/${encodeURIComponent(bookId)}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const describeRetryAfter = (seconds: number) => {
  if (seconds < 90) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 90) return `${minutes} minutes`;
  return `${Math.ceil(minutes / 60)} hours`;
};

/**
 * Streams a reply from the book assistant.
 * The server is stateless: the conversation lives on the client and the
 * previous turns are sent as `history` with every message.
 */
export const chatAboutBook = async ({
  title,
  author,
  message,
  history,
  signal,
  onChunk,
  onComplete,
  onError,
}: {
  title: string;
  author: string;
  message: string;
  history: ChatTurn[];
  signal?: AbortSignal;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}) => {
  try {
    const response = await fetch(`${serverUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeaders()),
      },
      body: JSON.stringify({ title, author, message, history }),
      signal,
    });

    if (!response.ok) {
      let serverMessage = "";
      try {
        serverMessage = (await response.json())?.error ?? "";
      } catch {
        // response wasn't JSON
      }

      if (response.status === 401) {
        throw new Error("Please log in again to chat about this book.");
      }
      if (response.status === 429) {
        const retryAfter = Number(response.headers.get("Retry-After"));
        throw new Error(
          Number.isFinite(retryAfter) && retryAfter > 0
            ? `You're sending messages too quickly. Try again in ${describeRetryAfter(retryAfter)}.`
            : serverMessage || "You're sending messages too quickly. Please try again later."
        );
      }
      throw new Error(serverMessage || `HTTP ${response.status}: ${response.statusText}`);
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
              } else if (data.text) {
                onChunk(data.text);
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

    // Stream closed without an explicit end event.
    onComplete();
  } catch (error) {
    if (signal?.aborted) return;
    console.log("Error in chat", error);
    onError(error instanceof Error ? error.message : "Unknown error occurred");
  }
};

const getUser = async () => {
  try {
    const response = await axios.get(`${serverUrl}/api/users/get_user`, {
      headers: await authHeaders(),
    });

    return response.data;
  } catch (error) {
    return null;
  }
};

export const addUser = async (_user?: {
  userId?: string;
  email?: string | null;
  displayName?: string | null;
}) => {
  const foundUser = await getUser();

  if (foundUser) {
    return foundUser;
  }

  const response = await axios.post(
    `${serverUrl}/api/users/add_user`,
    {},
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

export const getBookFromDb = async (bookId: string) => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/books/get_book?bookId=${encodeURIComponent(bookId)}`
    );

    if (response.status !== 200) {
      return null;
    }

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

  const response = await axios.post(
    `${serverUrl}/api/books/add_book`,
    {
      id,
      title,
      authors,
      description,
      imageLinks,
      publisher,
      categories,
      isbnValue,
    },
    {
      headers: await authHeaders(),
    }
  );

  console.log("added book to db", response);
  return response.data;
};

export const saveBookToLibrary = async ({
  userId,
  bookId,
  status,
}: {
  userId?: string;
  bookId: string;
  status: StatusEnum;
}) => {
  if (!bookId) {
    throw new Error("Book not found");
  }

  const response = await axios.post(
    `${serverUrl}/api/books/update_book_status`,
    { bookId, status },
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

export const removeBookFromLibrary = async ({
  userId,
  bookId,
}: {
  userId?: string;
  bookId: string;
}) => {
  if (!bookId) {
    throw new Error("Book not found");
  }

  const response = await axios.post(
    `${serverUrl}/api/books/remove_book_status`,
    { bookId },
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

export const checkStatus = async ({
  userId,
  bookId,
}: {
  userId?: string;
  bookId: string;
}) => {
  if (!bookId) {
    throw new Error("Book not found");
  }

  const response = await axios.get(
    `${serverUrl}/api/books/check_status/${bookId}`,
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

export const toggleFavorite = async ({
  userId,
  bookId,
}: {
  userId?: string;
  bookId: string;
}) => {
  if (!bookId) {
    throw new Error("Book not found");
  }

  const response = await axios.post(
    `${serverUrl}/api/books/toggle_favorite`,
    { bookId },
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

export const checkFavorite = async ({
  userId,
  bookId,
}: {
  userId?: string;
  bookId: string;
}) => {
  if (!bookId) {
    throw new Error("Book not found");
  }

  const response = await axios.get(
    `${serverUrl}/api/books/check_favorite/${bookId}`,
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

export const getUserBooks = async (_userId?: string) => {
  const response = await axios.get(`${serverUrl}/api/books/get_user_books`, {
    headers: await authHeaders(),
  });

  return response.data;
};

export const getFavorites = async (_userId?: string) => {
  const response = await axios.get(`${serverUrl}/api/books/get_favorites`, {
    headers: await authHeaders(),
  });

  return response.data;
};

export const postReview = async (review: Review) => {
  const response = await axios.post(
    `${serverUrl}/api/reviews`,
    {
      bookId: review.bookId,
      reviewDesc: review.reviewDesc,
      starRating: review.starRating,
    },
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

export const getReviews = async (bookId: string) => {
  const response = await axios.get(`${serverUrl}/api/reviews/${bookId}`);
  return response.data;
};

export const likeReview = async (reviewId: number) => {
  const response = await axios.post(
    `${serverUrl}/api/reviews/${reviewId}/like`,
    {},
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

export const unlikeReview = async (reviewId: number) => {
  const response = await axios.post(
    `${serverUrl}/api/reviews/${reviewId}/unlike`,
    {},
    {
      headers: await authHeaders(),
    }
  );

  return response.data;
};

/**
 * Sends Firebase ID token to the server for verification.
 * Call this after Firebase login so the user record is created/updated on the server.
 * Protected requests fetch a fresh token themselves (see authHeaders).
 */
export const verifyTokenWithServer = async (token: string) => {
  try {
    const response = await axios.post(
      `${serverUrl}/api/auth/verify-token`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to verify token with server:", error);
    throw error;
  }
};