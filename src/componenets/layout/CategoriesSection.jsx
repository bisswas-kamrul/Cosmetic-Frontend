import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://cosmetic-backend-e6ia.onrender.com/Show",
        );
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="heading-display text-3xl md:text-5xl font-bold mt-2 text-foreground">
            Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {categories.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded shadow-md 
              hover:shadow-2xl hover:-translate-y-2 
              transition-all duration-500 animate-fadeUp"
              style={{
                animationDelay: `${index * 0.2}s`,
              }}>
              <div className="overflow-hidden rounded">
                <img
                  src={item.images}
                  alt={item.name}
                  className="w-full h-48 object-cover 
                  hover:scale-110 transition-transform duration-700"
                />
              </div>

              <h3 className="text-xl font-semibold mt-3">{item.name}</h3>

              <p className="text-gray-600 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* animetion css  */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }

          .animate-fadeUp {
            opacity: 0;
            animation: fadeUp 0.8s ease forwards;
          }
        `}
      </style>
    </>
  );
};

export default CategoriesSection;
