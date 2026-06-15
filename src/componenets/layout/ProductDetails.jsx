import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import { addToCart, buyNow } from "../../reduxFloder/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const [size, setSize] = useState("");

  useEffect(() => {
    axios
      .get(`https://cosmetic-backend-e6ia.onrender.com/singleproduct/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((error) => console.error(error));

    axios
      .get(`https://cosmetic-backend-e6ia.onrender.com/products/${id}/reviews`)
      .then((res) => setReviews(res.data.data || []))
      .catch((error) => console.error(error));
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/Login");
      return;
    }

    if (!reviewForm.comment.trim()) {
      alert("Please write your review");
      return;
    }

    try {
      const res = await axios.post(
        `https://cosmetic-backend-e6ia.onrender.com/products/${id}/reviews`,
        reviewForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setReviews((items) => [
        res.data.data,
        ...items.filter((item) => item._id !== res.data.data._id),
      ]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Review submit failed");
    }
  };

  // LOADING
  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-xl">
        Loading Product...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-6">
        {/* IMAGE SECTION */}
        <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4">
          <img
            src={
              Array.isArray(product.images) ? product.images[0] : product.images
            }
            alt={product.name}
            className="w-full h-500px object-cover rounded-xl shadow-md hover:scale-105 transition duration-300"
          />
        </div>

        {/* DETAILS SECTION */}
        <div className="flex flex-col justify-between">
          <div>
            {/* NAME */}
            <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>

            {/* PRICE */}
            <p className="text-3xl font-bold text-green-600 mt-4">
              ৳ {product.price}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Sold By: {product.vendorName}
            </p>

            {/* DESCRIPTION */}
            <p className="mt-5 text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span className="text-xs">
                {product.rating} ({product.reviews})
              </span>
            </div>

            {/* COLOR */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Product Color
              </h3>

              {(() => {
                const attrs =
                  typeof product.attributes === "string"
                    ? JSON.parse(product.attributes)
                    : product.attributes;

                return (
                  <div className="flex items-center gap-3">
                    {/* COLOR CIRCLE */}
                    <div
                      className="w-10 h-10 rounded-full border-2 shadow-md"
                      style={{
                        backgroundColor: attrs?.color,
                      }}></div>

                    {/* COLOR NAME */}
                    <span className="capitalize text-lg font-medium">
                      {attrs?.color}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* SIZE */}
            <div className="mt-8">
              <h3 className="font-semibold mb-3 text-gray-700">Select Size</h3>

              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-5 py-2 border rounded-lg transition duration-200 cursor-pointer ${
                      size === s
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-100"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col gap-4">
            {/* ADD TO CART */}
            <Button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: String(product._id),

                    name: product.name,

                    price: product.price,

                    images: product.images,

                    vendorId: product.vendorId,

                    vendorName: product.vendorName,

                    size,

                    // COLOR ADD
                    color:
                      typeof product.attributes === "string"
                        ? JSON.parse(product.attributes)?.color
                        : product.attributes?.color,
                  }),
                )
              }
              className="w-full py-6 text-lg cursor-pointer">
              Add To Cart
            </Button>

            {/* ORDER NOW */}
            <Button
              onClick={() => {
                const orderItem = {
                  id: String(product._id),

                  name: product.name,

                  price: product.price,

                  images: product.images,

                  size,

                  vendorId: product.vendorId,

                  vendorName: product.vendorName,

                  color:
                    typeof product.attributes === "string"
                      ? JSON.parse(product.attributes)?.color
                      : product.attributes?.color,
                };

                //  quantity সবসময় 1 থাকবে
                dispatch(buyNow(orderItem));

                navigate("/checkout");
              }}
              className="w-full bg-amber-400 hover:bg-amber-500 text-white text-lg py-6 rounded cursor-pointer">
              Order Now
            </Button>

            {/* CONTINUE SHOPPING */}
            <Link to="/">
              <Button
                variant="outline"
                className="w-full py-6 text-lg cursor-pointer">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-10 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.userName}</span>
                      <span className="text-sm text-amber-600">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={submitReview}
            className="w-full md:w-96 border rounded-xl p-4">
            <h3 className="font-semibold mb-3">Write a Review</h3>
            <select
              value={reviewForm.rating}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  rating: Number(event.target.value),
                })
              }
              className="w-full border rounded p-3 mb-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Stars
                </option>
              ))}
            </select>
            <textarea
              value={reviewForm.comment}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, comment: event.target.value })
              }
              className="w-full border rounded p-3 mb-3"
              rows="4"
              placeholder="Share your experience"
            />
            <Button type="submit" className="w-full cursor-pointer">
              Submit Review
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
