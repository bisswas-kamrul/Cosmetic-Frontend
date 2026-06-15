import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  badge: "",
  color: "",
  size: "",
};

const VendorDashboard = () => {
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const isVendor = Boolean(token && userInfo?.role === "vendor");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const fetchVendorData = useCallback(async () => {
    if (!isVendor) {
      return;
    }

    try {
      setLoading(true);

      const [productRes, orderRes] = await Promise.all([
        axios.get("http://localhost:4000/my-products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://localhost:4000/Vendor-Orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setProducts(productRes.data.data || []);
      setOrders(orderRes.data.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load vendor dashboard");
    } finally {
      setLoading(false);
    }
  }, [isVendor, token]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  if (!isVendor) {
    return <Navigate to="/Login" />;
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImage(null);
    setEditingId(null);
  };

  const submitProduct = async (event) => {
    event.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      return alert("Product name, price, and stock are required");
    }

    if (!editingId && !image) {
      return alert("Product image is required");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("badge", form.badge);
    formData.append(
      "attributes",
      JSON.stringify({
        color: form.color,
        size: form.size,
      }),
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:4000/UpdateCreate/${editingId}`,
          formData,
          {
            headers: authHeaders,
          },
        );
      } else {
        await axios.post("http://localhost:4000/create", formData, {
          headers: authHeaders,
        });
      }

      resetForm();
      fetchVendorData();
    } catch (error) {
      alert(error.response?.data?.message || "Product save failed");
    }
  };

  const editProduct = (product) => {
    const attributes =
      typeof product.attributes === "string"
        ? JSON.parse(product.attributes)
        : product.attributes || {};

    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      badge: product.badge || "",
      color: attributes.color || "",
      size: attributes.size || "",
    });
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/DeleteProduct/${id}`, {
        headers: authHeaders,
      });

      fetchVendorData();
    } catch (error) {
      alert(error.response?.data?.message || "Product delete failed");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:4000/Vendor-Orders/${orderId}/status`,
        { status },
        {
          headers: authHeaders,
        },
      );

      fetchVendorData();
    } catch (error) {
      alert(error.response?.data?.message || "Order update failed");
    }
  };

  const earnings = orders.reduce((total, order) => {
    const vendorItemsTotal = (order.items || [])
      .filter((item) => String(item.vendorId) === String(userInfo._id))
      .reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      );

    return total + vendorItemsTotal;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage products and view your orders.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="border rounded p-4">
            <p className="font-semibold">{userInfo.name}</p>
            <p className="text-sm text-gray-600">{userInfo.email}</p>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm text-gray-600">Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="border rounded p-4">
            <p className="text-sm text-gray-600">Earnings</p>
            <p className="text-2xl font-bold">TK {earnings}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          <form onSubmit={submitProduct} className="border rounded p-5 h-fit">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full border rounded p-3 mb-3"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border rounded p-3 mb-3"
              rows="3"
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border rounded p-3 mb-3"
            />
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full border rounded p-3 mb-3"
            />
            <input
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="Badge"
              className="w-full border rounded p-3 mb-3"
            />
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Color"
              className="w-full border rounded p-3 mb-3"
            />
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="Size"
              className="w-full border rounded p-3 mb-3"
            />
            <input
              type="file"
              onChange={(event) => setImage(event.target.files[0])}
              className="w-full border rounded p-3 mb-4"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-black text-white rounded p-3 cursor-pointer">
                {editingId ? "Save Product" : "Add Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border rounded px-4 cursor-pointer">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">My Products</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {products.length === 0 ? (
                  <p>No products added yet.</p>
                ) : (
                  products.map((product) => (
                    <div key={product._id} className="border rounded p-4">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-44 object-cover rounded mb-3"
                      />
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between mt-3">
                        <span>TK {product.price}</span>
                        <span>{product.stock} in stock</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => editProduct(product)}
                          className="px-3 py-2 bg-green-600 text-white rounded cursor-pointer">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="px-3 py-2 bg-red-600 text-white rounded cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Vendor Orders</h2>
              <div className="grid gap-4">
                {orders.length === 0 ? (
                  <p>No orders for your products yet.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="border rounded p-4">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-semibold">{order.name}</p>
                          <p className="text-sm text-gray-600">{order.phone}</p>
                        </div>
                        <span className="font-semibold">{order.status}</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {order.items
                          ?.filter(
                            (item) =>
                              String(item.vendorId) === String(userInfo._id),
                          )
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between border-t pt-2">
                              <span>
                                {item.name} x {item.quantity}
                              </span>
                              <span>TK {item.price * item.quantity}</span>
                            </div>
                          ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {["processing", "shipped", "delivered"].map(
                          (nextStatus) => (
                            <button
                              key={nextStatus}
                              onClick={() =>
                                updateOrderStatus(order._id, nextStatus)
                              }
                              className="px-3 py-2 border rounded cursor-pointer capitalize">
                              {nextStatus}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
