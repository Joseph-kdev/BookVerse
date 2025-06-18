import { useReducer } from "react";
import { userReducer } from "../config/reducers";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase-config";

export default function Login() {
  const [user, dispatch] = useReducer(userReducer, {
    email: "",
    password: "",
    hasAccount: false,
  });

  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Problem logging in" + error);
    }
  };

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const email = user.email;
    const password = user.password;

    if (!email || !password) {
      alert("Please fill in both fields");
    }

    try {
      if (!user.hasAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
        console.log("User created");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
        console.log("user signed in");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex h-screen bg-[url('/homebg1.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full bg-[rgba(0,0,0,0.63)] dark:bg-[rgba(255,255,255,0.11)] flex items-center justify-center h-[100vh] rounded-md">
        <div className="max-w-md w-full p-6 bg-light-primary dark:bg-dark-primary rounded-lg">
        <div className="absolute right-3 top-[20px] bg-light-background dark:bg-dark-background rounded-full cursor-pointer p-1">
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
          <div className="flex justify-center mb-6">
            <img src="/bestseller.svg" alt="logo" className="h-[80px] mx-1" />
          </div>
          {user.hasAccount ? (
            <h1 className="text-3xl font-semibold mb-6 text-light-background dark:text-dark-background text-center">
              Login
            </h1>
          ) : (
            <h1 className="text-3xl font-semibold mb-6 text-light-background dark:text-dark-background text-center">
              Sign Up
            </h1>
          )}
          <h1 className="text-sm font-semibold mb-6 text-light-background dark:text-dark-background text-center">
            Organize, Track and Relish - Your Ebook Sanctuary
          </h1>
          <div className="mt-4 flex flex-col lg:flex-row items-center justify-between">
            <div className="w-full mb-2 lg:mb-0">
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-4"
                  id="google"
                >
                  <path
                    fill="#fbbb00"
                    d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
                  ></path>
                  <path
                    fill="#518ef8"
                    d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
                  ></path>
                  <path
                    fill="#28b446"
                    d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
                  ></path>
                  <path
                    fill="#f14336"
                    d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
                  ></path>
                </svg>{" "}
                Continue with Google
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-light-background dark:text-dark-background text-center">
            <p>or with email</p>
          </div>
          <form action="#" method="POST" className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text text-light-background dark:text-dark-background"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={user.email}
                onChange={(e) =>
                  dispatch({ type: "email-entered", payload: e.target.value })
                }
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-light-background dark:text-dark-background"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={(e) =>
                  dispatch({
                    type: "password-entered",
                    payload: e.target.value,
                  })
                }
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={handleLogin}
                className="w-full bg-light-accent dark:bg-dark-accent text-gray p-2 rounded-md hover:bg-light-secondary dark:hover:bg-dark-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 hover:text-light-background"
              >
                {user.hasAccount ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-center">
            <h3 className="text-light-background dark:text-dark-background">
              {user.hasAccount
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => dispatch({ type: "has-account" })}
                className="text-light-accent dark:text-dark-accent hover:underline"
              >
                {user.hasAccount ? "Sign Up" : "Login"}
              </button>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
