import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      name,
      email,
      message,
    };

    try {
      const res = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const data = await res.json();

      toast.success("Message Sent");

      // clear input
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Toaster />

        <div className="w-full max-w-2xl bg-white p-6">
          <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />

            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              className="w-full p-3 border rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-3 rounded-lg cursor-pointer">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
