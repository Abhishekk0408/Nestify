import { useEffect, useState, useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useDarkSide from "./darkmode/useDarkSide";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { Toaster } from "sonner";

export default function Header() {
 // get the dark mode
 const [themeColor, setThemeColor] = useState("light");

 // dark mode stuff:
 const [colorTheme, setTheme] = useDarkSide();

 const [darkSide, setDarkSide] = useState(
   colorTheme === "light" ? true : false
 );
  const dropdownRef = useRef(null); // Create a ref for the dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pageState, setPageState] = useState("Sign in");
  const location = useLocation();
  const navigate = useNavigate();

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign in");
      }
    });
        // Add event listener to close dropdown when clicking outside
        const handleClickOutside = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownOpen(false);
          }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
  }, [auth]);

  
  const toggleDarkMode = (checked) => {
    const color = localStorage.getItem("theme");
    setThemeColor(color);
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  function pathMatchRoute(route) {
    return route === location.pathname;
  }

  return (
    <>
      <Toaster
        richColors
        position="top-center"
        invert={true}
        theme={themeColor === "dark" ? "dark" : "light"}
      />
      <div className={`transition-all duration-200 ease-in-out border-b dark:border-b-gray-700 py-1 shadow-md bg-headerBackground dark:bg-darkBackground sticky w-full top-0 z-40`}>
        <header className={`flex text-black dark:text-white justify-between px-3 max-w-6xl mx-auto`}>
          <div className="flex items-center justify-normal font-bold space-x-4 rtl:space-x-0">
            <h1 className="cursor-pointer text-2xl">
              <a href="/">
                Nest
                <span className="text-blue-600">ify</span>
              </a>
            </h1>
          </div>
          <div className="flex items-center justify-center space-x-3 xs:space-x-6 rtl:space-x-reverse">
            <div>
              <DarkModeSwitch
                checked={darkSide}
                onChange={toggleDarkMode}
                className="w-5 h-5 xs:w-[27px] xs:h-[27px]"
              />
            </div>
            <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`cursor-pointer py-3 px-4 text-sm font-semibold ...`}
            >
              Categories
            </button>
              {dropdownOpen && ( // Conditionally render dropdown content based on state
                <ul className="absolute z-10 right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
                  <li className="cursor-pointer py-2 px-4 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <button onClick={() => navigate("/category/rent")}>Hostel</button>
                  </li>
                  <li className="cursor-pointer py-2 px-4 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <button onClick={() => navigate("/category/sale")}>PG</button>
                  </li>
                </ul>
              )}
            </div>
            <ul className="flex space-x-10">
              <li
                className={`cursor-pointer py-3 text-sm font-semibold  dark:text-black${
                  themeColor === "dark" ? "text-black" : "text-white"
                } border-b-3`}
                onClick={() => navigate("/offers")}
              >
                Offers
              </li>
              <li
                className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] border-b-transparent dark:text-white ${
                  (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                  "text-black border-b-red-500"
                }`}
                onClick={() => navigate("/profile")}
              >
                {pageState}
              </li>
            </ul>
          </div>
        </header>
      </div>
    </>
  );
}