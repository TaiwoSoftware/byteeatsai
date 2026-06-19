import { BarChart3, DollarSign, ShoppingBag, Utensils } from "lucide-react";

interface VendorMetricsProps {
  foodsCount: number;
  totalFoodOrders: number;
  totalUnitsSold: number;
  totalRevenue: number;
}

export const VendorMetrics = ({
  foodsCount,
  totalFoodOrders,
  totalUnitsSold,
  totalRevenue,
}: VendorMetricsProps) => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Foods Posted</p>
          <Utensils className="h-5 w-5 text-orange-600" />
        </div>
        <p className="mt-3 text-3xl font-bold text-slate-950">{foodsCount}</p>
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
  );
};
