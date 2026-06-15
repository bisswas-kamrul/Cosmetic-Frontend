import React from "react";
import { useEffect, useState } from "react";
const OfferShow = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/Offer-Show")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCoupons(data.coupons);
        }
      });
  }, []);
  return (
    <>
      <div className="space-y-5 mb-3 bg-white shadow-xs rounded-2xl p-5">
        {coupons.map((c) => (
          <div key={c._id} className=" text-black p-3 rounded-lg">
            {c.discountPercent}% OFF
            <br />
            Code: <b>{c.code}</b>
            <br />
            Min Purchase: ৳{c.minPurchase}
          </div>
        ))}
      </div>
    </>
  );
};

export default OfferShow;
