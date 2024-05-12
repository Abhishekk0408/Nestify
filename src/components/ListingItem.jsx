import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { LuBedDouble } from "react-icons/lu";
import { FaBath } from "react-icons/fa";
export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="relative  dark:text-black bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={listing.imgUrls[0]}
        />
        <Moment
          className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        
        <div className="w-full p-[10px]">
        <p className="font-semibold m-0 text-xl truncate">{listing.name}</p>
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
         
          <p className="text-[#457b9d] mt-2 font-semibold">
          ₹
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent"  && " / month"}
            {listing.type === "sale"  && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3  ">
            <div className="flex items-center space-x-1">
            <LuBedDouble className="text-primary-500 max-xs:h-3 max-xs:w-3 h-4 w-4" />
              <p className="font-bold text-xs ">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1 ">
            <FaBath className="text-primary-500 max-xs:h-3 max-xs:w-3 h-4 w-4" />
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer  dark:text-black"
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
}
