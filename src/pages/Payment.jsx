import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "emailjs-com";
import checkmarkGif from "../components/images/check.gif";
const PaymentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    aadharNumber: "",
    panCardNumber: "",
    paymentType: "",
    paymentDetails: "",
    cardNumber: "",
    cvv: "",
  });
  const [theme, setTheme] = useState("light");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form fields
    const {
      name,
      email,
      phoneNumber,
      aadharNumber,

      paymentType,
      paymentDetails,
      cardNumber,
      cvv,
    } = formData;

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!aadharNumber.trim() || !/^\d{12}$/.test(aadharNumber)) {
      alert("Please enter a valid 12-digit Aadhar Card number.");
      return;
    }

    if (!paymentType || paymentType === "Select Payment Type") {
      alert("Please select a payment type.");
      return;
    }

    if (paymentType === "upi" && !paymentDetails.trim()) {
      alert("Please enter your UPI ID.");
      return;
    }

    if (paymentType === "card") {
      if (!paymentDetails.trim()) {
        alert("Please enter payment details.");
        return;
      }
      if (!cardNumber.trim() || !/^\d{16}$/.test(cardNumber)) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cvv.trim() || !/^\d{3,4}$/.test(cvv)) {
        alert("Please enter a valid CVV (3 or 4 digits).");
        return;
      }
    }

    emailjs
      .send(
        "service_xpu1wdr",
        "template_32n0k9l",
        formData, // Template parameters (e.g., email, name, etc.)
        "b4_SsbM43Tp_yt7JC"
      )
      .then((response) => {
        console.log("Email sent successfully:", response);
        setBookingConfirmed(true);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div
      className={`max-w-md justify-center items-center mx-auto p-8 rounded-md dark:text-white`}
    >
      {bookingConfirmed ? (
        <div className="text-center">
          <img src={checkmarkGif} alt="Checkmark" className="mx-auto mb-4" />
          <p className="text-2xl font-bold mb-6">
            Your booking has been confirmed!
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setBookingConfirmed(false); // Reset booking confirmation state
              // Redirect to offers page
              window.location.href = "/offers"; // Change the URL to your offers page
            }}
          >
            Make New Booking
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl items-center font-bold mb-6">
            Payment Details
          </h1>
          <div className="grid  grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field  dark:text-black"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field  dark:text-black"
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input-field  dark:text-black"
            />
            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Card Number"
              value={formData.aadharNumber}
              onChange={handleChange}
              className="input-field  dark:text-black"
            />

            <label
              htmlFor="paymentType"
              className="block mt-4 font-semibold col-span-2"
            >
              Payment Type
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="input-field col-span-2  dark:text-black"
            >
              <option>Select Payment Type</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
            {formData.paymentType === "upi" && (
              <input
                type="text"
                name="paymentDetails"
                placeholder="UPI ID (e.g., name@bankname)"
                value={formData.paymentDetails}
                onChange={handleChange}
                className="input-field col-span-2  dark:text-black"
              />
            )}
            {formData.paymentType === "card" && (
              <>
                <input
                  type="text"
                  name="paymentDetails"
                  placeholder="Payment"
                  value={formData.paymentDetails}
                  onChange={handleChange}
                  className="input-field col-span-2  dark:text-black"
                />
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="input-field col-span-2  dark:text-black"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="input-field col-span-2  dark:text-black"
                />
              </>
            )}
          </div>
          <button
            type="submit"
            className={`mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentPage;
