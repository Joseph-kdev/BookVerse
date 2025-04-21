import { useEffect, useReducer, useState } from "react";
import { getGenreBooks } from "../services/requests";
import Book from "./Book";
import _ from "lodash";
import Nav from "./Nav";
import { booksReducer } from "../config/reducers";
import { Genres } from "../types";


export default function Explore() {
  const [activeTab, setActiveTab] = useState<string>("our-picks");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tabs = [
    { id: "our-picks", label: "Our Picks" },
    { id: "popular-genres", label: "Popular Genres" },
    { id: "other-genres", label: "Other Genres" },
  ];

  const genres: Genres = {
    "our-picks": [
      "FICTION",
      "CLASSICS",
      "PHILOSOPHY",
      "BIOGRAPHY & AUTOBIOGRAPHY",
    ],
    "popular-genres": [
      "FICTION",
      "NONFICTION",
      "BIOGRAPHY & AUTOBIOGRAPHY",
      "COMICS & GRAPHIC NOVELS",
      "COOKING",
      "FAMILY & RELATIONSHIPS",
      "HISTORY",
      "MYSTERY & THRILLER",
      "ROMANCE",
      "SCIENCE FICTION",
      "SELF-HELP",
      "PHILOSOPHY",
    ],
    "other-genres": [
      "ANTIQUES & COLLECTIBLES",
      "ARCHITECTURE",
      "ART",
      "BUSINESS & ECONOMICS",
      "COMPUTERS",
      "CRAFTS & HOBBIES",
      "DESIGN",
      "DRAMA",
      "EDUCATION",
      "HUMOR",
      "LANGUAGE ARTS & DISCIPLINES",
      "LAW",
      "LITERARY COLLECTIONS",
      "LITERARY CRITICISM",
      "MATHEMATICS",
      "MEDICAL",
      "MUSIC",
      "NATURE",
      "PHOTOGRAPHY",
      "POETRY",
      "POLITICAL SCIENCE",
      "PSYCHOLOGY",
      "REFERENCE",
      "RELIGION",
      "SCIENCE",
      "SPORTS & RECREATION",
      "TECHNOLOGY & ENGINEERING",
      "TRAVEL",
    ],
  };

  const [books, dispatch] = useReducer(booksReducer, []);

  const findGenreBooks = async (genre: string) => {
    setIsLoading(true);
    setError(null);
    try {
      setSelectedGenre(genre);
      const result = await getGenreBooks(genre);
      if (!result) {
        throw new Error("No books found");
      }
      dispatch({ type: "GENRE-CHANGE", payload: result });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch books");
      dispatch({ type: "Error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeGenre = async () => {
      await findGenreBooks("classics");
    };
    initializeGenre();
  }, [activeTab]);

  return (
    <section className="bg-light-background dark:bg-dark-background min-h-screen">
      <Nav />
      <div className="w-full md:max-w-3xl mx-auto lg:grid lg:grid-cols-3 lg:min-w-full lg:p-4 bg-light-background dark:bg-dark-background">
        <div className="mt-3 lg:col-span-1 lg:fixed lg:right-8">
          {/* Tabs Navigation */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="inline-flex min-w-full bg-light-secondary dark:bg-dark-secondary rounded-lg p-1 justify-evenly font-Oxanium">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-2 py-2 text-sm font-medium rounded-md transition-all
                      ${
                        activeTab === tab.id
                          ? "bg-light-accent dark:bg-dark-accent text-light-primary dark:text-dark-primary shadow-sm"
                          : "text-light-background dark:text-dark-background hover:text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:light-accent
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Genre Grid */}
          <div className="">
            <div className="flex overflow-scroll scroll-smooth lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-hidden mt-1 font-">
              {genres[activeTab].map((genre: string) => (
                <button
                  key={genre}
                  className={`
                    text-xs max-h-[50px] min-w-[150px]
                    px-2 py-2 m-1 md:text-sm font-medium
                     hover:bg-light-accent dark:hover:bg-dark-accent
                    rounded-lg transition-colors
                    text-light-background dark:text-dark-background
                    ${
                      selectedGenre === genre
                        ? "bg-[#dfbf90] dark:bg-[#6f4f20] text-gray-900 shadow-sm border border-gray-200"
                        : "bg-light-primary dark:bg-dark-primary text-gray-900"
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                  `}
                  onClick={() => findGenreBooks(genre)}
                >
                  {_.capitalize(genre)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/*Books */}
        {error && (
          <div>
            Something went wrong
          </div>
        )}
        {isLoading ? (
          <div>
            Loading..
          </div>
        ) : (
        <div className="flex gap-2 w-full flex-wrap mt-2 justify-evenly lg:col-span-2 lg:ml-5 lg:max-w-[93%]">
          {books.map((bk) => (
            <div key={bk.id}>
              <Book
                id={bk.id}
                title={bk.title}
                authors={bk.authors}
                description={bk.description}
                publisher={bk.publisher}
                categories={bk.categories}
                imageLinks={bk.imageLinks}
                isbnValue={bk.isbnValue}
              />
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
