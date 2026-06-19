import { LogOut, RefreshCw, Store } from "lucide-react";
import type { Vendor } from "./vendorDashboardTypes";

interface VendorDashboardHeaderProps {
  vendor: Vendor;
  onRefresh: () => void;
  onLogout: () => void;
}

export const VendorDashboardHeader = ({
  vendor,
  onRefresh,
  onLogout,
}: VendorDashboardHeaderProps) => {
  return (
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
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};
