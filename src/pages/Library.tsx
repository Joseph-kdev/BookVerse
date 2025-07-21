import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Heart,
  CheckCircle,
  List,
  BookMarkedIcon,
} from "lucide-react";
import { useUserAuthContext } from "../config/UserAuthContext";
import { useQuery } from "@tanstack/react-query";
import Nav from "../components/Nav";
import Book from "../components/Book";
import { PropagateLoader } from "react-spinners";
import { getFavorites, getUserBooks } from "../services/requests";
import toast from "react-hot-toast";
import { GoogleBook } from "../types";

export default function Library() {
  const [activeTab, setActiveTab] = useState<
    "reading_list" | "favorite" | "completed" | "all" | "reading"
  >("all");

  const tabs = [
    { id: "all", label: "All Books", icon: List },
    { id: "favorite", label: "Favorites", icon: Heart },
    { id: "reading_list", label: "Reading list", icon: BookMarkedIcon },
    { id: "reading", label: "Reading", icon: BookOpen },
    { id: "completed", label: "Completed", icon: CheckCircle },
  ];

  const { user } = useUserAuthContext();
  const fetchAll = async () => {
    if (!user) {
      toast.error("You have to be logged in");
      return;
    }

    const bookLibrary = await getUserBooks(user?.uid);
    const favorites = await getFavorites(user?.uid);

    const allBooks = [...bookLibrary, ...favorites];
    const uniqueBooks = Array.from(new Set(allBooks.map((a) => a.id))).map(
      (id) => {
        return allBooks.find((a) => a.id === id);
      }
    );
    return uniqueBooks;
  };

  const {
    data: books,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: () => fetchAll(),
    enabled: !!user,
    initialData: [],
  });

  const bookTabs = async (activeTab: string) => {
    if (!books) {
      return [];
    }
    const booksUnderTab = books.filter((book) => book.status === activeTab);
    return booksUnderTab;
  };
  const [booksToshow, setBooksToshow] = useState<GoogleBook[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites = await getFavorites(user?.uid);
      if (!favorites) {
        return [];
      }
      return favorites;
    };

    const showBooks = async () => {
      if (activeTab === "favorite") {
        const result = await fetchFavorites();
        setBooksToshow(result);
        return;
      }
      if (activeTab === "all") {
        setBooksToshow(books);
        return;
      }
      const result = await bookTabs(activeTab);
      setBooksToshow(result);
    };

    showBooks();
  }, [activeTab, books, user?.uid]);

  return (
    <section className="bg-light-background dark:bg-dark-background min-h-screen">
      <Nav />
      <div className="md:px-[10%]">
        <div className="mt-2">
          <div className="bg-[url('/homebg1.jpg')] bg-fixed bg-center bg-cover bg-no-repeat min-h-[25vh] flex justify-center items-center relative">
            <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-70 dark:bg-opacity-70 absolute top-0 left-0 w-full h-full"></div>
            <h2 className="text-center font-Rubik_Dirt text-3xl mt-5 z-10 text-light-background dark:text-dark-background">
              Your library
            </h2>
          </div>
          <div className="flex overflow-x-auto space-x-4 my-4">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? "bg-light-accent text-light-text"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center w-full">
          {booksToshow.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 w-full">
              {booksToshow.map((bk, i) => (
                <div key={i++}>
                  <Book
                    id={bk.id}
                    title={bk.title}
                    authors={bk.authors}
                    description={bk.description}
                    publisher={bk.publisher}
                    categories={bk.categories}
                    imageLinks={bk.imageLinks}
                    isbnValue={null}
                  />
                </div>
              ))}
            </div>
          ) : isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <PropagateLoader size={25} color="#ffc107" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center mt-4">
              <img src="/sad-pup.svg" width={100} alt="" />
              <p className="text-sm font-Oxanium mt-1 text-red-500">
                Error getting books!!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-4">
              <img src="/empty.svg" width={400} alt="" />
              <p className="text-sm font-Oxanium mt-1 text-light-text dark:text-dark-text">
                Looks like you haven't added anything!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
