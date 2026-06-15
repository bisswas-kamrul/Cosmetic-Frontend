import React from 'react'
import { Link } from 'react-router'

const About = () => {
  return (
    <>
    <div id="about" className="px-6 md:px-16 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="text-gray-500 mt-2">
          Learn more about our journey and what we offer
        </p>
      </div>

      {/* Intro */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Who We Are</h2>
        <p className="text-gray-600">
          We are an online cosmetic shop providing 100% original skincare and beauty products. 
          Our goal is to make premium beauty products accessible to everyone in Bangladesh.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-600">
            To deliver authentic and high-quality cosmetic products at affordable prices.
          </p>
        </div>

        <div className="p-5 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-gray-600">
            To become one of the most trusted beauty brands in Bangladesh.
          </p>
        </div>
      </div>

      {/* Services */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
        <ul className="grid md:grid-cols-2 gap-4 text-gray-600">
          <li>✔ Skincare Products</li>
          <li>✔ Makeup Items</li>
          <li>✔ Hair Care Products</li>
          <li>✔ Fast & Secure Delivery</li>
        </ul>
      </div>

      {/* Why Choose Us */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
        <ul className="space-y-2 text-gray-600">
          <li> 100% Original Products</li>
          <li> Fast Delivery All Over Bangladesh</li>
          <li> Cash on Delivery Available</li>
          <li> Friendly Customer Support</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center bg-gray-100 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">Want to Know More?</h2>
        <p className="text-gray-600 mb-4">
          Feel free to contact us for any queries or support.
        </p>
       <Link to="/Contact">
        <button className="bg-black text-white px-5 py-2 rounded-xl cursor-pointer">
          Contact Us
        </button>
       </Link>
      </div>
      
    </div>
    </>
  )
}

export default About