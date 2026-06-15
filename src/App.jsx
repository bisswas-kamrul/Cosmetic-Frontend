import { Routes, Route } from "react-router";
import "./App.css";
import Rootlayout from "./Rootlayout";
import Home from "./componenets/pages/Home";
import Bennar from "./componenets/layout/Bennar";
import Features from "./componenets/layout/Features";
import CategoriesSection from "./componenets/layout/CategoriesSection";
import ProductsSection from "./componenets/layout/ProductsSection";
import Testimonials from "./componenets/layout/Testimonials";
import About from "./componenets/layout/About";
import Contact from "./componenets/layout/Contact";
import Checkout from "./componenets/layout/Checkout";
import ProductDetails from "./componenets/layout/ProductDetails";
import MyAccountDashboard from "./componenets/layout/MyAccountDashboard";
import OfferShow from "./componenets/layout/OfferShow";
import Login from "./componenets/layout/Login";
import Singup from "./componenets/layout/Singup";
import ForgotPassword from "./componenets/layout/ForgotPassword";
import ResetPassword from "./componenets/layout/ResetPassword";
import VendorDashboard from "./componenets/layout/VendorDashboard";
import Wishlist from "./componenets/layout/Wishlist";
import Notifications from "./componenets/layout/Notifications";
import Security from "./componenets/layout/Security";
import Settings from "./componenets/layout/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Rootlayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Bennar" element={<Bennar />} />
          <Route path="/Features" element={<Features />} />
          <Route path="/CategoriesSection" element={<CategoriesSection />} />
          <Route path="/ProductsSection" element={<ProductsSection />} />
          <Route path="/ProductDetails/:id" element={<ProductDetails />} />
          <Route path="/Testimonials" element={<Testimonials />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/OfferShow" element={<OfferShow />} />
          <Route path="/MyAccountDashboard" element={<MyAccountDashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Singup" element={<Singup />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/VendorDashboard" element={<VendorDashboard />} />
          <Route path="/Wishlist" element={<Wishlist />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/Security" element={<Security />} />
          <Route path="/Settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
