import React, { useState } from "react";
import Typed from "typed.js";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Item from "../components/Item";

import "swiper/css";
import "swiper/css/free-mode";
import { FaRegFaceLaughWink } from "react-icons/fa6";
import { FaPeopleCarry } from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import { BsHouse, BsSearchHeart } from "react-icons/bs";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

import { Slide } from "react-awesome-reveal";

const Home = () => {
  const [ setShowChatbot] = useState(false);
  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };
  const navigateTo = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Places for rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);
  // Places for rent

  const [setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Create reference to store the DOM element containing the animation
  const el = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Find Your Hostel ^500", "Find Your PG ^500"],
      typeSpeed: 65,
      showCursor: false,
      smartBackspace: true,
      loop: true,
      loopCount: Infinity,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  const handleSearch = async () => {
    try {
      // Set the search query state
      setSearchQuery(searchQuery.toLowerCase());
      // Navigate directly to the offers page
      navigateToCategory();
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToCategory = () => {
    navigateTo(`/offers`);
  };

  return (
    <>
      <div className="h-[103vh] bg-background dark:bg-darkBackground">
        <div className="">
          <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
            <h1
              ref={el}
              className="font-inter rtl:!font-rabar text-4xl md:text-6xl font-bold text-black dark:text-white"
            ></h1>
            <p className="font-inter rtl:!font-rabar text-base sm:text-lg md:text-xl font-medium mt-6 text-black dark:text-white">
              Discover Your Dream Property with Us
            </p>
          </div>
        </div>
      </div>

      {/* filter */}
      <div className="max-w-[80%] dark:bg-[#18212f] mb-16 w-full flex flex-col justify-between items-start relative mx-auto p-4 rounded-md -mt-56 md:-mt-72">
        <div className="bg-headerBackground dark:bg-[#18212f] shadow-[0px,7px,29px,0px,rgba(100,100,111,0.2)] dark:shadow-[#121924] w-full grid grid-cols-1 max-lg:space-y-5 lg:flex justify-between items-center p-5 md:rounded-md">
          <input
            type="text"
            placeholder="Search Hostel by Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-[100%] outline-none py-2 px-4 rounded-l-md"
          />
          <button
            className="transition duration-200 ease-in-out bg-primary-500 dark:bg-primary-800 hover:bg-primary-600 dark:hover:bg-primary-700 focus:bg-primary-700 dark:focus:bg-primary-600 active:bg-primary-800 dark:active:bg-primary-500 text-white px-5 py-3 rounded-r-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {searchResult.length > 0 ? (
          <div className="search-result-container">
            {searchResult.map((listing) => (
              <div
                key={listing.id}
                className="search-result-item"
                onClick={() => navigateTo(`/listing/${listing.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h2>{listing.data.name}</h2>
                <p>{listing.data.description}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* category */}
      <div className="bg-background dark:bg-darkBackground">
        <div div className="max-w-6xl max-xl:w-[95%] mx-auto pt-4 ">
          <div className="my-16 bg-background dark:bg-darkBackground w-full text-center">
            <h1 className="font-semibold text-3xl text-black dark:text-slate-100">
              Explore Our Properties
            </h1>
            <p className="text-gray-500 dark:text-slate-100 text-sm font-medium mt-1">
              Discover Your Ideal Home with Us
            </p>

            <div className="mt-4 grid justify-center sm:grid-cols-2 gap-4 w-3/4 mx-auto">
              <Slide direction="up" delay={0}>
                <Link
                  to={"/category/rent"}
                  className="cursor-pointer group p-2 sm:p-4 shadow-lg bg-white rounded-lg flex justify-center items-center flex-col hover:scale-105 transition-all duration-300 ease-in-out"
                  style={{
                    background: `url(https://upload.wikimedia.org/wikipedia/commons/e/e8/Hostel_Dormitory.jpg) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                >
                  <div className="pb-8 sm:pb-16"></div>
                  <p className="text-center group-hover:scale-150 transition-all duration-300 ease-in-out">
                    <MdApartment className="w-12 sm:w-16 h-12 sm:h-16 text-center mx-auto mb-3 sm:mb-6 text-white" />
                  </p>
                  <h2 className="font-semibold text-base sm:text-lg text-center text-white mt-2">
                    Hostel
                  </h2>
                  <div className="pb-12 sm:pb-24"></div>
                </Link>
              </Slide>
              <Slide direction="up" delay={150}>
                <Link
                  to={"/category/sale"}
                  className="cursor-pointer group p-2 sm:p-4 shadow-lg bg-white rounded-lg flex justify-center items-center flex-col hover:scale-105 transition-all duration-300 ease-in-out"
                  style={{
                    background: `url(https://images.oyoroomscdn.com/uploads/hotel_image/216433/medium/edulcawxnepw.jpg) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                >
                  <div className="pb-8 sm:pb-16"></div>
                  <p className="text-center group-hover:scale-150 transition-all duration-300 ease-in-out">
                    <BsHouse className="w-12 sm:w-16 h-12 sm:h-16 text-center mx-auto mb-3 sm:mb-6 text-white" />
                  </p>
                  <h2 className="font-semibold text-base sm:text-lg text-center text-white mt-2">
                    Paying Guest
                  </h2>
                  <div className="pb-12 sm:pb-24"></div>
                </Link>
              </Slide>
            </div>
          </div>
          {/* offer hostel pg*/}
          <div>
            
            <div className="max-w-6xl mx-auto pt-4 space-y-6">
              {offerListings && offerListings.length > 0 && (
                <div className="m-2 mb-10 pb-3 text-center">
                  <h2 className="font-semibold text-3xl pb-4 text-black dark:text-slate-100">
                    Recent offers
                  </h2>
              
                 
                  <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                    {offerListings.map((listing) => (
                      <Item
                        key={listing.id}
                        listing={listing.data}
                        id={listing.id}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* images */}

          <div
            id="my-slide"
            className="py-16 mt-12 bg-background dark:bg-darkBackground w-full h-full text-center "
          >
            <h1 className="font-semibold text-3xl dark:text-white">
              {"Why Choose Us"}
            </h1>
            <p className="text-gray-500 dark:text-slate-200 text-sm font-medium">
              {"At Our Company, We Prioritize Your Satisfaction"}
            </p>
            <Slide direction="left" delay={250} cascade>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                <div className="p-6 bg-white dark:bg-[#18212f] pb-12 transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 rounded-lg shadow-md">
                  <p className="text-center">
                    <FaRegFaceLaughWink className="w-16 h-16 text-center mx-auto mb-6 text-white bg-black p-4 rounded-[50%]" />
                  </p>

                  <h2 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-200 mt-2">
                    {"Trusted By Thousands"}
                  </h2>

                  <p className="mt-2 text-gray-800 dark:text-gray-200 text-center">
                    {
                      "Our platform is trusted by thousands of satisfied customers who have found their dream homes with us. We prioritize your trust and satisfaction above all else."
                    }
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-[#18212f] pb-12 transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 rounded-lg shadow-lg">
                  <p className="text-center">
                    <BsSearchHeart className="w-16 h-16 text-center mx-auto mb-6 p-2  text-gray-800 dark:text-gray-200" />
                  </p>

                  <h2 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-200 mt-2">
                    {"Easy Searching"}
                  </h2>

                  <p className="mt-2 text-gray-800 dark:text-gray-200 text-center">
                    {
                      "Finding your perfect property has never been easier. Our intuitive search tools allow you to effortlessly browse through a wide range of listings, tailored to your specific preferences."
                    }
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-[#18212f] pb-12 transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 rounded-lg shadow-lg">
                  <p className="text-center">
                    <RiMoneyDollarCircleLine className="w-16 h-16 text-center mx-auto mb-6 text-white bg-black p-4 rounded-[50%]" />
                  </p>

                  <h2 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-200 mt-2">
                    {"Financing Made Easy"}
                  </h2>

                  <p className="mt-2 text-gray-800 dark:text-gray-200 text-center">
                    {
                      "Navigating the financial aspect of buying a home can be daunting. We simplify the process by providing expert guidance and resources, ensuring your home financing journey is smooth and stress-free."
                    }
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-[#18212f] pb-12 transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 rounded-lg shadow-lg">
                  <p className="text-center">
                    <FaPeopleCarry className="w-16 h-16 text-center mx-auto mb-6 p-2  text-gray-800 dark:text-gray-200 " />
                  </p>

                  <h2 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-200 mt-2">
                    {"See Neighborhoods"}
                  </h2>

                  <p className="mt-2 text-gray-800 dark:text-gray-200 text-center">
                    {
                      "Discover more than just a property; explore vibrant neighborhoods that match your lifestyle. From bustling city centers to serene suburban communities, find the ideal location for your new home."
                    }
                  </p>
                </div>
              </div>
            </Slide>
          </div>
        </div>



        {/* footer */}

        <footer className="bg-background border-t-2 border-border dark:border-slate-700 shadow-2xl py-4 dark:bg-gray-800">
          <div className="w-full mx-auto p-4 flex items-center justify-center">
            <span className="text-lg font-bold text-black sm:text-center dark:text-gray-300">
              © 2024 -
              <a href="https://github.com/Abhishekk0408" target="_blank">
                {" "}
                Abhishek Tiwari{" "}
              </a>
            </span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
