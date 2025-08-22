import { useEffect, useReducer, useState } from "react";
import { getGenreBooks } from "../services/requests";
import _ from "lodash";
import { booksReducer } from "../config/reducers";
import { Genres } from "../types";
import { RotateLoader } from "react-spinners";
import Nav from "../components/Nav";
import Book from "../components/Book";
import { animate, AnimatePresence, motion } from "framer-motion";
import "../index.css";

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
      "POETRY",
      "BIOGRAPHY & AUTOBIOGRAPHY",
      "COMICS & GRAPHIC NOVELS",
      "POETRY",
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
      "ART",
      "BUSINESS & ECONOMICS",
      "COMPUTERS",
      "DESIGN",
      "DRAMA",
      "HUMOR",
      "LANGUAGE ARTS & DISCIPLINES",
      "LAW",
      "LITERARY COLLECTIONS",
      "LITERARY CRITICISM",
      "MATHEMATICS",
      "MUSIC",
      "NATURE",
      "PHOTOGRAPHY",
      "POLITICAL SCIENCE",
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

  const variants = {
    initial: { opacity: 0, transform: "translateY(10px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    exit: { opacity: 0, transform: "translateY(10px)" },
  };
  return (
    <section className="bg-light-background dark:bg-dark-background min-h-screen">
      <Nav />
      <div className="w-full md:max-w-3xl mx-auto lg:grid lg:grid-cols-3 lg:min-w-full lg:p-4 bg-light-background dark:bg-dark-background">
        <div className="mt-3 lg:col-span-1 lg:fixed lg:right-8">
          {/* Tabs Navigation */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="inline-flex min-w-full bg-light-secondary dark:bg-dark-secondary md:rounded-lg p-2 justify-evenly font-Oxanium">
                {tabs.map((tab) => (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          {/* Genre Grid */}
          <div className="">
              <div
                key={activeTab}
                className="flex overflow-scroll scroll-smooth lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-hidden mt-1 font-Oxanium text-sm"
              >
                {genres[activeTab].map((genre: string, index: number) => (
                  <button
                    style={{ "--genreIndex": index + 1 }}
                    key={genre}
                    className={`wavy-fade
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
          <div className="flex flex-col items-center mt-4 w-full h-full">
            <img src="/sad-pup.svg" width={400} alt="" />
            <p className="text-sm font-Oxanium mt-1 text-red-500">
              Something went wrong!
            </p>
          </div>
        )}
        {isLoading ? (
          <div className="h-screen flex gap-2 w-full flex-wrap mt-2 justify-evenly lg:col-span-2 lg:ml-5 lg:max-w-[93%] items-center">
            <RotateLoader size={10} color="#ffc107" />
          </div>
        ) : (
          <div className="flex gap-2 w-full flex-wrap mt-2 justify-evenly lg:col-span-2 lg:ml-5 lg:max-w-[93%] lg:grid lg:grid-cols-5">
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
