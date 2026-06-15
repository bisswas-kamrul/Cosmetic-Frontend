import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const STORAGE_KEY = "dashboardWishlist";

const defaultWishlist = [
  {
    productId: {
      _id: "demo-1",
      name: "Rose Glow Serum",
      description: "A demo wishlist item saved locally.",
      price: 29,
      images: ["https://via.placeholder.com/320x240?text=Wishlist+Item"],
      vendorName: "Demo Vendor",
    },
  },
];

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const saveToLocal = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const loadFallback = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(stored) && stored.length > 0) {
      setItems(stored);
    } else {
      setItems(defaultWishlist);
      saveToLocal(defaultWishlist);
    }
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://cosmetic-backend-e6ia.onrender.com/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = res.data?.data || [];
      setItems(data);
      saveToLocal(data);
    } catch (error) {
      loadFallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId) => {
    setRemoving(productId);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://cosmetic-backend-e6ia.onrender.com/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const updated = items.filter((item) => item.productId?._id !== productId);
      setItems(updated);
      saveToLocal(updated);
      toast.success("Removed from wishlist");
    } catch (error) {
      const updated = items.filter((item) => item.productId?._id !== productId);
      setItems(updated);
      saveToLocal(updated);
      toast.success("Removed locally from wishlist");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <main className="p-6 bg-gray-50 dark:bg-black dark:text-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wishlist</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Review and remove items saved to your wishlist.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const refreshed =
                JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || [];
              setItems(refreshed);
              toast.success("Wishlist refreshed");
            }}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <p>Loading wishlist...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <p className="text-gray-600 dark:text-gray-300">
              Your wishlist is empty.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => {
              const product = item.productId || item;
              return (
                <Card
                  key={product._id}
                  className="bg-white text-black dark:bg-zinc-900 dark:text-white border">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>
                      {product.vendorName || "Unknown vendor"}
                    </CardDescription>
                  </CardHeader>
                  <div className="grid gap-4 p-4 md:grid-cols-[120px_1fr]">
                    <div className="h-32 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/320x240?text=No+image"
                        }
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.description || "No description available."}
                        </p>
                        <p className="text-lg font-semibold">
                          TK {product.price ?? "0"}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => removeItem(product._id)}
                        disabled={removing === product._id}>
                        {removing === product._id ? "Removing..." : "Remove"}
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </main>
  );
};

export default Wishlist;
