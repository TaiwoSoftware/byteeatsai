/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import AccountSetting from "../Setting/AccountSetting";
import { FaStore } from "react-icons/fa";

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Order {
  id: number;
  created_at: string;
  total_price: number;
  items: Array<{
    image: string;
    price: number;
    title: string;
    quantity: number;
  }>;
}

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const Sidebar: React.FC = () => {
  const [ordersCount, setOrdersCount] = useState<number>(0); // Total count of items in the cart
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Fetch cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Set the ordersCount to the length of the cart array
    setOrdersCount(storedCart.length);
  }, []);

  return (

    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4">

        <button
          onClick={() => setOpen(!open)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50
          h-full md:h-auto
          w-72 md:w-64
          bg-gray-900 text-white p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Brand */}
        <h2 className="text-2xl font-bold text-orange-700 mb-10">
          My Account
        </h2>

        {/* Menu */}
        <ul className="space-y-3">
          <li>
            <a
              href="#profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg
              text-gray-300 hover:text-white hover:bg-gray-800 transition"
            >
              <span>👤</span>
              <span>Profile</span>
            </a>
          </li>

          <li>
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-lg
              text-gray-300 hover:text-white hover:bg-gray-800 transition"
            >
              <div className="flex items-center gap-3">
                <span>🛒</span>
                <span>Cart</span>
              </div>

              <span className="bg-orange-700 text-white text-xs px-2 py-1 rounded-full">
                {ordersCount}
              </span>
            </Link>
          </li>

          <li>
            <a
              href="#settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg
              text-gray-300 hover:text-white hover:bg-gray-800 transition"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </a>
          </li>

          <li>
            <a
              href="/vendor_dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg
              text-gray-300 hover:text-white hover:bg-gray-800 transition"
            >
              <FaStore />
              <span>My Shop Dashboard</span>
            </a>
          </li>
        </ul>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} ByteEats
        </p>
      </div>
    </>
  );
};


export const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [, setOrdersCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Typed cartItems as CartItem array
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData?.user) {
        console.error("User not authenticated", authError);
        setError("User not authenticated");
        navigate("/user");
        return;
      }

      const user = authData.user;

      setUserData({
        id: user.id,
        email: user.email!,
        created_at: user.created_at!,
      });

      // Fetch orders placed by the current user
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id);

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        setError("Error fetching orders");
        console.log("Authenticated user ID:", user.id);
      } else {
        setOrders(ordersData || []);

        // Count total items across all orders
        const totalItems = (ordersData ?? []).reduce((acc, order) => {
          const itemCount = Array.isArray(order.items) ? order.items.length : 0;
          return acc + itemCount;
        }, 0);

        setOrdersCount(totalItems);
      }

      setLoading(false);
    };

    fetchUserData();

    if (modalVisible) {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(storedCart);
    }

    // Animation on page load
    gsap.from(".profile-container", { opacity: 0, duration: 1, y: -50 });
    gsap.from(".sidebar", { opacity: 0, duration: 1, x: -100 });
  }, [navigate, modalVisible]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/user");
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome back 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Manage your profile and track your orders
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-orange-700 mb-4">
                  Profile Overview
                </h2>

                {userData ? (
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500">User ID</p>
                      <p className="text-gray-800 font-medium break-all">
                        {userData.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-800 font-medium break-words">
                        {userData.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">Joined</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(userData.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-500">User data not found</p>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>

            {/* Orders Section */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Recent Orders
              </h2>

              {orders.length === 0 ? (
                <p className="text-gray-500">No orders placed yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleOrderClick(order)}
                      className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()} •{" "}
                          {new Date(order.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        <p className="font-semibold text-orange-700">
                          ${order.total_price.toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                            />

                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.title}
                              </p>

                              <p className="text-xs text-gray-500">
                                {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div id="settings" className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Account Setting ⚙️
            </h1>

            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Manage your account to your taste
            </p>
          </div>

          <AccountSetting />
        </div>

        {/* Modal */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Cart Details</h3>

              {cartItems.length === 0 ? (
                <p className="text-gray-500">No items in the cart.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between gap-4"
                    >
                      <span className="break-words">
                        {item.quantity} × {item.title}
                      </span>

                      <span className="font-medium whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={closeModal}
                className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>



  );
};
