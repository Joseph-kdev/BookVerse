import React, { useEffect, useState } from "react";
import { GoogleBook } from "../types";
import Modal from "react-modal";
import { useUserAuthContext } from "../config/UserAuthContext";
import { db } from "../config/firebase-config";
import { addDoc, collection, deleteDoc, getDocs, query, where } from "firebase/firestore";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const customLibraryStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Book({
  id,
  title,
  authors,
  description,
  imageLinks,
  publisher,
  categories,
}: GoogleBook) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const { user } = useUserAuthContext();
  const [bookInCollection, setBookInCollection] = useState({'reading-list': false, 'already-read':false, 'favorite':false});
  const truncateTitle = (title: string, maxLength: number): string => {
    if (!title) {
      return "";
    }
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "...";
    }
    return title;
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const closeLibraryModal = () => {
    setShowSelect(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  // library functionality for logged in users
  const toggleBookLibrary = async (listType: string, action: string) => {
    if (!user) {
      console.log("YOu need to be logged in");
      return;
    }

    const collectionRef = collection(db, `users/${user.uid}/${listType}`);

    try {
      const bookQuery = query(collectionRef, where("id", "==", id));
      const querySnapshot = await getDocs(bookQuery);

      if (querySnapshot.empty) {
        if (action === "add") {
          await addDoc(collectionRef, {
            id,
            title,
            authors,
            description,
            imageLinks,
            publisher,
            categories,
          });
          setBookInCollection(prev => ({...prev, [listType]: true}));
          console.log(`${title} added to ${listType}`);
          
        } else {
          console.log("Cannot remove non-existent book");
        }
      } else {
        const docRef = querySnapshot.docs[0].ref
        if(action === "add") {
          console.log("already saved");
        } else if (action === "remove") {
          await deleteDoc(docRef)
          setBookInCollection(prev => ({...prev, [listType]: false}))
          console.log(`${title} removed from ${listType}`);
        }
      }

    } catch (error) {
      console.log("Error adding books", error);
    }
  };

  //check for the book in the db if logged in
  useEffect(() => {
    const checkBookExistence = async () => {
      if (!user) return;
  
      const checkList = async (listType: string) => {
        const collectionRef = collection(db, `users/${user.uid}/${listType}`);
        const bookQuery = query(collectionRef, where("id", "==", id));
        const querySnapshot = await getDocs(bookQuery);
        
        setBookInCollection(prev => ({
          ...prev,
          [listType]: !querySnapshot.empty
        }));
      };
  
      await checkList('reading-list');
      await checkList('already-read');
      await checkList('favorite')
    };
  
    checkBookExistence();

  }, [modalIsOpen, user, id]);
  return (
    <>
      <div className="max-w-[140px] flex flex-col p-2" key={id}>
        <div className="w-full">
          <a onClick={openModal} className="cursor-pointer">
            <img
              src={imageLinks?.thumbnail}
              alt="book cover"
              className="w-full h-[180px]"
            />
          </a>
        </div>
        <div>
          <h3 className="mt-1">{truncateTitle(title, 40)}</h3>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Book Modal"
        style={customStyles}
      >
        <div className="flex gap-2 items-start max-w-[500px]">
          <div className="min-w-[100px]">
            <img src={imageLinks?.thumbnail} alt={title} />
            <div className="mt-3 cursor-pointer" onClick={() => toggleBookLibrary("favorite", bookInCollection['favorite'] ? "remove" : "add")}>
              {bookInCollection['favorite'] ? (
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
                fill="none"
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
          <div>
            <div>
              <h3>{truncateTitle(title, 40)}</h3>
              <p>
                {authors?.map((author) => (
                  <p>{author},</p>
                ))}
              </p>
              <p>{truncateTitle(description, 200)}</p>
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-2">
          <button
            onClick={() => setShowSelect(!showSelect)}
            className="m-1 bg-gray-900 p-2 rounded-md"
          >
            {bookInCollection["already-read"] || bookInCollection["reading-list"] ? "Remove from Library" : "Add to Library"}
          </button>
          <button className="m-1 bg-gray-900 p-2 rounded-md">More</button>
        </div>
      </Modal>
      <Modal
        isOpen={showSelect}
        onRequestClose={closeLibraryModal}
        contentLabel="Library Modal"
        style={customLibraryStyles}
      >
        <div className="min-w-[320px]">
          <h3>Assign a tag:</h3>
          <div className="w-full grid grid-cols-2">
            <button className="bg-pink-400 m-1 p-2 rounded-md" onClick={() => toggleBookLibrary("reading-list", bookInCollection["reading-list"] ? "remove" : "add")}>
              {bookInCollection["reading-list"] ? "Remove" : "Reading list"}
            </button>
            <button className="bg-pink-400 m-1 p-2 rounded-md" onClick={() => toggleBookLibrary("already-read", bookInCollection["already-read"] ? "remove" : "add")}>{bookInCollection["already-read"] ? "Remove" : "Already Read"}</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
