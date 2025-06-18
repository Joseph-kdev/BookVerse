import { Link } from "react-router-dom";
import { useUserAuthContext } from "../config/UserAuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { BookOpen, Compass, Home, Library } from "lucide-react";

export default function Nav() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const { user } = useUserAuthContext();

  const handleLogOut = async () => {
    await signOut(auth);
  };

  return (
    <nav className="flex justify-between p-1 md:px-4 bg-light-background dark:bg-dark-background sticky top-0 items-center text-light-background dark:text-dark-background z-50">
      <div className="flex items-center">
        <BookOpen className="h-8 w-8 text-amber-500" />
        <span className="ml-2 text-xl font-bold text-light-text dark:text-dark-text hidden md:block">
          BookVerse
        </span>
      </div>
      <div className="bg-light-primary dark:bg-dark-primary p-2 rounded-full w-[200px] md:min-w-[300px] flex justify-evenly">
        <div>
          <Link to="/">
            <Home size={24} className="md:hidden"
            />
            <p className="hidden md:block">Home</p>
          </Link>
        </div>
        <div>
          <Link to="/explore">
            <Compass size={24} className="md:hidden"
            />
            <p className="hidden md:block">Explore</p>
          </Link>
        </div>
        {user && (
          <div>
            <Link to="/library">
              <Library size={24} className="md:hidden"/>
              <p className="hidden md:block">Library</p>
            </Link>
          </div>
        )}
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
                {/* {user && (
          <div className=" bg-light-background dark:bg-dark-primary rounded-full cursor-pointer p-1">
            <svg
              width="24px"
              height="24px"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-light-text dark:text-dark-text"
              onClick={handleLogOut}
            >
              <path
                d="M2 18V6C2 4.34315 3.34315 3 5 3H7C8.65685 3 10 4.34315 10 6V18C10 19.6569 8.65685 21 7 21H5C3.34315 21 2 19.6569 2 18Z"
                stroke="#000000"
                stroke-width="1.5"
              ></path>
              <path
                d="M16 3H18C20.2091 3 22 4.79086 22 7V17C22 19.2091 20.2091 21 18 21H16"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M10 12H18M18 12L15 9M18 12L15 15"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        )} */}
      <div className="absolute right-2 top-[92vh] bg-light-background dark:bg-dark-background rounded-full cursor-pointer p-1">
        <div className=" bg-light-background dark:bg-dark-background rounded-full cursor-pointer p-1">
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
      </div>
    </nav>
  );
}
