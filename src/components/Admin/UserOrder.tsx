import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import type { Database } from "../Auth/database";

type Order = Database["public"]["Tables"]["orders"]["Row"];

interface UserOrdersProps {
  userId: string;
}

const UserOrders = ({ userId }: UserOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Selected userId:", userId);

        if (!userId) {
          setOrders([]);
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("Orders fetched:", data);

        setOrders(data ?? []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found for this user.</p>
      ) : (
        orders.map((order) => {
          // ✅ safer parsing for food items
          let items: any[] = [];

          if (Array.isArray(order.items)) {
            items = order.items;
          } else if (typeof order.items === "string") {
            try {
              items = JSON.parse(order.items);
            } catch {
              items = [];
            }
          }

          return (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-white shadow-md"
            >
              <div className="mb-4">
                <p className="font-semibold text-lg">
                  Order #{order.id}
                </p>

                <p className="text-sm text-gray-500">
                  Placed on:{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>

                <p className="text-sm text-gray-600">
                  User Name: {order.recipient_name}
                </p>

                <p className="text-sm text-gray-600">
                  Delivery Address: {order.address}
                </p>

                <p className="text-sm text-gray-600">
                  Payment Status: {order.payment_status}
                </p>

                <p className="text-sm text-gray-600">
                  Order Status: {order.order_status}
                </p>
              </div>

              {/* FOOD ITEMS DISPLAY */}
              {items.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {items.map((item, idx) => (
                    <div key={idx} className="text-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title || "food"}
                          className="w-full h-28 object-cover rounded-md border"
                        />
                      )}
                      <p className="text-xs mt-1 text-gray-600">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  Total: ${Number(order.total_price ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserOrders;