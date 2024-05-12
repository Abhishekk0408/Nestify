import React, { useState, useEffect } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import { getAuth, deleteUser, onAuthStateChanged } from "firebase/auth";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  }

  // Fetch listings or other data as needed...
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    async function fetchListings() {
      try {
        const querySnapshot = await getDocs(collection(db, "listings"));
        const fetchedListings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setListings(fetchedListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    }

    fetchListings(); // Call fetchListings here

    return () => unsubscribe();
  }, []);

  // Fetch user details from Firebase Authentication
  useEffect(() => {
    const auth = getAuth();
    const fetchUsers = async () => {
      try {
        const userList = [];
        const usersSnapshot = await getDocs(collection(db, "users"));
        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          userList.push({ id: userDoc.id, ...userData });
        });
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle updating a listing
  async function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
  }

  // Return the AdminPanel component with dark mode switch and listings
  return (
    <div className=" bg-background dark:bg-darkBackground dark:text-white">
      <div className="max-w-6xl px-4  mx-auto">
        <h1 className="text-2xl text-center font-semibold mb-6">Admin Panel</h1>
        <div className="max-w-6xl px-4 mt-6 mx-auto">
          <h4 className="text-2xl text-center font-semibold mb-4">
            User Details
          </h4>
          <table className="mx-auto">
            <thead>
              <tr>
                <th>Email</th>
                <th className="table-cell-space"></th>{" "}
                {/* Add a cell with space */}
                <th>Name</th>
                {/* Remove the "Action" header */}
              </tr>
            </thead>
            <tbody className="text-center">
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td className="table-cell-space"></td> {/* Add space here */}
                  <td>{user.name}</td>
                  {/* Remove the button for deleting user */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
