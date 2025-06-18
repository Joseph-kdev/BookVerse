import React, { useState } from "react";
import { BookOpen, Heart, CheckCircle, List } from "lucide-react";
import { useUserAuthContext } from "../config/UserAuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useQuery } from "@tanstack/react-query";
import Nav from "./Nav";
import Book from "./Book";
import { PropagateLoader } from "react-spinners";

export default function Library() {
  const [activeTab, setActiveTab] = useState<
    "reading-list" | "favorite" | "already-read" | "all"
  >("all");

  const tabs = [
    { id: "all", label: "All Books", icon: List },
    { id: "reading-list", label: "Reading list", icon: BookOpen },
    { id: "favorite", label: "Favorites", icon: Heart },
    { id: "already-read", label: "Completed", icon: CheckCircle },
  ];

  const { user } = useUserAuthContext();
  const fetchList = async (listType: string): Promise<any> => {
    if (listType === "all") {
      const data = await fetchAll();
      return data;
    }

    const collectionRef = collection(db, `users/${user?.uid}/${listType}`);
    const querySnapshot = await getDocs(collectionRef);
    const retrievedData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return retrievedData;
  };

  const fetchAll = async () => {
    const read = await fetchList("already-read");
    const favorites = await fetchList("favorite");
    const list = await fetchList("reading-list");

    const allBooks = [...read, ...favorites, ...list];
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
    queryKey: ["books", activeTab],
    queryFn: () => fetchList(activeTab),
    enabled: !!user,
    initialData: [],
  });

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
        {books.length > 0 ? (
          <div>
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <PropagateLoader size={25} color="" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center mt-4">
                <img src="/sad-pup.svg" width={100} alt="" />
                <p className="text-sm font-Oxanium mt-1 text-red-500">
                  Error getting books!!
                </p>
              </div>
            ) : (
              <div className="flex gap-4 w-full">
                {books.map((bk, i) => (
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
            )}
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
    </section>
  );
}
