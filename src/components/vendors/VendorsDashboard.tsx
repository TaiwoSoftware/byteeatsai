/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Auth/supabaseClient";
import { FoodAnalysisPanel } from "./FoodAnalysisPanel";
import { PostFoodForm } from "./PostFoodForm";
import { VendorDashboardHeader } from "./VendorDashboardHeader";
import { VendorDetailsCard } from "./VendorDetailsCard";
import { VendorMetrics } from "./VendorMetrics";
import type {
  Food,
  FoodAnalysis,
  Order,
  OrderItem,
  Vendor,
} from "./vendorDashboardTypes";

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
  const [deletingFoodId, setDeletingFoodId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchVendorFoodsAndOrders = async (vendorId: string) => {
    const [
      { data: foodsData, error: foodsError },
      { data: ordersData, error: ordersError },
    ] = await Promise.all([
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
          return;
        }

        setVendor(vendorData[0]);
        await fetchVendorFoodsAndOrders(vendorData[0].id);
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

        const { error: uploadError } = await supabase.storage
          .from("food-images")
          .upload(filePath, foodImage);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("food-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("foods").insert([
        {
          name: foodName,
          price: parseFloat(foodPrice),
          details: foodDetails,
          vendor_id: vendor.id,
          image_url: imageUrl,
        },
      ]);

      if (insertError) throw insertError;

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

  const handleDeleteFood = async (food: Food) => {
    if (!vendor) return;

    const shouldDelete = window.confirm(
      `Delete "${food.name}" from your menu? This cannot be undone.`
    );

    if (!shouldDelete) return;

    setDeletingFoodId(food.id);
    try {
      const { error: deleteError } = await supabase
        .from("foods")
        .delete()
        .eq("id", food.id)
        .eq("vendor_id", vendor.id);

      if (deleteError) throw deleteError;

      await fetchVendorFoodsAndOrders(vendor.id);
    } catch (err: any) {
      alert("Error deleting food: " + err.message);
    } finally {
      setDeletingFoodId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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

        return { order, matchingItems };
      })
      .filter(({ matchingItems }) => matchingItems.length > 0);

    const unitsSold = matchingOrders.reduce(
      (total, { matchingItems }) =>
        total +
        matchingItems.reduce(
          (itemTotal, item) => itemTotal + (item.quantity || 1),
          0
        ),
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

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading vendor data...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-10">Error: {error}</div>;
  }

  if (!vendor) {
    return (
      <div className="text-center py-10 text-xl">
        No vendor found. Please create one.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <VendorDashboardHeader
          vendor={vendor}
          onRefresh={() => fetchVendorFoodsAndOrders(vendor.id)}
          onLogout={handleLogout}
        />

        <VendorMetrics
          foodsCount={foods.length}
          totalFoodOrders={totalFoodOrders}
          totalUnitsSold={totalUnitsSold}
          totalRevenue={totalRevenue}
        />

        <main className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <FoodAnalysisPanel
            foodsCount={foods.length}
            foodAnalysis={foodAnalysis}
            topFood={topFood}
            deletingFoodId={deletingFoodId}
            onDeleteFood={handleDeleteFood}
          />

          <aside className="flex flex-col gap-6">
            <VendorDetailsCard vendor={vendor} />
            <PostFoodForm
              foodName={foodName}
              foodPrice={foodPrice}
              foodDetails={foodDetails}
              foodImage={foodImage}
              posting={posting}
              onFoodNameChange={setFoodName}
              onFoodPriceChange={setFoodPrice}
              onFoodDetailsChange={setFoodDetails}
              onFoodImageChange={setFoodImage}
              onSubmit={handlePostFood}
            />
          </aside>
        </main>
      </div>
    </div>
  );
};
