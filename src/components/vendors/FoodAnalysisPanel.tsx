import { Trash2, Utensils } from "lucide-react";
import type { Food, FoodAnalysis } from "./vendorDashboardTypes";

interface FoodAnalysisPanelProps {
  foodsCount: number;
  foodAnalysis: FoodAnalysis[];
  topFood?: FoodAnalysis;
  deletingFoodId: string | null;
  onDeleteFood: (food: Food) => void;
}

export const FoodAnalysisPanel = ({
  foodsCount,
  foodAnalysis,
  topFood,
  deletingFoodId,
  onDeleteFood,
}: FoodAnalysisPanelProps) => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:p-6">
        <h3 className="text-xl font-bold text-slate-950">Food Item Analysis</h3>
        <p className="text-sm text-slate-500">
          Track order volume, quantity sold, revenue, and recent activity.
        </p>
      </div>

      {foodsCount === 0 ? (
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
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
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
                        <button
                          type="button"
                          onClick={() => onDeleteFood(food)}
                          disabled={deletingFoodId === food.id}
                          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          title={`Delete ${food.name}`}
                          aria-label={`Delete ${food.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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

                <button
                  type="button"
                  onClick={() => onDeleteFood(food)}
                  disabled={deletingFoodId === food.id}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingFoodId === food.id ? "Deleting..." : "Delete product"}
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
