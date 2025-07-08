import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GoogleBook, StatusEnum } from "../types";
import Nav from "./Nav";
import { useUserAuthContext } from "../config/UserAuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  addBookToDb,
  checkFavorite,
  checkStatus,
  getDownloadLinks,
  removeBookFromLibrary,
  saveBookToLibrary,
  toggleFavorite,
} from "../services/requests";
import { BookCheckIcon, BookmarkPlusIcon, BookOpenTextIcon, Bot, Download } from "lucide-react";
import Modal from "react-modal";
import BookChat from "./Chat";
import { ClockLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function BookPage() {
  const { title } = useParams();
  const location = useLocation();
  const bookData = location.state as GoogleBook;
  const [bookInCollection, setBookInCollection] = useState({
    "reading_list": false,
    "completed": false,
    "reading": false,
    "favorite": false,
  });
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useUserAuthContext();
  //status button
  const [status, setStatus] = useState("Want to Read");
  const [isOpen, setIsOpen] = useState(false);
  const handleStatusChange = async (
    newStatus: React.SetStateAction<string>,
    statusType: StatusEnum
  ) => {
    try {
      setloading(true);
      await toggleBookLibrary(statusType, "add");
      setStatus(newStatus);
      setIsOpen(false);
    } catch (error: any) {
      setError(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    if (bookInCollection["completed"]) {
      setStatus("Read");
    } else if (bookInCollection["reading"]) {
      setStatus("Currently Reading");
    } else if (bookInCollection["reading_list"]) {
      setStatus("Want to Read");
    } else {
      setStatus("Want to Read"); // Default status
    }
  }, [bookInCollection]);

  const hasStatus = () => {
    return (
      bookInCollection["completed"] ||
      bookInCollection["reading"] ||
      bookInCollection["reading_list"]
    );
  };
  // Define styles based on status
  const getButtonStyles = () => {
    switch (status) {
      case "Want to Read":
        return "bg-blue-600 hover:bg-blue-700";
      case "Currently Reading":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "Read":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-gray-700 hover:bg-gray-600";
    }
  };
  const getStatusContent = () => {
  if (bookInCollection["completed"]) {
    return (
      <div className="flex items-center gap-1">
        <BookCheckIcon width={20} />
        Read
      </div>
    );
  }
  if (bookInCollection["reading"]) {
    return (
      <div className="flex items-center gap-1">
        <BookOpenTextIcon width={20} />
        Currently Reading
      </div>
    );
  }
  if (bookInCollection["reading_list"]) {
    return (
      <div className="flex items-center gap-1">
        <BookmarkPlusIcon width={20} />
        Want to Read
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <BookmarkPlusIcon width={20} />
      Want to Read
    </div>
  );
};

  //AI modal
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };

  const toggleBookLibrary = async (status: StatusEnum, action: string) => {
    if (!user) {
      toast.error("You have to be logged in!!", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }
    try {
      if (action === "add") {
        await addBookToDb({
          id: bookData.id,
          title: bookData.title,
          authors: bookData.authors,
          description: bookData.description,
          imageLinks: bookData.imageLinks,
          publisher: bookData.publisher,
          categories: bookData.categories,
          isbnValue: bookData.isbnValue || [],
        });
        await saveBookToLibrary({
          userId: user.uid,
          bookId: bookData.id,
          status: status,
        });
        setBookInCollection((prev) => ({ ...prev, [status]: true }));
        toast.success(`${bookData.title} added to ${status}`, {
          duration: 4000,
          position: "top-center",
          icon: "✅",
          className: "text-sm text-light-text",
        });
        console.log(`${bookData.title} added to ${status}`);
        return;
      } else if (action === "remove") {
        await removeBookFromLibrary({
          userId: user.uid,
          bookId: bookData.id,
          status: status,
        });
        setBookInCollection((prev) => ({ ...prev, [status]: false }));
        toast.success(`${bookData.title} removed from ${status}`, {
          duration: 4000,
          position: "top-center",
          icon: "❌",
          className: "text-sm text-light-text",
        });
        console.log(`${bookData.title} removed from ${status}`);
      }
    } catch (error) {
      console.log("Error adding book", error);
      toast.error("Error adding book");
    }
  };

  const handleFavorite = async (userId: string, bookId: string) => {
    if (!userId) {
      toast.error("You have to be logged in!!", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }
    try {
      await addBookToDb({
        id: bookData.id,
        title: bookData.title,
        authors: bookData.authors,
        description: bookData.description,
        imageLinks: bookData.imageLinks,
        publisher: bookData.publisher,
        categories: bookData.categories,
        isbnValue: bookData.isbnValue || [],
      });
      await toggleFavorite({ userId, bookId });
      if (bookInCollection["favorite"] == false) {
        setBookInCollection((prev) => ({ ...prev, favorite: true }));
        toast.success(`${bookData.title} added to favorites`, {
          duration: 4000,
          position: "top-center",
          icon: "✅",
          className: "text-sm text-light-text",
        });
      } else {
        setBookInCollection((prev) => ({ ...prev, favorite: false }));
        toast.success(`${bookData.title} removed from favorites`, {
          duration: 4000,
          position: "top-center",
          icon: "❌",
          className: "text-sm text-light-text",
        });
      }
    } catch (error) {
      console.log("Error adding book", error);
      toast.error("Error adding book");
    }
  };

  const handleStatusRemoval = async() => {
    try {
      await removeBookFromLibrary({userId: user?.uid, bookId: bookData.id})
      setBookInCollection(prev => ({...prev, 
        "completed": false,
        "reading": false,
        "reading_list": false
      }))
      toast.success(`${bookData.title} removed from your library`)
    } catch (error) {
      console.log("Error removing status", error)
      toast.error("Error removing book from library");
    }
  }
  //check if the book is in the user's library
  useEffect(() => {
    const checkBookExistence = async () => {
      if (!user) return;
      const bookQuery = await checkStatus({
        userId: user.uid,
        bookId: bookData.id,
      });

      if (bookQuery.length == 0) {
        return;
      }
      console.log("bookquery", bookQuery);
      setBookInCollection((prev) => ({ ...prev, [bookQuery[0].status]: true }));
    };
    const checkBookFavorite = async () => {
      const bookQuery = await checkFavorite({
        userId: user?.uid,
        bookId: bookData.id,
      });
      if (bookQuery.length == 0) {
        return;
      }
      setBookInCollection((prev) => ({ ...prev, favorite: true }));
    };

    checkBookExistence();
    checkBookFavorite();
  }, [user, bookData.id]);

  //fetch download links
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
            <Bot size={16} className="animate-pulse"/>
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
            <div className="relative inline-block text-left w-full">
              <button
                type="button"
                className={`inline-flex w-full justify-center gap-x-2 items-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 ${getButtonStyles()}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {getStatusContent()}
                <svg
                  className="-mr-1 h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute z-10 mt-2 w-44 md:w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      onClick={() =>
                        handleStatusChange("Want to Read", "reading_list")
                      }
                      className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white w-full text-left flex items-center gap-2"
                    >
                      <BookmarkPlusIcon width={20} />
                      Want to Read
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange("Currently Reading", "reading")
                      }
                      className="flex gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white w-full text-left"
                    >
                      <BookOpenTextIcon width={20} />
                      Currently Reading
                    </button>
                    <button
                      onClick={() => handleStatusChange("Read", "completed")}
                      className="flex gap-2 items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-white w-full text-left"
                    >
                      <BookCheckIcon width={20} />
                      Read
                    </button>
                    {hasStatus() && (
                      <div>
                        <div className="border-t border-gray-600 my-1"></div>
                        <button
                          onClick={handleStatusRemoval}
                          className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 w-full text-left"
                        >
                          Remove from Library
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div
              className="mt-3 cursor-pointer dark:text-dark-text"
              onClick={() => handleFavorite(user?.uid, bookData.id)}
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
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            height: "80%",
            width: "92%",
            margin: "auto",
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
