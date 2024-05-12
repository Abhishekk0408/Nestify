import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Slide } from "react-awesome-reveal";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <Slide direction="left" delay={250} cascade>
    <li
     id="my-slide"
     className="bg-white group rounded-none flex flex-col justify-between items-center shadow-md hover:shadow-xl transition-shadow w-full duration-300 overflow-hidden">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <div className="p-0 m-0 inline-block w-full relative">
          <div className="relative shadow-md hover:shadow-lg group h-[26rem] w-full">
            <img
              style={{
                // transform the image
                transition: "transform 1s ease-in-out",
              }}
              width={"100%"}
              height={"100%"}
              // scale to size how much transform
              className="h-full group-hover:scale-110 absolute object-cover brightness-90 dark:brightness-75"
              src={listing.imgUrls[0]}
              effect="blur"
            />

            <div className="absolute bottom-3 px-2 sm:px-4 transform transition-transform group-hover:-translate-y-8 duration-[.5s] ease-in-out">
              <div className="flex items-center space-x-1">
                <h1 className="text-white truncate text-2xl font-semibold">
                  {listing.name}
                </h1>
              </div>

              <h3 className="flex text-white truncate py-2 text-lg font-semibold">
              ₹
                {listing.offer
                  ? listing.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : listing.regularPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.type === "rent" && " / month"}
                {listing.type === "sale" && " / month"}
              </h3>
              <div div className="flex items-center mt-[10px] space-x-3">
                <div className="h-[15px] w-[2px] bg-white "></div>
                <p className="font-medium max-sm:text-sm text-white">
                  {listing.type === "rent" ? "Hostel" : "Pg"}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 w-full left-1 transform translate-y-full group-hover:translate-y-0 duration-[.5s] ease-in-out">
              <Link to={`/category/${listing.type}/${id}`}>
                <p className="text-start text-white text-sm px-4 pb-2 font-medium">
                  {"View Details"}
                </p>
              </Link>
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
          className="absolute bottom-2 right-7 h-4 cursor-pointer "
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
    </Slide>
  );
}
