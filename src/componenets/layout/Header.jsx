import React, { useState } from "react";

import { Link } from "react-router-dom";

import { CiSearch } from "react-icons/ci";

import { ShoppingBag, User, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { motion, AnimatePresence } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../reduxFloder/cartSlice";


// ================= Dummy Search Data =================
const dummyData = [
  {
    name: "Category",
    path: "/CategoriesSection",
  },
  {
    name: "Products",
    path: "/ProductsSection",
  },
  {
    name: "About-us",
    path: "/About",
  },
];

// ================= Nav Links =================
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "#products" },
  { label: "Categories", href: "#CategoriesSection" },
  { label: "About", href: "#about" },
];

const Header = () => {
  // ================= States =================
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cart Dropdown
  const [cartOpen, setCartOpen] = useState(false);

  // Search Modal
  const [openSearch, setOpenSearch] = useState(false);

  // Search Input
  const [searchText, setSearchText] = useState("");

  // User Dropdown
  const [show, setShow] = useState(false);

  // ================= Hooks =================
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  // ================= Total Price =================
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // ================= Scroll Top =================
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= User Dropdown =================
  const handelUSRBTN = () => {
    setShow(!show);
  };
  // ================= hendeldSearchBTN =================
  const hendeldSearchBTN = () => {
    setOpenSearch(!openSearch);
  };


  // ================= Live Search =================
  const filteredData =
    searchText.trim() === ""
      ? dummyData
      : dummyData.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()),
        );

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div
          onClick={scrollToTop}
          className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* ================= Logo ================= */}
          <a
            href="/"
            className="heading-display text-2xl font-bold tracking-wide text-foreground">
            BELLE<span className="text-gold">.</span>
          </a>

          {/* ================= Desktop Nav ================= */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>

          {/* ================= Icons ================= */}
          <div className="flex items-center gap-3">
            {/* ================= Search Button ================= */}
            <button onClick={hendeldSearchBTN}>
              <CiSearch className="h-5 w-5 cursor-pointer" />
            </button>
            {/* ================= User ================= */}
            <div className="relative">
              <User onClick={handelUSRBTN} className="h-5 w-5 cursor-pointer" />

              {/* ================= User Dropdown ================= */}
              {show && (
                <div className="absolute right-0 top-10 z-50 w-40 rounded-md bg-white p-2 shadow-lg">
                  <Link to={"/Login"}>
                  <button
                    // onClick={handelUSRDASHBROADBTN}
                    className="w-full rounded px-3 py-2 text-left hover:bg-[#FFF6F2]">
                    My Account
                  </button>
                  </Link>
                </div>
              )}
            </div>

            {/* ================= Cart Button ================= */}
            <Button
              onClick={() => setCartOpen(!cartOpen)}
              variant="ghost"
              size="icon"
              className="relative cursor-pointer">
              <ShoppingBag className="h-5 w-5" />

              {/* Cart Count */}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {cartItems.length}
              </span>
            </Button>

            {/* ================= Cart Dropdown ================= */}
            {cartOpen && (
              <div className="absolute right-4 top-16 z-50 max-h-[70vh] w-80 overflow-y-auto rounded-lg bg-white p-4 shadow-lg sm:w-96">
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-500">Cart Empty</p>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="mb-3 flex flex-col gap-1 border-b pb-2">
                        <h3 className="font-medium">
                          {item.name || item.title}
                        </h3>

                        <img
                          src={
                            Array.isArray(item.images)
                              ? item.images[0]
                              : item.images
                          }
                          className="h-12 w-12 rounded object-cover"
                          alt=""
                        />

                        <p className="text-gray-600">${item.price}</p>

                        <p className="text-gray-600">{item.size}</p>

                        <div className="flex items-center gap-2">
                          <div
                            className="h-5 w-5 rounded-full border"
                            style={{
                              backgroundColor: item.color?.toLowerCase(),
                            }}></div>

                          <span className="capitalize text-sm">
                            {item.color}
                          </span>
                        </div>

                        {/* Quantity */}
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            className="rounded bg-gray-200 px-2 py-1"
                            onClick={() => dispatch(decreaseQty(item.id))}>
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            className="rounded bg-gray-200 px-2 py-1"
                            onClick={() => dispatch(increaseQty(item.id))}>
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="mt-1 text-left text-sm text-red-500">
                          Remove
                        </button>
                      </div>
                    ))}

                    {/* Total */}
                    <h3 className="mt-2 text-lg font-bold">Total: ${total}</h3>

                    {/* Checkout */}
                    <button
                      onClick={() => {
                        setCartOpen(false);

                        navigate("/checkout", {
                          state: { cartItems, total },
                        });
                      }}
                      className="mt-3 w-full cursor-pointer rounded bg-black py-2 text-white hover:bg-gray-800">
                      Checkout Button
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ================= Mobile Menu ================= */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* ================= Mobile Nav ================= */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t bg-background md:hidden">
              <nav className="flex flex-col gap-3 p-4">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="py-2 text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
 

      {/* ================= Search Modal ================= */}
      {openSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-20">
          <div className="w-full max-w-xl rounded-lg bg-white p-5 shadow-lg">
            {/* Close Button */}
            <button onClick={() => setOpenSearch(false)} className="mb-3">
              X
            </button>

            {/* Input */}
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border p-2"
            />

            {/* Result */}
            <div className="mt-4">
              {filteredData.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setOpenSearch(false)}>
                  <p className="cursor-pointer p-2 hover:bg-gray-100">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
