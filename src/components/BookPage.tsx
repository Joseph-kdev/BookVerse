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
    <div className="bg-light-background dark:bg-dark-background h-screen">
      <Nav />
      <div className="text-center text-2xl mt-2">{title}</div>
      <div className="flex flex-col-reverse items-center mt-3 px-[5%] md:flex-row md:justify-between md:items-start">
        <div className="md:w-[70vw] bg-light-primary bg-opacity-70 dark:bg-dark-primary p-2 rounded-md">
          <p className="text-lg">Description:</p>
          {bookData.description}
          <hr className="my-2" />
          <p>
            Author(s):{" "}
            {bookData.authors?.map((a) => (
              <span>{a}</span>
            ))}
          </p>
          <p>Publisher: {bookData?.publisher}</p>
          <p>
            Genre(s):{" "}
            {bookData.categories?.map((g) => (
              <span>{g}</span>
            ))}
          </p>
        </div>
        <div className="mb-2 grid grid-cols-2 gap-2 md:flex md:flex-col">
          <img
            src={bookData.imageLinks?.thumbnail}
            alt={bookData.title}
            className=""
          />
          <div>
            <button
              onClick={() =>
                toggleBookLibrary(
                  "reading-list",
                  bookInCollection["reading-list"] ? "remove" : "add"
                )
              }
              className={`w-full flex gap-1 text-dark-background dark:text-light-background font-Tilt_Neon p-2 rounded-md ${
                bookInCollection["reading-list"]
                  ? "bg-red-500"
                  : "bg-light-accent dark:bg-dark-accent"
              }`}
            >
              {bookInCollection["reading-list"] ? (
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
              className={`w-full flex p-2 rounded-md mt-3 text-dark-background dark:text-light-background ${
                bookInCollection["already-read"]
                  ? "bg-red-600"
                  : "bg-light-accent dark:bg-dark-accent"
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
              <p>Already Read</p>
            </button>
            <div
              className="mt-3 cursor-pointer"
              onClick={() =>
                toggleBookLibrary(
                  "favorite",
                  bookInCollection["favorite"] ? "remove" : "add"
                )
              }
            >
              {bookInCollection["favorite"] ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="red"
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
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
