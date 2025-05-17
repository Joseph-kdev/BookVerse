import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GoogleBook } from "../types";
import Nav from "./Nav";
import { useUserAuthContext } from "../config/UserAuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase-config";

export default function BookPage() {
  const { title } = useParams();
  const location = useLocation();
  const bookData = location.state as GoogleBook;
  const [bookInCollection, setBookInCollection] = useState({
    "reading-list": false,
    "already-read": false,
    favorite: false,
  });
  const { user } = useUserAuthContext();

  const toggleBookLibrary = async (listType: string, action: string) => {
    if (!user) {
      console.log("You have to be logged in");
      return;
    }

    const collectionRef = collection(db, `users/${user.uid}/${listType}`);

    try {
      const bookQuery = query(collectionRef, where("id", "==", bookData.id));
      const querySnapshot = await getDocs(bookQuery);

      if (querySnapshot.empty) {
        if (action === "add") {
          await addDoc(collectionRef, {
            id: bookData.id,
            title: bookData.title,
            authors: bookData.authors,
            description: bookData.description,
            imageLinks: bookData.imageLinks,
            publisher: bookData.publisher,
            categories: bookData.categories,
            isbnValue: bookData.isbnValue || [],
          });
          setBookInCollection((prev) => ({ ...prev, [listType]: true }));
          console.log(`${bookData.title} added to ${listType}`);
        } else {
          console.log("Cannot remove non-existent book");
        }
      } else {
        const docRef = querySnapshot.docs[0].ref;
        if (action === "add") {
          console.log("already saved");
        } else if (action === "remove") {
          await deleteDoc(docRef);
          setBookInCollection((prev) => ({ ...prev, [listType]: false }));
          console.log(`${bookData.title} removed from ${listType}`);
        }
      }
    } catch (error) {
      console.log("Error adding books", error);
    }
  };

  useEffect(() => {
    const checkBookExistence = async () => {
      if (!user) return;
      const checkList = async (listType: string) => {
        const collectionRef = collection(db, `users/${user.uid}/${listType}`);
        const bookQuery = query(collectionRef, where("id", "==", bookData.id));
        const querySnapshot = await getDocs(bookQuery);

        setBookInCollection((prev) => ({
          ...prev,
          [listType]: !querySnapshot.empty,
        }));
      };

      await checkList("reading-list");
      await checkList("already-read");
      await checkList("favorite");
    };

    checkBookExistence();
  }, [user, bookData.id]);

  return (
    <div className="bg-light-background dark:bg-dark-background h-full">
      <Nav />
      <div className="md:hidden">
        <h2 className="text-center font-Rubik_Dirt text-3xl mt-5 z-10">
          {title}
        </h2>
      </div>
      <div className="flex flex-col-reverse items-center mt-4 px-1 md:px-[10%] md:flex-row md:justify-between md:items-start md:gap-3 md:mt-5">
        <div className="md:w-[70vw] p-2 rounded-md dark:text-dark-text text-light-text">
          <div className="hidden md:block">
            <h2 className="font-Rubik_Dirt text-3xl z-10">{title}</h2>
          </div>
          <p className="text-lg font-Tilt_Neon md:my-2">Description:</p>
          <p className="text-sm leading-relaxed">{bookData.description}</p>
          <p className="font-Oxanium text-sm mt-4">
            Author(s):{" "}
            {bookData.authors?.map((a) => (
              <span>{a}</span>
            ))}
          </p>
          <p className="font-Oxanium text-sm">
            Publisher: {bookData?.publisher}
          </p>
          <p className="font-Oxanium text-sm">
            Genre(s):{" "}
            {bookData.categories?.map((g) => (
              <span key={g}>{g}</span>
            ))}
          </p>
        </div>
        <div className="mb-2 grid grid-cols-2 gap-2 md:flex md:flex-col">
          <img
            src={bookData.imageLinks?.thumbnail}
            alt={bookData.title}
            className="md:w-[350px]"
          />
          <div className="">
            <div className="md:grid md:grid-cols-2 md:gap-2">
              <button
                onClick={() =>
                  toggleBookLibrary(
                    "reading-list",
                    bookInCollection["reading-list"] ? "remove" : "add"
                  )
                }
                className={`w-full flex gap-1 text-dark-background font-Tilt_Neon p-2 rounded-md md:mt-3 ${
                  bookInCollection["reading-list"]
                    ? "bg-red-500 text-light-background"
                    : "bg-light-accent dark:bg-dark-accent"
                }`}
              >
                {bookInCollection["reading-list"] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                )}
                <p>Reading List</p>
              </button>
              <button
                className={`w-full flex p-2 rounded-md mt-3 text-dark-background h-10 ${
                  bookInCollection["already-read"]
                    ? "bg-light-text text-light-background"
                    : "bg-light-accent"
                }`}
                onClick={() =>
                  toggleBookLibrary(
                    "already-read",
                    bookInCollection["already-read"] ? "remove" : "add"
                  )
                }
              >
                {bookInCollection["already-read"] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                )}
                <p className="w-full">Already Read</p>
              </button>
            </div>
            <div
              className="mt-3 cursor-pointer dark:text-dark-text"
              onClick={() =>
                toggleBookLibrary(
                  "favorite",
                  bookInCollection["favorite"] ? "remove" : "add"
                )
              }
            >
              {bookInCollection["favorite"] ? (
                <button className="flex border-2 border-amber-500 p-1 w-full rounded-md justify-evenly md:p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffc107"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  <p>Remove Favorites</p>
                </button>
              ) : (
                <button className="flex border-2 border-amber-500 p-1 w-full rounded-md justify-evenly md:p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  <p>Add Favorites</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
