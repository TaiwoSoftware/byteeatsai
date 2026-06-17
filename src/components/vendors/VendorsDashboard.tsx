/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  DollarSign,
  LogOut,
  MapPin,
  Phone,
  PlusCircle,
  RefreshCw,
  ShoppingBag,
  Store,
  UploadCloud,
  Utensils,
} from "lucide-react";

interface Vendor {
  id: string;
  user_id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  logo_url?: string;
  created_at: string;
}

interface Food {
  id: string;
  name: string;
  price: number;
  details: string;
  vendor_id: string;
  image_url?: string;
  created_at?: string;
}

interface OrderItem {
  id?: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  created_at: string;
  items: OrderItem[] | string;
  order_status?: string;
}

interface FoodAnalysis extends Food {
  orders: number;
  unitsSold: number;
  revenue: number;
  lastOrdered?: string;
}

export const VendorsDashboard = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodDetails, setFoodDetails] = useState("");
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  const fetchVendorFoodsAndOrders = async (vendorId: string) => {
    const [{ data: foodsData, error: foodsError }, { data: ordersData, error: ordersError }] =
      await Promise.all([
        supabase
          .from("foods")
          .select("*")
          .eq("vendor_id", vendorId)
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("id, created_at, items, order_status")
          .order("created_at", { ascending: false }),
      ]);

    if (foodsError) throw foodsError;
    if (ordersError) throw ordersError;

    setFoods(foodsData || []);
    setOrders(ordersData || []);
  };

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          alert("You must be logged in to view the vendor dashboard.");
          navigate("/login");
          return;
        }

        const { data: vendorData, error: vendorError } = await supabase
          .from("vendors")
          .select("*")
          .eq("user_id", user.id)
          .limit(1);

        if (vendorError) throw vendorError;
        if (!vendorData || vendorData.length === 0) {
          setVendor(null);
        } else {
          setVendor(vendorData[0]);
          await fetchVendorFoodsAndOrders(vendorData[0].id);
        }
      } catch (err: any) {
        console.error("Error fetching vendor:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [navigate]);

  const handlePostFood = async () => {
    if (!foodName || !foodPrice || !foodDetails || !vendor) return;

    setPosting(true);
    try {
      let imageUrl = "";

      if (foodImage) {
        const fileExt = foodImage.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `foods/${vendor.id}/${fileName}`;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { error: uploadError } = await supabase.storage
          .from("food-images") // make sure this bucket exists
          .upload(filePath, foodImage);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("food-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("foods").insert([
        {
          name: foodName,
          price: parseFloat(foodPrice),
          details: foodDetails,
          vendor_id: vendor.id,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      alert("Food posted successfully!");
      setFoodName("");
      setFoodPrice("");
      setFoodDetails("");
      setFoodImage(null);
      await fetchVendorFoodsAndOrders(vendor.id);
    } catch (err: any) {
      alert("Error posting food: " + err.message);
    } finally {
      setPosting(false);
    }
  };

  const parseOrderItems = (items: Order["items"]): OrderItem[] => {
    if (Array.isArray(items)) return items;

    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const foodAnalysis: FoodAnalysis[] = foods.map((food) => {
    const matchingOrders = orders
      .map((order) => {
        const matchingItems = parseOrderItems(order.items).filter(
          (item) => item.id === food.id || item.title === food.name
        );

        return {
          order,
          matchingItems,
        };
      })
      .filter(({ matchingItems }) => matchingItems.length > 0);

    const unitsSold = matchingOrders.reduce(
      (total, { matchingItems }) =>
        total +
        matchingItems.reduce((itemTotal, item) => itemTotal + (item.quantity || 1), 0),
      0
    );

    const revenue = matchingOrders.reduce(
      (total, { matchingItems }) =>
        total +
        matchingItems.reduce(
          (itemTotal, item) => itemTotal + item.price * (item.quantity || 1),
          0
        ),
      0
    );

    return {
      ...food,
      orders: matchingOrders.length,
      unitsSold,
      revenue,
      lastOrdered: matchingOrders[0]?.order.created_at,
    };
  });

  const totalRevenue = foodAnalysis.reduce((total, food) => total + food.revenue, 0);
  const totalUnitsSold = foodAnalysis.reduce((total, food) => total + food.unitsSold, 0);
  const totalFoodOrders = foodAnalysis.reduce((total, food) => total + food.orders, 0);
  const topFood = [...foodAnalysis].sort((a, b) => b.revenue - a.revenue)[0];

  if (loading)
    return (
      <div className="text-center py-10 text-xl">Loading vendor data...</div>
    );
  if (error)
    return <div className="text-red-600 text-center py-10">Error: {error}</div>;
  if (!vendor)
    return (
      <div className="text-center py-10 text-xl">
        No vendor found. Please create one.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-orange-50 text-orange-700 ring-1 ring-orange-100">
              {vendor.logo_url ? (
                <img
                  src={vendor.logo_url}
                  alt={vendor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Store className="h-7 w-7" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-orange-700">Vendor Dashboard</p>
              <h2 className="truncate text-2xl font-bold text-slate-950 sm:text-3xl">
                {vendor.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{vendor.category}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => fetchVendorFoodsAndOrders(vendor.id)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Foods Posted</p>
              <Utensils className="h-5 w-5 text-orange-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{foods.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Food Orders</p>
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{totalFoodOrders}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Units Sold</p>
              <BarChart3 className="h-5 w-5 text-violet-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{totalUnitsSold}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Revenue</p>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-700">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </section>

        <main className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:p-6">
              <h3 className="text-xl font-bold text-slate-950">Food Item Analysis</h3>
              <p className="text-sm text-slate-500">
                Track order volume, quantity sold, revenue, and recent activity.
              </p>
            </div>

            {foods.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
                  <Utensils className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900">No foods posted yet</h4>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Add your first food item and this table will start showing performance data.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Food</th>
                        <th className="px-4 py-3 font-semibold">Price</th>
                        <th className="px-4 py-3 font-semibold">Orders</th>
                        <th className="px-4 py-3 font-semibold">Units</th>
                        <th className="px-4 py-3 font-semibold">Revenue</th>
                        <th className="px-6 py-3 font-semibold">Last Ordered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {foodAnalysis.map((food) => (
                        <tr key={food.id} className="transition hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                {food.image_url ? (
                                  <img
                                    src={food.image_url}
                                    alt={food.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <Utensils className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900">
                                  {food.name}
                                </p>
                                {topFood?.id === food.id && food.revenue > 0 && (
                                  <p className="text-xs font-medium text-emerald-700">
                                    Top performer
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">
                            ${Number(food.price).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">{food.orders}</td>
                          <td className="px-4 py-4 text-sm text-slate-700">
                            {food.unitsSold}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-emerald-700">
                            ${food.revenue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {food.lastOrdered
                              ? new Date(food.lastOrdered).toLocaleDateString()
                              : "No orders yet"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 p-4 md:hidden">
                  {foodAnalysis.map((food) => (
                    <article
                      key={food.id}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="flex gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {food.image_url ? (
                            <img
                              src={food.image_url}
                              alt={food.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <Utensils className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-semibold text-slate-950">
                            {food.name}
                          </h4>
                          <p className="mt-1 text-sm text-slate-500">
                            ${Number(food.price).toFixed(2)}
                          </p>
                          {topFood?.id === food.id && food.revenue > 0 && (
                            <p className="mt-1 text-xs font-medium text-emerald-700">
                              Top performer
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Orders</p>
                          <p className="text-lg font-bold text-slate-950">{food.orders}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Units</p>
                          <p className="text-lg font-bold text-slate-950">
                            {food.unitsSold}
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Revenue</p>
                          <p className="text-lg font-bold text-emerald-700">
                            ${food.revenue.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-slate-500">
                        Last ordered:{" "}
                        <span className="font-medium text-slate-700">
                          {food.lastOrdered
                            ? new Date(food.lastOrdered).toLocaleDateString()
                            : "No orders yet"}
                        </span>
                      </p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>

          <aside className="flex flex-col gap-6">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-bold text-slate-950">Vendor Details</h3>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Store className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">{vendor.name}</p>
                    <p className="text-slate-500">{vendor.category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                  <p className="text-slate-700">{vendor.phone}</p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <p className="text-slate-700">{vendor.address}</p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Post Food</h3>
                  <p className="text-sm text-slate-500">Add a new menu item</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Food name
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Jollof rice"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Price
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={foodPrice}
                    onChange={(e) => setFoodPrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Details
                  </span>
                  <textarea
                    placeholder="Describe ingredients, size, or prep details"
                    value={foodDetails}
                    onChange={(e) => setFoodDetails(e.target.value)}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Image
                  </span>
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
                    <UploadCloud className="mx-auto h-6 w-6 text-slate-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setFoodImage(e.target.files[0]);
                        }
                      }}
                      className="mt-3 w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                    />
                    {foodImage && (
                      <p className="mt-2 truncate text-xs text-slate-500">
                        Selected: {foodImage.name}
                      </p>
                    )}
                  </div>
                </label>

                <button
                  onClick={handlePostFood}
                  disabled={posting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PlusCircle className="h-4 w-4" />
                  {posting ? "Posting..." : "Post Food"}
                </button>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
};
