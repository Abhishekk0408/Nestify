import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import Redirect
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  const auth = getAuth();
  const Navigate = useNavigate();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactLandlord, setContactLandlord] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [ setRedirectPath] = useState(null);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user); // Simplified user authentication check
    });

    return () => unsubscribe();
  }, [auth]);

  const handlePaymentClick = () => {

    if (userLoggedIn) {
      Navigate("/payment");
    } else {
      Navigate("/sign-in", { state: { returnUrl: `/listing/${params.listingId}` } });
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const isBookedAndPaid = listing?.booked && listing?.paid && listing?.userRef === auth.currentUser?.uid;

  
  return (
    <main>
      {isBookedAndPaid ? (
        <div className="text-center text-red-500 font-bold mt-4">
          This property has already been booked .
        </div>
      ) : (
        <>
          <Swiper
            className="flex flex-col max-w-6xl max-xl:max-w-[94%] mt-6 mx-auto"
            slidesPerView={1}
            navigation
            pagination={{ type: "progressbar" }}
            effect="fade"
            autoplay={{ delay: 3000 }}
          >
            <div className="md:w-2/3 md:pr-6 md:rtl:pl-6">
              <div className="flex flex-col">
                {listing.imgUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="relative w-full h-[300px] font-light mb-6 order-4 max-sm:order-3 rounded transition duration-2 ease-out text-gray-500 shadow-lg hover:shadow-[0_0_12px_2px_rgba(71,85,95,0.20)] bg-white dark:bg-darkBackground"
                      style={{
                        background: `url(${listing.imgUrls[index]}) center no-repeat`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </div>
            </div>
          </Swiper>
  
          <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
            <div className="w-full">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold mb-3 text-blue-900">
                  {listing.name} - ₹
                  {listing.offer
                    ? listing.discountedPrice.toLocaleString()
                    : listing.regularPrice.toLocaleString()}
                  {listing.type === "rent" ? " / month" : ""}
                  {listing.type === "sale" ? " / month" : ""}
                </p>
  
                <button
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-green-600"
                  onClick={handlePaymentClick}
                >
                  Go to Payment
                </button>
              </div>
  
              <div className="flex items-center mt-6 mb-3 font-semibold">
                {listing.address}
              </div>
              <div className="flex justify-start items-center space-x-4 w-[75%]">
                {listing.offer && (
                  <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                    ₹ {listing.regularPrice - listing.discountedPrice} discount
                  </p>
                )}
              </div>
              <p className="mt-3 mb-3">
                <span className="font-semibold">Description - </span>
                {listing.description}
              </p>
              <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
                <li className="flex items-center whitespace-nowrap">
                  <FaBed className="text-lg mr-1" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} Beds`
                    : "1 Bed"}
                </li>
                <li className="flex items-center whitespace-nowrap">
                  <FaBath className="text-lg mr-1" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} Baths`
                    : "1 Bath"}
                </li>
                <li className="flex items-center whitespace-nowrap">
                  <FaParking className="text-lg mr-1" />
                  {listing.parking ? "Parking spot" : "No parking"}
                </li>
                <li className="flex items-center whitespace-nowrap">
                  <FaChair className="text-lg mr-1" />
                  {listing.furnished ? "Furnished" : "Not furnished"}
                </li>
              </ul>
              {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                <div className="mt-6">
                  <button
                    onClick={() => setContactLandlord(true)}
                    className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
                  >
                    Contact Landlord
                  </button>
                </div>
              )}
              {contactLandlord && (
                <Contact userRef={listing.userRef} listing={listing} />
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}  
