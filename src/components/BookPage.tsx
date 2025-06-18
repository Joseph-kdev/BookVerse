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
import { useQuery } from "@tanstack/react-query";
import { getDownloadLinks } from "../services/requests";
import { Bot, Download } from "lucide-react";
import Modal from "react-modal";
import BookChat from "./Chat";
import { ClockLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function BookPage() {
  const { title } = useParams();
  const location = useLocation();
  const bookData = location.state as GoogleBook;
  const [bookInCollection, setBookInCollection] = useState({
    "reading-list": false,
    "already-read": false,
    "favorite": false,
  });
  const { user } = useUserAuthContext();
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  const toggleBookLibrary = async (listType: string, action: string) => {
    if (!user) {
      toast.error("You have to be logged in!!", {
        duration: 3000,
        position: "top-center",
      });
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
          toast.success(`${bookData.title} added to ${listType}`, {
            duration: 4000,
            position: "top-center",
            className: 'text-sm text-light-text'
          });
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
          toast.success(`${bookData.title} removed from ${listType}`, {
            duration: 4000,
            position: "top-center",
            icon: "❌",
            className: "text-sm text-light-text"
          });
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

  const {
    data: links,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`${title}`],
    queryFn: () => getDownloadLinks(bookData.title),
    initialData: [],
  });

  return (
    <div className="bg-light-background dark:bg-dark-background h-screen">
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
          <button
            className="bg-gradient-to-tr from-blue-800 via-amber-500 to-stone-900 text-light-text my-4 rounded-full px-4 text-sm flex items-center gap-2 py-1"
            onClick={() => setOpen(true)}
          >
            <Bot size={16} />
            Ask AI
          </button>
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
          <div>
            <p className="my-2 font-Tilt_Neon text-lg">Download links</p>
            {isLoading ? (
              <div className="w-[100%] h-20 flex justify-center items-center">
                <ClockLoader size={25} color="#9a5000" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center mt-4">
                <img src="/sad-pup.svg" width={100} alt="" />
                <p className="text-sm font-Oxanium mt-1 text-red-500">
                  Error getting links!!
                </p>
              </div>
            ) : (
              <div className="">
                <div className="shadow-lg rounded-lg">
                  <table className="w-full bg-light-background border-collapse">
                    <thead>
                      <tr className="bg-light-background border-b border-gray-200">
                        <th className="px-2 py-2 text-left text-sm text-gray-900 tracking-wider">
                          Links
                        </th>
                        <th className="px-6 py-2 text-left text-sm text-gray-900  tracking-wider">
                          Format
                        </th>
                        <th className="px-2 py-2 text-left text-sm text-gray-900  tracking-wider">
                          Size
                        </th>
                        <th className="px-2 py-2 text-center text-sm text-gray-900  tracking-wider">
                          Download
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {links.map((link, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-2 py-4 text-sm text-gray-900">
                            Link {index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-light-secondary text-dark-text">
                              {link.format}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-light-text">
                            {link.size}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <a
                              href={link.link}
                              className="inline-flex items-center justify-center p-2 rounded-full bg-light-primary"
                              target="_blank"
                            >
                              <Download size={20} color="#ffc107" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
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
                className={`w-full flex items-center gap-1 text-dark-background font-Tilt_Neon p-2 rounded-md md:mt-3 ${
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
                    className="size-4"
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
                    className="size-4"
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
                className={`w-full flex items-center p-2 rounded-md mt-3 text-dark-background h-10 ${
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
                    className="size-4"
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
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 4 4 9-13.5"
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
                <button className="flex items-center border-2 border-amber-500 p-1 w-full rounded-md justify-evenly md:p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffc107"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-4"
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
                <button className="flex items-center border-2 border-amber-500 p-1 w-full rounded-md justify-evenly md:p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
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
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        contentLabel="Chat About Stuff"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "#4e4b4bf4",
          },
          content: {
            display: "flex",
            flexDirection: "column",
            height: "80%",
            width: "80%",
            margin: "auto",
            backgroundColor: "#091235",
            border: "none",
            padding: "0",
          },
        }}
      >
        <BookChat title={bookData.title} author={bookData.authors[0]} />
      </Modal>
    </div>
  );
}
