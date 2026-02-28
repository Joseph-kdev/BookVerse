import { NavLink, useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../config/UserAuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { BookOpen, Compass, Home, Library, LogOut } from "lucide-react";
import { circInOut, motion, useScroll, useTransform } from "framer-motion";

export default function Nav() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const { user } = useUserAuthContext();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const {scrollY} = useScroll()

  return (
    <nav className="flex justify-between p-2 md:px-4 sticky top-0 items-center z-50 backdrop-blur">
      <div className="flex items-center">
        <BookOpen className="h-8 w-8 text-amber-500" />
        <span className="absolute left-12 ml-2 text-xl font-bold text-dark-text dark:text-dark-text hidden md:block">
          BookVerse
        </span>
      </div>
      <div className="bg-light-primary dark:bg-dark-primary p-2 rounded-full w-[200px] md:min-w-[300px] flex justify-evenly text-light-background/80 dark:text-dark-background">
        <div>
          <NavLink to="/" className={({isActive}) => isActive ? "text-light-accent" : ""}>
            <Home size={24} className="md:hidden"
            />
            <p className="hidden md:block">Home</p>
          </NavLink>
        </div>
        <div>
          <NavLink to="/explore" className={({isActive}) => isActive ? "text-light-accent" : ""}>
            <Compass size={24} className="md:hidden"
            />
            <p className="hidden md:block">Explore</p>
          </NavLink>
        </div>
        {user && (
          <div>
            <NavLink to="/library" className={({isActive}) => isActive ? "text-light-accent" : ""}>
              <Library size={24} className="md:hidden"/>
              <p className="hidden md:block">Library</p>
            </NavLink>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 ml-1 cursor-pointer">
        <NavLink to="/search" className={({isActive}) => isActive ? "text-light-accent" : ""}>
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
        </NavLink>
        {user && (
          <button
            onClick={handleLogOut}
            className="text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-light-accent transition-colors"
            title="Log Out"
          >
            <LogOut className="size-6" />
          </button>
        )}
      </div>
      {/* <div className="absolute right-2 top-[92vh] bg-light-background dark:bg-dark-background rounded-full cursor-pointer p-1">
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
      </div> */}
    </nav>
  );
}
