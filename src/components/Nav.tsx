import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };
  return (
    <nav className="flex justify-between p-1 md:px-4 bg-light-background dark:bg-dark-background sticky top-0 items-center text-light-background dark:text-dark-background">
      <div className="ml-1">
        <Link to="/">Logo</Link>
      </div>
      <div className="bg-light-primary dark:bg-dark-primary p-2 rounded-full w-[200px] md:min-w-[300px] flex justify-evenly">
        <div>
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 md:hidden fill-light-primary dark:fill-dark-primary text-light-background dark:text-dark-background"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <p className="hidden md:block">Home</p>
          </Link>
        </div>
        <div>
          <Link to="/explore">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentcolor"
              className="md:hidden fill-light-primary dark:fill-dark-primary text-light-background dark:text-dark-background"
            >
              <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 2c5.519 0 10 4.481 10 10s-4.481 10-10 10-10-4.481-10-10 4.481-10 10-10zm1.476 12.955c.988-.405 1.757-1.211 2.116-2.216l2.408-6.739-6.672 2.387c-1.006.36-1.811 1.131-2.216 2.119l-3.065 7.494 7.429-3.045zm-.122-4.286c.551.551.551 1.446 0 1.996-.551.551-1.445.551-1.996 0-.551-.55-.551-1.445 0-1.996.551-.551 1.445-.551 1.996 0z" />
            </svg>
            <p className="hidden md:block">Explore</p>
          </Link>
        </div>
        <div>
          <Link to="/library">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentcolor"
              className="md:hidden fill-light-primary dark:fill-dark-primary text-light-background dark:text-dark-background"
            >
              <path d="M22 24h-17c-1.657 0-3-1.343-3-3v-18c0-1.657 1.343-3 3-3h17v24zm-2-4h-14.505c-1.375 0-1.375 2 0 2h14.505v-2zm0-18h-3v9l-2-1.547-2 1.547v-9h-8v16h15v-16z" />
            </svg>
            <p className="hidden md:block">My Library</p>
          </Link>
        </div>
      </div>
      <div className="ml-1 cursor-pointer">
        <Link to="/search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-light-text dark:text-dark-text"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </Link>
      </div>
      <div className="absolute right-3 top-16 bg-light-background dark:bg-dark-background rounded-full cursor-pointer p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={"currentColor"}
          className="size-6 text-light-text dark:text-dark-text"
          onClick={toggleDarkMode}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      </div>
    </nav>
  );
}
