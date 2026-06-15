import React from "react";
import Bennar from "../layout/Bennar";
import Features from "../layout/Features";
import CategoriesSection from "../layout/CategoriesSection";
import ProductsSection from "../layout/ProductsSection";
import Testimonials from "../layout/Testimonials";
import Aboute from "../layout/About";


const Home = () => {
  return (
    <>
      <Bennar />
      <Features />
      <CategoriesSection />
      <ProductsSection />
      <Testimonials />
      <Aboute />
    </>
  );
};

export default Home;
