import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

const Checkout = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // COUPON STATE
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  // PAYMENT
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [transactionId, setTransactionId] = useState("");

  // CART ITEMS
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // TOTAL AMOUNT
  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (acc, item) =>
        acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0,
    );
  }, [cartItems]);

  // FINAL TOTAL
  const finalTotal = totalAmount - discount;

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // APPLY COUPON
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      return alert("Please enter coupon code");
    }

    try {
      setLoadingCoupon(true);

      const res = await fetch("http://localhost:4000/Apply-Coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const discountValue = Number(data.discount) || 0;

        setDiscount(discountValue);

        setCouponMessage(
          `Coupon Applied Successfully - Discount ৳${discountValue}`,
        );
      } else {
        setDiscount(0);

        setCouponMessage(data.message || "Invalid Coupon");
      }
    } catch (error) {
      console.log(error);
      setCouponMessage("Server Error");
    } finally {
      setLoadingCoupon(false);
    }
  };

  // ORDER SUBMIT
  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address || !form.email) {
      return alert("Please fill up all checkout details");
    }

    if (cartItems.length === 0) {
      return alert("Your cart is empty");
    }

    if (paymentMethod !== "COD" && !transactionId) {
      return alert("Please enter transaction ID");
    }

    const token = localStorage.getItem("token");

    const orderData = {
      name: form.name,
      phone: form.phone,
      address: form.address,
      email: form.email,
      totalAmount: Number(totalAmount),
      discount: Number(discount),
      finalTotal: Number(finalTotal),
      paymentMethod,
      transactionId,
      couponCode,
      items: cartItems.map((item) => ({
        productId: item.id,

        name: item.name,
        image: Array.isArray(item.images) ? item.images[0] : item.images,

        quantity: Number(item.quantity),
        size: item.size,
        price: Number(item.price),
        color: String(item.color),
      })),
    };

    try {
      const res = await fetch("http://localhost:4000/Checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order Placed Successfully");

        setForm({ name: "", phone: "", address: "", email: "" });
        setPaymentMethod("COD");
        setTransactionId("");
        setCouponCode("");
        setDiscount(0);
        setCouponMessage("");
      } else {
        alert(data.message || "Order Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="border rounded-xl p-5 shadow">
          <h2 className="text-2xl font-bold mb-5">Checkout Details</h2>

          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Your Name"
            className="w-full p-3 border rounded mb-3"
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            placeholder="Phone Number"
            className="w-full p-3 border rounded mb-3"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email"
            className="w-full p-3 border rounded mb-3"
            onChange={handleChange}
          />

          <textarea
            name="address"
            value={form.address}
            placeholder="Address"
            className="w-full p-3 border rounded mb-3"
            rows="4"
            onChange={handleChange}
          />

          {/* PAYMENT */}
          <div className="mt-4">
            <h3 className="font-semibold mb-3">Payment Method</h3>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border p-3 rounded">
              <option value="COD">Cash On Delivery</option>

              <option value="Bkash">bKash</option>

              <option value="Nagad">Nagad</option>
            </select>
          </div>

          {paymentMethod !== "COD" && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full border p-3 rounded"
              />

              <div className="mt-3 bg-gray-100 p-4 rounded">
                <p>bKash/Nagad Number:</p>

                <h2 className="font-bold text-xl">
                  {paymentMethod === "Bkash" ? "01711111111" : "01822222222"}
                </h2>
              </div>
            </div>
          )}

          {/* COUPON */}
          <div className="mt-5">
            <h3 className="font-semibold mb-2">Apply Coupon</h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border p-3 rounded"
              />

              <button
                onClick={handleApplyCoupon}
                disabled={loadingCoupon}
                className="bg-black text-white px-5 rounded cursor-pointer">
                {loadingCoupon ? "Checking..." : "Apply"}
              </button>
            </div>

            {couponMessage && (
              <p
                className={`mt-2 text-sm ${
                  discount > 0 ? "text-green-600" : "text-red-500"
                }`}>
                {couponMessage}
              </p>
            )}
          </div>

          {/* PLACE ORDER */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg mt-6 cursor-pointer">
            Place Order
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="border rounded-xl p-5 shadow">
          <h2 className="text-2xl font-bold mb-5">Your Orders</h2>

          {cartItems.length === 0 ? (
            <p>No products in cart</p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b py-4">
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* IMAGE */}
                    <img
                      src={
                        Array.isArray(item.images)
                          ? item.images[0]
                          : item.images
                      }
                      alt={item.name}
                      className="h-20 w-20 rounded object-cover"
                    />

                    {/* DETAILS */}
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>

                      <p className="text-gray-500">Size: {item.size}</p>

                      {/* COLOR */}
                      <div className="mt-1 flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{
                            backgroundColor: item.color,
                          }}></div>

                        <span className="capitalize">{item.color}</span>
                      </div>

                      {/* QUANTITY */}
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div>
                    <p className="font-medium">
                      ৳ {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}

              {/* PRICE DETAILS */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳ {totalAmount}</span>
                </div>

                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span>- ৳ {discount}</span>
                </div>

                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span>Total</span>
                  <span>৳ {finalTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
