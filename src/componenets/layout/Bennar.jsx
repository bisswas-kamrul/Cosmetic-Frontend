import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";

// Images
import heroBg1 from "@/assets/hero-cosmetics.jpg";
import heroBg2 from "../../../src/assets/heroBg2.jpg";
import heroBg3 from "../../../src/assets/heroBg3.jpg";
//  এটা একটা image + content slider (Hero Banner Slider) name react Farmer momion slider
const slides = [
  {
    image: heroBg1,
    tag: "New Collection 2026",
    title: "Reveal Your Natural Glow",
    highlight: "Natural Glow",
    desc: "Discover our premium collection of skincare and cosmetics crafted for radiant, healthy skin.",
  },
  {
    image: heroBg2,
    tag: "Skincare Essentials",
    title: "Care for Your Skin Daily",
    highlight: "Skin Care",
    desc: "Hydrate, protect and nourish your skin with dermatologist-approved formulas.",
  },
  {
    image: heroBg3,
    tag: "Makeup Trends",
    title: "Express Your Beauty Style",
    highlight: "Beauty Style",
    desc: "Explore trending makeup products to enhance your natural beauty.",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
//  এটা একটা image + content slider (Hero Banner Slider) name react Farmer momion slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">

      {/* BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={slide.image}
            alt="banner"
            className="w-full h-full object-cover"
          />

          {/* IMPORTANT FIX */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* CONTENT */}
      <div className="container mx-auto px-4 lg:px-8 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium mb-4 block">
              {slide.tag}
            </span>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              {slide.title.split(slide.highlight)[0]}
              <br />
              <span className="italic font-normal text-gold">
                {slide.highlight}
              </span>
            </h1>

            <p className="text-white/80 text-lg mb-8 max-w-md leading-relaxed">
              {slide.desc}
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link to="/ProductsSection">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 gap-2 cursor-pointer"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white/10 px-8 hover:text-white cursor-pointer"
              >
                Explore
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CONTROLS (FIXED Z-INDEX) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-3 rounded-full text-white hover:bg-black/60"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-3 rounded-full text-white hover:bg-black/60"
      >
        <ChevronRight />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === current ? "bg-gold w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;