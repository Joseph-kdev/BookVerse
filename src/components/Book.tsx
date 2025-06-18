import React, { useState } from "react";
import { GoogleBook } from "../types";
import Modal from "react-modal";
import { Link } from "react-router-dom";

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

export default function Book({
  id,
  title,
  authors,
  description,
  imageLinks,
  publisher,
  categories,
  isbnValue,
}: GoogleBook) {
  const [modalIsOpen, setIsOpen] = useState(false);

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
  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <div className="max-w-[140px] flex flex-col p-2">
        <div className="w-full">
          <a onClick={openModal} className="cursor-pointer">
            <img
              src={imageLinks?.thumbnail || "https://placehold.co/600x400/000000/FFFFFF/png"}
              alt="book cover"
              className="w-full h-[180px]"
            />
          </a>
        </div>
        <div>
          <h3 className="mt-1 text-light-text dark:text-dark-text font-Tilt_Neon text-sm">
            {truncateTitle(title, 40)}
          </h3>
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
          </div>
          <div>
            <div>
              <h3 className="font-serif text-lg md:text-xl">
                {truncateTitle(title, 40)}
              </h3>
              <p className="font-Buda text-sm">
                {authors?.map((author) => (
                  <p key={author}>{author},</p>
                ))}
              </p>
              <p className="font-sans text-sm">
                {truncateTitle(description, 200)}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full mt-4">
          <Link
            to={`/book/${title}`}
            state={{
              id,
              title,
              authors,
              description,
              imageLinks,
              publisher,
              categories,
              isbnValue
            }}
            className="m-1 bg-light-accent dark:bg-dark-accent p-2 rounded-md font-Tilt_Neon flex justify-center text-dark-background dark:text-light-background"
          >
            More
          </Link>
        </div>
      </Modal>
    </div>
  );
}
