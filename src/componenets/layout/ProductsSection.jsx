import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import OfferShow from "./OfferShow";

const ProductsSection = () => {
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const ProductShow = async () => {
      try {
        const res = await axios.get("http://localhost:4000/ShowProduct");
        setProducts(res.data.data);
      } catch (error) {
        console.error("Error fetching Product:", error);
      }
    };

    ProductShow();
  }, []);

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold uppercase tracking-[0.2em] text-sm font-medium">
            Curated for You
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mt-2">
            Featured Products
          </h2>

          <div className="mt-10">
            <OfferShow />
          </div>
        </div>

        {/*  Slider */}
        <Swiper
          className="relative w-full max-w-full navigation px-4 lg:px-8 overflow-visible"
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          // navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={Products.length > 4}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}>
          {Products.map((product) => (
            <SwiperSlide key={product._id}>
              <motion.div className="group">
                <div className="relative aspect-square rounded-xl bg-secondary overflow-hidden mb-3">
                  <img
                    src={product.images}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {product.badge && (
                    <span className="absolute top-3 left-3 text-xs z-10 px-2 py-1 rounded bg-black text-white">
                      {product.badge}%
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                    <Link to={`/ProductDetails/${product._id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full cursor-pointer">
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm">{product.name}</h3>

                  <div className="flex gap-2">
                    <span>${product.price}</span>

                    {product.originalPrice && (
                      <span className="line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductsSection;
