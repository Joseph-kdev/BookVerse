import { useEffect, useRef, useState } from "react";
import { GoogleBook } from "../types";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "usehooks-ts";
import { motion } from "framer-motion";

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
  const [clicked, setClicked] = useState<GoogleBook | null>(null);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setClicked(null));

  useEffect(() => {
    function onKeyDown(event: { key: string }) {
      if (event.key === "Escape") {
        setClicked(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const truncateTitle = (title: string, maxLength: number): string => {
    if (!title) {
      return "";
    }
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "...";
    }
    return title;
  };

  return (
    <div>
      <motion.div layoutId={`book-${id}`} className="max-w-[140px] flex flex-col p-2">
        <div className="w-full">
          <a
            onClick={() =>
              setClicked({
                id,
                title,
                authors,
                description,
                imageLinks,
                publisher,
                categories,
                isbnValue,
              })
            }
            className="cursor-pointer"
          >
            <motion.img
              src={
                imageLinks?.thumbnail ||
                "https://placehold.co/600x400/000000/FFFFFF/png"
              }
              alt="book cover"
              className="w-full h-[180px]"
              whileHover={{ scale: 1.04}}
              layoutId={`book-img-${id}`}
            />
          </a>
        </div>
        <div>
          <motion.h3 layoutId={`book-title-${id}`} className="mt-1 text-light-text dark:text-dark-text font-Tilt_Neon text-sm">
            {truncateTitle(title, 40)}
          </motion.h3>
        </div>
      </motion.div>

      {clicked ? (
        <motion.div initial={{opacity: 0}} animate={{opacity:1}} exit={{ opacity: 0}}  className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50">
          <motion.div layoutId={`book-${id}`} className="bg-light-background dark:bg-dark-background p-4 rounded-lg" ref={ref}>
            <div className="flex gap-2 items-start max-w-[500px]">
              <div className="min-w-[100px]">
                <motion.img layoutId={`book-img-${id}`} src={imageLinks?.thumbnail} alt={title} />
              </div>
              <div>
                <div>
                  <motion.h3 layoutId={`book-title-${id}`} className="font-serif text-lg md:text-xl">
                    {truncateTitle(title, 40)}
                  </motion.h3>
                  <p className="font-Buda text-sm">
                    {authors?.map((author) => (
                      <p key={author}>{author},</p>
                    ))}
                  </p>
                  <motion.p layoutId={`book-desc-${id}`} initial={{scale: 0.6}} animate={{scale: 1}} exit={{scale: 0.6}} className="font-sans text-sm">
                    {truncateTitle(description, 200)}
                  </motion.p>
                </div>
              </div>
            </div>
            <motion.div initial={{scale: 0.6}} animate={{scale: 1}} exit={{scale: 0.6}} whileTap={{ scale: 0.95 }} className="w-full mt-4">
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
                  isbnValue,
                }}
                className="m-1 bg-light-accent dark:bg-dark-accent p-2 rounded-md font-Tilt_Neon flex justify-center text-dark-background dark:text-light-background"
              >
                More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  );
}
