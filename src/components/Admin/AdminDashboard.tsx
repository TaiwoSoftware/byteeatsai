import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../Auth/supabaseClient";
import type { User } from "@supabase/supabase-js";
import Users from "./Users";
import UserOrders from "./UserOrder";

interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  logo_url: string;
}

interface FoodImage {
  id: string;
  url: string;
  vendor_id: string;
}

export const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalVendors, setTotalVendors] = useState<number>(0);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [foodImages, setFoodImages] = useState<FoodImage[]>([]);
  const [, setUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    const fetchTotalUsers = async () => {
      try {
        const { count, error } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        if (error) throw error;
        if (isMounted) setTotalUsers(count ?? 0);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchVendors = async () => {
      try {
        const { data, error } = await supabase
          .from("vendors")
          .select("id, name, category, email, phone, address, logo_url");

        if (error) throw error;
        if (isMounted) {
          setVendors(data);
          setTotalVendors(data.length);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };

    const fetchFoodImages = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('food-images')
          .list();

        if (error) throw error;

        if (data && isMounted) {
          const imageUrls = await Promise.all(
            data.map(async (file) => {
              const { data: { publicUrl } } = supabase
                .storage
                .from('food-images')
                .getPublicUrl(file.name);
              
              return {
                id: file.id,
                url: publicUrl,
                vendor_id: file.metadata?.vendor_id || ''
              };
            })
          );
          setFoodImages(imageUrls);
        }
      } catch (err) {
        console.error("Error fetching food images:", err);
      }
    };

    // const deleteUser = async (userId: string) => {
    //   try {
    //     const { error } = await supabase
    //       .from('profiles')
    //       .delete()
    //       .eq('id', userId);

    //     if (error) throw error;
        
    //     // Refresh the users count
    //     fetchTotalUsers();
    //   } catch (err) {
    //     console.error("Error deleting user:", err);
    //   }
    // };

    setupAuth();
    fetchTotalUsers();
    fetchVendors();
    fetchFoodImages();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", id);

      if (error) throw error;

      // Refresh the users count and UI
      setTotalUsers((prev) => prev - 1);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-orange-50 flex flex-col lg:flex-row">

  {/* Sidebar */}
  <aside className="w-full lg:w-72 bg-white/90 backdrop-blur shadow-xl p-6 lg:h-screen flex-shrink-0 border-r">
    <h2 className="text-3xl font-extrabold mb-8 text-orange-600 tracking-tight">
      Admin Panel
    </h2>

    <nav className="space-y-2">
      {["Dashboard", "Users", "Vendors", "Content", "Security", "Settings"].map(
        (item) => (
          <Link
            key={item}
            to={`#${item.toLowerCase()}`}
            className="
              block px-4 py-3 rounded-xl
              text-gray-700 font-medium
              transition-all duration-300
              hover:bg-orange-50 hover:text-orange-600
              hover:translate-x-1
            "
          >
            {item}
          </Link>
        )
      )}
    </nav>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-12">

    {/* Header */}
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome, Admin 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s what’s happening today
        </p>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1">
        <p className="text-gray-500 text-sm">Total Users</p>
        <p className="text-4xl font-bold text-gray-800 mt-2">
          {totalUsers}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1">
        <p className="text-gray-500 text-sm">Total Vendors</p>
        <p className="text-4xl font-bold text-gray-800 mt-2">
          {totalVendors}
        </p>
      </div>
    </div>

    {/* Users Section */}
    <section id="users" className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        Users
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <Users onSelectUser={(id: string) => setSelectedUserId(id)} />
      </div>

      {selectedUserId && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={() => deleteUser(selectedUserId)}
            className="
              px-6 py-3 rounded-xl
              bg-red-500 text-white font-semibold
              hover:bg-red-600 transition
              shadow-md hover:shadow-lg
            "
          >
            Delete User
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-4 flex-1">
            <UserOrders userId={selectedUserId} />
          </div>
        </div>
      )}
    </section>

    {/* Vendors Section */}
    <section id="vendors" className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        Vendors
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="
              bg-white rounded-2xl shadow-md p-6
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-300
              flex flex-col
            "
          >
            {/* Vendor Info */}
            <div className="flex items-center mb-4">
              {vendor.logo_url && (
                <img
                  src={vendor.logo_url}
                  alt={`${vendor.name} logo`}
                  className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-orange-200"
                />
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {vendor.name}
                </h3>
                <p className="text-sm text-orange-500 font-medium">
                  {vendor.category}
                </p>
              </div>
            </div>

            {/* Vendor Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold">Email:</span> {vendor.email}</p>
              <p><span className="font-semibold">Phone:</span> {vendor.phone}</p>
              <p><span className="font-semibold">Address:</span> {vendor.address}</p>
            </div>

            {/* Food Images */}
            <div className="mt-5">
              <h4 className="text-sm font-semibold mb-3 text-gray-700">
                Food Images
              </h4>

              <div className="grid grid-cols-3 gap-2">
                {foodImages
                  .filter((img) => img.vendor_id === vendor.id)
                  .map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt="Food item"
                      className="
                        w-full h-20 object-cover rounded-xl
                        hover:scale-105 transition
                      "
                    />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
</div>


  );
};

export default AdminDashboard;