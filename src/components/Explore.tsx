import React, { useEffect, useReducer, useState } from 'react'
import { getGenreBooks } from '../services/requests';
import Book from './Book';
import _ from "lodash"
import Nav from './Nav';
import { booksReducer } from '../config/reducers';

export default function Explore() {
  const [activeTab, setActiveTab] = useState("our-picks");
  const [selectedGenre, setSelectedGenre] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)  
  const tabs = [
    { id: "our-picks", label: "Our Picks" },
    { id: "popular-genres", label: "Popular Genres" },
    { id: "other-genres", label: "Other Genres" }
  ];

  const genres: object = {
    "our-picks": [
      "FICTION",
      "CLASSICS",
      "PHILOSOPHY",
      "BIOGRAPHY & AUTOBIOGRAPHY"
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
  }

  const [books, dispatch] = useReducer(booksReducer, [])

  const findGenreBooks = async(genre: string) => {
    setIsLoading(true)
    setError(null)
    try {
      setSelectedGenre(genre)
      const result = await getGenreBooks(genre)
      if (!result) {
        throw new Error("No books found")
      }
      dispatch({ type: "GENRE-CHANGE", payload: result })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
      dispatch({ type: "Error"})
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    const initializeGenre = async() => {
      await findGenreBooks("classics")
    }
    initializeGenre()
  }, [activeTab])
  
  return (
    <>
    <Nav />
      <div className="w-full md:max-w-3xl mx-auto lg:grid lg:grid-cols-3 lg:min-w-full lg:p-4">
        <div className='mt-3 lg:col-span-1 lg:fixed lg:right-8'>
          {/* Tabs Navigation */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="inline-flex min-w-full bg-gray-100 rounded-lg p-1 justify-evenly">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-2 py-2 text-sm font-medium rounded-md transition-all
                      ${activeTab === tab.id 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
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
            <div className="flex overflow-scroll scroll-smooth lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-hidden">
              {genres[activeTab].map((genre: string) => (
                <button
                  key={genre}
                  className={`
                    text-xs max-h-[50px] min-w-[150px]
                    px-2 py-2 m-1 md:text-sm font-medium
                    bg-gray-100 hover:bg-gray-200
                    rounded-lg transition-colors
                    text-gray-900
                    ${selectedGenre === genre 
                      ? 'bg-yellow-300 text-gray-900 shadow-sm border border-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
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
        <div className='flex gap-2 w-full flex-wrap mt-2 justify-evenly lg:col-span-2 lg:ml-5 lg:max-w-[93%]'>
          {books.map(bk => (
            <Book key={bk.id} id={bk.id} title={bk.title} authors={bk.authors} description={bk.description} publisher={bk.publisher} categories={bk.categories} imageLinks={bk.imageLinks}/>
                  ))}
        </div>
      </div>
    </>
  );
};
