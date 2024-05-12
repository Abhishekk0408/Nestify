import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css'; // Import Swiper styles
import 'swiper/css/navigation'; // Import Swiper navigation styles
import 'swiper/css/pagination'; // Import Swiper pagination styles
import 'swiper/css/effect-fade'; // Import Swiper fade effect styles
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper';
import { useNavigate } from "react-router-dom";


export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <Swiper
      navigation
      pagination={{ clickable: true }}
      effect="fade"
      autoplay={{ delay: 3 }}
    >
      {listings.map(({ data, id }) => (
        <SwiperSlide
          key={id}
          onClick={() => navigate(`/category/${data.type}/${id}`)}
        >
          <div
            style={{
              backgroundImage: `url(${data.imgUrls[0]})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              width: "100%",
              height: "300px",
            }}
            className="relative"
          >
            <p className="text-white absolute top-3 left-3 font-medium bg-blue-500 shadow-lg opacity-90 p-2 rounded-xl">
              {data.name}
            </p>
            <p className="text-white absolute bottom-3 left-3 font-semibold bg-red-500 shadow-lg opacity-90 p-2 rounded-xl">
              ${data.discountedPrice ?? data.regularPrice}
              {data.type === "rent" && " / month"}
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
